import {createMotionState, createStyles, MotionState, style} from "./engine.js"
import {Accessor, Context, createEffect, useContext} from "solid-js"

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

			const el_ref = el(),
				unmount = state.mount(el_ref)

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
