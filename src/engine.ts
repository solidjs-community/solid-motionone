import {animate} from "framer-motion/dom"
import {inView as motionInView} from "framer-motion/dom"
import {hover, press, buildHTMLStyles} from "motion-dom"
import type {AnimationOptions} from "motion-dom"

import type {Options, Target, VariantDefinition} from "./types.js"

/** @internal */
export const mountedStates = new WeakMap<Element, MotionState>()

/** @internal */
export interface MotionState {
	mount(el: Element): () => void
	update(options: Options): void
	setActive(type: "exit", isActive: boolean): Promise<void>
	getTarget(): Target
	getOptions(): Options
	/** @internal the resolved `initial` variant key, inherited from a parent Motion if unset here */
	getInitialVariantKey(): string | undefined
}

function resolveTarget(
	def: VariantDefinition | undefined,
	variants: Record<string, Target> | undefined,
): Target | undefined {
	if (def === undefined) return undefined
	return typeof def === "string" ? variants?.[def] : def
}

/*
Two compatibility shims for the documented `transition={{duration, key: {...}}}`
per-value override syntax:

1. Motion One used `easing`; modern Motion renamed it to `ease`.
2. Motion One's per-value override only needed to specify what differs from
   the base transition (the rest was inherited). Modern Motion's own
   `resolveTransition` only merges a per-value override with its parent when
   the override explicitly sets `inherit: true` — otherwise the override is
   used standalone and silently falls back to Motion's own defaults for
   anything it didn't specify (e.g. `x: {offset: [...]}` with no `duration`
   of its own completes almost instantly instead of over the base duration).
   Merging here keeps the documented, more ergonomic behavior working.
*/
function normalizeTransition(transition: unknown): AnimationOptions | undefined {
	if (!transition || typeof transition !== "object") return transition as AnimationOptions | undefined

	const base: Record<string, unknown> = {}
	const perValue: Record<string, Record<string, unknown>> = {}
	for (const [key, value] of Object.entries(transition)) {
		if (value && typeof value === "object" && !Array.isArray(value)) perValue[key] = value
		else base[key === "easing" ? "ease" : key] = value
	}

	const result: Record<string, unknown> = {...base}
	for (const [key, override] of Object.entries(perValue)) {
		const normalizedOverride = {...base}
		for (const [k, v] of Object.entries(override)) normalizedOverride[k === "easing" ? "ease" : k] = v
		result[key] = normalizedOverride
	}
	return result as AnimationOptions
}

function targetValues(target: Target | undefined): Record<string, unknown> {
	if (!target) return {}
	const {transition: _transition, ...values} = target
	return values
}

/** @internal */
export function createStyles(target: Target): Record<string, string> {
	const renderState = {transform: {}, transformOrigin: {}, vars: {}, style: {}}
	// a static (non-animated) style can't represent a keyframe list — use its first value
	const staticValues: Record<string, unknown> = {}
	for (const [key, value] of Object.entries(targetValues(target))) {
		staticValues[key] = Array.isArray(value) ? value[0] : value
	}
	buildHTMLStyles(renderState as any, staticValues as any)
	return {...(renderState.vars as any), ...(renderState.style as any)}
}

/** @internal */
export const style = {
	set(el: Element, key: string, value: unknown): void {
		if (key.startsWith("--")) (el as HTMLElement).style.setProperty(key, String(value))
		else (el as HTMLElement).style[key as any] = value as string
	},
}

function applyStylesDirect(el: Element, target: Target): void {
	const styles = createStyles(target)
	for (const key in styles) style.set(el, key, styles[key])
}

function dispatch(el: Element, type: string, detail: Record<string, unknown>): void {
	el.dispatchEvent(new CustomEvent(type, {detail}))
}

interface MountContext {
	element: Element
	cancelAnimation?: () => void
	unbindGestures?: () => void
}

