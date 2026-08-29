import {mountedStates} from "./engine.js"
import {resolveFirst} from "@solid-primitives/refs"
import {createSwitchTransition} from "@solid-primitives/transition-group"
import {createContext, createSignal, flush, type FlowComponent, type Accessor} from "solid-js"
import type {JSX} from "@solidjs/web"

export type PresenceContextState = {
	initial: boolean
	mount: Accessor<boolean>
}
export const PresenceContext = createContext<PresenceContextState | undefined>(undefined)

/**
 * Perform exit/enter trantisions of children `<Motion>` components.
 *
 * accepts props:
 * - `initial` – *(Defaults to `true`)* – If `false`, will disable the first animation on all child `Motion` elements the first time `Presence` is rendered.
 * - `exitBeforeEnter` – *(Defaults to `false`)* – If `true`, `Presence` will wait for the exiting element to finish animating out before animating in the next one.
 *
 * @example
 * ```tsx
 * <Presence exitBeforeEnter>
 *   <Show when={toggle()}>
 *     <Motion.div
 *       initial={{ opacity: 0 }}
 *       animate={{ opacity: 1 }}
 *       exit={{ opacity: 0 }}
 *     />
 *   </Show>
 * </Presence>
 * ```
 */
export const Presence: FlowComponent<{
	initial?: boolean
	exitBeforeEnter?: boolean
}> = props => {
	/*
	onEnter/onExit below are invoked synchronously from inside
	createSwitchTransition's own createRenderEffect — an owned reactive
	scope — so this internal signal needs ownedWrite to allow writing to it
	from there without Solid 2.0 throwing REACTIVE_WRITE_IN_OWNED_SCOPE.
	*/
	const [mount, setMount] = createSignal(true, {ownedWrite: true}),
		state = {initial: props.initial ?? true, mount},
		render = (
			<PresenceContext value={state}>
				{
					createSwitchTransition(
						resolveFirst(() => props.children),
						{
							appear: state.initial,
							mode: props.exitBeforeEnter ? "out-in" : "parallel",
							onExit(el, done) {
								/*
								onExit/onEnter run from a `motioncomplete` DOM CustomEvent
								listener — outside Solid's own scheduler — so signal writes
								here need an explicit flush to reach dependent effects (e.g.
								a sibling Motion's mount-gating effect) before this returns.
								*/
								setMount(false)
								flush()
								mountedStates.get(el)?.getOptions().exit
									? el.addEventListener("motioncomplete", () => {
											/*
											`done` (transition-group's own callback) writes the
											signal that actually removes this element from the
											rendered list — also outside Solid's scheduler, so it
											needs its own flush to take effect before callers see it.
											*/
											done()
											flush()
										})
									: done()
							},
							onEnter(_, done) {
								setMount(true)
								flush()
								done()
							},
						},
					) as any as JSX.Element
				}
			</PresenceContext>
		)

	queueMicrotask(() => (state.initial = true))
	return render
}
