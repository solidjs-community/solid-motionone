import {scrollInfo} from "framer-motion/dom"
import {isServer} from "@solidjs/web"

import {createMotionState, createStyles, MotionState, style} from "./engine.js"
import {Accessor, Context, createEffect, createSignal, flush, onCleanup, useContext} from "solid-js"

import {PresenceContext, PresenceContextState} from "./presence.jsx"
import {Options} from "./types.js"

/*
Solid 2.0's useContext throws ContextNotFoundError whenever the resolved value
is undefined, even with an explicit `undefined` default — there's no built-in
way to ask "is there a provider" without throwing. ParentContext/PresenceContext
are legitimately optional (most Motion components have neither an ancestor
Presence nor a parent Motion), so reads of them go through this instead.
*/
/** @internal */
export function tryUseContext<T>(context: Context<T>): T | undefined {
	try {
		return useContext(context)
	} catch {
		return undefined
	}
}

/** @internal */
export function createAndBindMotionState(
	el: () => Element,
	options: Accessor<Options>,
	presence_state?: PresenceContextState,
	parent_state?: MotionState,
): [MotionState, ReturnType<typeof createStyles>] {
	const state = createMotionState(
		presence_state?.initial === false ? {...options(), initial: false} : options(),
		parent_state,
	)

	/*
	Motion components under <Presence exitBeforeEnter> should wait before animating in
	this is done with additional signal, because effects will still run immediately
	*/
	createEffect(
		() => (presence_state ? presence_state.mount() : true),
		shouldMount => {
			if (!shouldMount) return

			const el_ref = el()
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- `el_ref` is typed non-nullable, but see the comment below for why this still needs a runtime check
			if (!el_ref) {
				/*
				Only reachable if the ref hasn't been assigned by the time this effect
				runs — normally impossible, since Solid assigns refs synchronously
				during render, before any effect fires. Historically this has only
				been seen when an app ends up with two copies of solid-js active at
				once (e.g. a linked/duplicated dependency), so this component's
				effects run on a different reactive graph than the one that set the
				ref. See https://github.com/solidjs-community/solid-motionone/issues/10
				*/
				throw new Error(
					"solid-motionone: element ref was not set before mount. This usually means " +
						"your app has more than one copy of solid-js installed — check for " +
						"duplicate/mismatched solid-js versions (e.g. with `npm ls solid-js`).",
				)
			}
			const unmount = state.mount(el_ref)

			return () => {
				if (presence_state && options().exit) {
					state.setActive("exit", true)
					el_ref.addEventListener("motioncomplete", unmount)
				} else unmount()
			}
		},
	)

	createEffect(
		() => (presence_state && !presence_state.mount() ? undefined : options()),
		opts => {
			if (opts) state.update(opts)
		},
	)

	return [state, createStyles(state.getTarget())] as const
}

/**
 * createMotion provides MotionOne as a compact Solid primitive.
 *
 * @param target Target Element to animate.
 * @param options Options to effect the animation.
 * @param presenceState Optional PresenceContext override, defaults to current parent.
 * @returns Object to access MotionState
 */
export function createMotion(
	target: Element,
	options: Accessor<Options> | Options,
	presenceState?: PresenceContextState,
): MotionState {
	const [state, styles] = createAndBindMotionState(
		() => target,
		typeof options === "function" ? options : () => options,
		presenceState,
	)

	for (const key in styles) {
		style.set(target, key, styles[key])
	}

	return state
}

/**
 * motion is a ref factory that makes binding to elements easier.
 *
 * @param options Options to effect the animation.
 * @returns A ref callback to pass to an element's `ref` prop.
 *
 * @example
 * ```tsx
 * <div ref={motion(() => ({ animate: { opacity: 1 } }))} />
 * ```
 */
export function motion(options: Accessor<Options>): (el: Element) => void {
	const presence_state = tryUseContext(PresenceContext)
	return el => {
		createMotion(el, options, presence_state)
	}
}

/*
`AxisScrollInfo`/`ScrollInfoOptions` aren't part of framer-motion/dom's public
export list (only the `scroll`/`scrollInfo` functions themselves are), so
derive them structurally from `scrollInfo`'s own signature instead.
*/
type ScrollInfoOptions = Parameters<typeof scrollInfo>[1]
type AxisScrollInfo = Parameters<Parameters<typeof scrollInfo>[0]>[0]["x"]

const emptyAxisScrollInfo = (): AxisScrollInfo => ({
	current: 0,
	offset: [],
	progress: 0,
	scrollLength: 0,
	velocity: 0,
	targetOffset: 0,
	targetLength: 0,
	containerLength: 0,
})

/**
 * useScroll provides reactive scroll progress values, based on Motion's
 * [`scrollInfo`](https://motion.dev/docs/scroll) function.
 *
 * @param options Options controlling which element/axis/offsets are tracked.
 * @returns Reactive accessors for the current scroll time and per-axis info.
 *
 * @example
 * ```tsx
 * const {scrollY} = useScroll()
 * createEffect(() => console.log(scrollY().progress))
 * ```
 */
export function useScroll(options?: ScrollInfoOptions): {
	time: Accessor<number>
	scrollX: Accessor<AxisScrollInfo>
	scrollY: Accessor<AxisScrollInfo>
} {
	const [time, setTime] = createSignal(0)
	const [scrollX, setScrollX] = createSignal<AxisScrollInfo>(emptyAxisScrollInfo())
	const [scrollY, setScrollY] = createSignal<AxisScrollInfo>(emptyAxisScrollInfo())

	/*
	No reactive dependency to track here, so this is a one-shot side effect —
	Solid 2.0's createEffect now requires both a compute and effect function,
	and its own error for this case says to just call directly instead. Since
	that skips the "effects don't run during SSR" guarantee that normally keeps
	DOM-only code out of the server build, guard explicitly with isServer.
	*/
	if (!isServer) {
		onCleanup(
			scrollInfo(info => {
				/*
				scrollInfo's callback fires from Motion's own rAF-driven scheduler,
				entirely outside Solid's — same situation as presence.tsx's
				onExit/onEnter, and needs the same explicit flush() so dependent
				effects/DOM actually update instead of the write sitting pending.

				info.x/info.y are also reused/mutated in place across frames by
				Motion internally, so they're shallow-copied here — writing the
				same object reference into a signal would never trip Solid's
				Object.is equality check and the signal would look unchanged.
				*/
				setTime(info.time)
				setScrollX({...info.x})
				setScrollY({...info.y})
				flush()
			}, options),
		)
	}

	return {time, scrollX, scrollY}
}