/** @internal */
export function createMotionState(
	initialOptions: Options,
	parent?: MotionState,
): MotionState {
	let options = initialOptions
	const active = {hover: false, press: false, exit: false}

	/*
	Scoped to whichever mount() call is currently active. A sibling Motion
	component can get constructed — and briefly mounted/unmounted again —
	before its real mount, as a structural side effect of how <Show>/
	createSwitchTransition read reactive sources (see primitives.ts's
	mount-gating effect). That stale cycle's own cleanup must never reach
	into a *newer* mount's in-flight animation or gesture bindings and
	cancel them; keeping this per-mount-context, and only ever pointing
	`current` at the latest one, keeps the two cycles from interfering.
	*/
	let current: MountContext | undefined

	function getInitialVariantKey(): string | undefined {
		if (typeof options.initial === "string") return options.initial
		if (options.initial === undefined) return parent?.getInitialVariantKey()
		return undefined
	}

	function getStartTarget(): Target {
		if (options.initial === false) {
			return resolveTarget(options.animate, options.variants) ?? {}
		}
		if (options.initial === undefined) {
			/*
			No explicit `initial` and nothing inherited from a parent's variant
			key: leave the starting style empty (browser defaults) rather than
			falling back to the `animate` target. Falling back to `animate` here
			made mount()'s "does the start differ from the target" check always
			see them as equal, silently skipping the enter animation entirely —
			breaking the documented default behavior ("elements automatically
			animate to the values defined in animate when they're created").
			*/
			const inheritedKey = getInitialVariantKey()
			return (inheritedKey && options.variants?.[inheritedKey]) || {}
		}
		return resolveTarget(options.initial, options.variants) ?? {}
	}

	function computeEffectiveTarget(): Target {
		if (active.exit) return resolveTarget(options.exit, options.variants) ?? {}
		const target: Target = {...(resolveTarget(options.animate, options.variants) ?? {})}
		if (active.hover) Object.assign(target, resolveTarget(options.hover, options.variants))
		if (active.press) Object.assign(target, resolveTarget(options.press, options.variants))
		return target
	}

	function animateToTarget(target: Target): Promise<void> {
		const ctx = current
		ctx?.cancelAnimation?.()
		if (!ctx) return Promise.resolve()
		const values = targetValues(target)
		if (Object.keys(values).length === 0) return Promise.resolve()

		// merge, then normalize once — normalizing an already-normalized base
		// transition again would re-merge its own per-value overrides against a
		// *new* base and let stale, already-baked-in override values win
		const transition = normalizeTransition({...options.transition, ...target.transition})
		dispatch(ctx.element, "motionstart", {target})
		const controls = animate(ctx.element, values as any, transition as any)
		ctx.cancelAnimation = () => controls.stop()
		return controls.finished.then(
			() => {
				// don't dispatch on behalf of a mount cycle a newer one has superseded
				if (current === ctx) dispatch(ctx.element, "motioncomplete", {target})
			},
			// swallow: `finished` rejects when an in-flight animation is cancelled/replaced
			() => undefined,
		)
	}

	function bindGestures(el: Element): () => void {
		const unbinds: Array<() => void> = []
		if (options.hover) {
			unbinds.push(
				hover(el, (_el, startEvent) => {
					active.hover = true
					dispatch(el, "hoverstart", {originalEvent: startEvent})
					void animateToTarget(computeEffectiveTarget())
					return endEvent => {
						active.hover = false
						dispatch(el, "hoverend", {originalEvent: endEvent})
						void animateToTarget(computeEffectiveTarget())
					}
				}),
			)
		}
		if (options.press) {
			unbinds.push(
				press(el, (_el, startEvent) => {
					active.press = true
					dispatch(el, "pressstart", {originalEvent: startEvent})
					void animateToTarget(computeEffectiveTarget())
					return endEvent => {
						active.press = false
						dispatch(el, "pressend", {originalEvent: endEvent})
						void animateToTarget(computeEffectiveTarget())
					}
				}),
			)
		}
		if (options.inView) {
			unbinds.push(
				motionInView(
					el,
					(entry: any) => {
						dispatch(el, "viewenter", {originalEntry: entry})
						void animateToTarget({
							...(resolveTarget(options.animate, options.variants) ?? {}),
							...resolveTarget(options.inView, options.variants),
						})
						return leaveEntry => {
							dispatch(el, "viewleave", {originalEntry: leaveEntry})
							void animateToTarget(computeEffectiveTarget())
						}
					},
					options.inViewOptions as any,
				),
			)
		}
		return () => unbinds.forEach(unbind => unbind())
	}

	const state: MotionState = {
		mount(el: Element) {
			const ctx: MountContext = {element: el}
			current = ctx

			const startTarget = getStartTarget()
			applyStylesDirect(el, startTarget)

			const animateTarget = resolveTarget(options.animate, options.variants) ?? {}
			if (JSON.stringify(targetValues(startTarget)) !== JSON.stringify(targetValues(animateTarget))) {
				void animateToTarget(animateTarget)
			}

			ctx.unbindGestures = bindGestures(el)
			mountedStates.set(el, state)

			return () => {
				ctx.cancelAnimation?.()
				ctx.unbindGestures?.()
				mountedStates.delete(el)
				if (current === ctx) current = undefined
			}
		},
		update(newOptions: Options) {
			const prevOptions = options
			const prevAnimate = JSON.stringify(resolveTarget(prevOptions.animate, prevOptions.variants) ?? {})
			options = newOptions

			// only tear down and recreate gesture listeners when a gesture-related
			// prop actually changed — not on every unrelated reactive update (e.g.
			// a reactive `animate` value), which would cut off an in-progress
			// hover/press/inView interaction for no reason
			const gesturesChanged =
				prevOptions.hover !== options.hover ||
				prevOptions.press !== options.press ||
				prevOptions.inView !== options.inView ||
				prevOptions.inViewOptions !== options.inViewOptions
			if (gesturesChanged && current) {
				current.unbindGestures?.()
				current.unbindGestures = bindGestures(current.element)
			}

			const nextAnimate = resolveTarget(options.animate, options.variants) ?? {}
			if (!active.exit && prevAnimate !== JSON.stringify(nextAnimate)) {
				void animateToTarget(computeEffectiveTarget())
			}
		},
		setActive(type: "exit", isActive: boolean) {
			active[type] = isActive
			return animateToTarget(computeEffectiveTarget())
		},
		getTarget: getStartTarget,
		getOptions: () => options,
		getInitialVariantKey,
	}
	return state
}
