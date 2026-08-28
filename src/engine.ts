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
Motion One used `easing`; modern Motion renamed it to `ease`. Translated here
so solid-motionone's existing, documented `transition={{easing: "..."}}` API
keeps working unchanged.
*/
function normalizeTransition(transition: unknown): AnimationOptions | undefined {
	if (!transition || typeof transition !== "object") return transition as AnimationOptions | undefined
	const result: Record<string, unknown> = {}
	for (const [key, value] of Object.entries(transition)) {
		const normalizedKey = key === "easing" ? "ease" : key
		result[normalizedKey] =
			value && typeof value === "object" && !Array.isArray(value)
				? normalizeTransition(value)
				: value
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

/** @internal */
export function createMotionState(
	initialOptions: Options,
	parent?: MotionState,
): MotionState {
	let options = initialOptions
	let element: Element | undefined
	let currentTransition: AnimationOptions | undefined
	const active = {hover: false, press: false, exit: false}
	let unbindGestures: (() => void) | undefined
	let cancelCurrentAnimation: (() => void) | undefined

	function getInitialVariantKey(): string | undefined {
		if (typeof options.initial === "string") return options.initial
		if (options.initial === undefined) return parent?.getInitialVariantKey()
		return undefined
	}

	function getStartTarget(): Target {
		const animateTarget = resolveTarget(options.animate, options.variants) ?? {}
		if (options.initial === false) return animateTarget
		if (options.initial === undefined) {
			const inheritedKey = getInitialVariantKey()
			return (inheritedKey && options.variants?.[inheritedKey]) || animateTarget
		}
		return resolveTarget(options.initial, options.variants) ?? animateTarget
	}

	function computeEffectiveTarget(): Target {
		if (active.exit) return resolveTarget(options.exit, options.variants) ?? {}
		const target: Target = {...(resolveTarget(options.animate, options.variants) ?? {})}
		if (active.hover) Object.assign(target, resolveTarget(options.hover, options.variants))
		if (active.press) Object.assign(target, resolveTarget(options.press, options.variants))
		return target
	}

	function animateToTarget(target: Target): Promise<void> {
		cancelCurrentAnimation?.()
		if (!element) return Promise.resolve()
		const values = targetValues(target)
		if (Object.keys(values).length === 0) return Promise.resolve()

		const transition = normalizeTransition({...currentTransition, ...target.transition})
		dispatch(element, "motionstart", {target})
		const controls = animate(element, values as any, transition as any)
		cancelCurrentAnimation = () => controls.stop()
		return controls.finished.then(
			() => {
				if (element) dispatch(element, "motioncomplete", {target})
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
			element = el
			currentTransition = normalizeTransition(options.transition)

			const startTarget = getStartTarget()
			applyStylesDirect(el, startTarget)

			const animateTarget = resolveTarget(options.animate, options.variants) ?? {}
			if (JSON.stringify(targetValues(startTarget)) !== JSON.stringify(targetValues(animateTarget))) {
				void animateToTarget(animateTarget)
			}

			unbindGestures = bindGestures(el)
			mountedStates.set(el, state)

			return () => {
				cancelCurrentAnimation?.()
				unbindGestures?.()
				if (element) mountedStates.delete(element)
				element = undefined
			}
		},
		update(newOptions: Options) {
			const prevAnimate = JSON.stringify(resolveTarget(options.animate, options.variants) ?? {})
			options = newOptions
			currentTransition = normalizeTransition(options.transition)
			unbindGestures?.()
			if (element) unbindGestures = bindGestures(element)

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
