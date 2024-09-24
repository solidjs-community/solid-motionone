import {
	AxisScrollInfo,
	createMotionState,
	createStyles,
	MotionState,
	style,
	scroll,
	ScrollOptions,
} from "@motionone/dom"
import {Accessor, batch, createEffect, createSignal, onCleanup, onMount, useContext} from "solid-js"

import {PresenceContext, PresenceContextState} from "./presence.jsx"
import {Options} from "./types.js"
import {createStore, produce} from "solid-js/store"

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

	createEffect(() => {
		/*
		Motion components under <Presence exitBeforeEnter> should wait before animating in
		this is done with additional signal, because effects will still run immediately
		*/
		if (presence_state && !presence_state.mount()) return

		const el_ref = el(),
			unmount = state.mount(el_ref)

		createEffect(() => state.update(options()))

		onCleanup(() => {
			if (presence_state && options().exit) {
				state.setActive("exit", true)
				el_ref.addEventListener("motioncomplete", unmount)
			} else unmount()
		})
	})

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

export function useScroll(options?: ScrollOptions): {
	time: Accessor<number>
	scrollX: AxisScrollInfo
	scrollY: AxisScrollInfo
} {
	const [time, setTime] = createSignal(0)
	const [scrollX, setScrollX] = createStore<AxisScrollInfo>({
		current: 0,
		offset: [],
		progress: 0,
		scrollLength: 0,
		velocity: 0,
		targetOffset: 0,
		targetLength: 0,
		containerLength: 0,
	})
	const [scrollY, setScrollY] = createStore<AxisScrollInfo>({
		current: 0,
		offset: [],
		progress: 0,
		scrollLength: 0,
		velocity: 0,
		targetOffset: 0,
		targetLength: 0,
		containerLength: 0,
	})

	onMount(() =>
		scroll(({time, x, y}) => {
			setTime(time)
			setScrollX(x)
			setScrollY(y)
		}, options),
	)

	return {time, scrollX, scrollY}
}

/**
 * motion is a Solid directive that makes binding to elements easier.
 *
 * @param el Target Element to bind to.
 * @param props Options to effect the animation.
 */
export function motion(el: Element, props: Accessor<Options>): void {
	createMotion(el, props, useContext(PresenceContext))
}
