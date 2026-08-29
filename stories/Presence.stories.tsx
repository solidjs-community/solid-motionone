import type {Meta, StoryObj} from "storybook-solidjs-vite"
import {expect, userEvent, waitFor, within} from "storybook/test"
import {createSignal, Show} from "solid-js"
import {Motion, Presence} from "../src/index.jsx"

const meta = {
	title: "Motion/Presence",
} satisfies Meta

export default meta
type Story = StoryObj

const box = {
	width: "80px",
	height: "80px",
	"border-radius": "8px",
} as const

/**
 * Basic enter/exit: removing the element from a `<Show>` inside `<Presence>`
 * animates it out via `exit` before it actually leaves the DOM (rather than
 * disappearing instantly). The play function drives the toggle and proves
 * the element is still present mid-exit, then gone once the animation ends —
 * then toggles back on so the story doesn't land on an empty canvas.
 */
export const BasicEnterExit: Story = {
	render: () => {
		const [show, setShow] = createSignal(true)
		return (
			<div>
				<button data-testid="toggle" onClick={() => setShow(s => !s)}>
					Toggle
				</button>
				<Presence>
					<Show when={show()}>
						<Motion.div
							data-testid="box"
							style={{...box, background: "royalblue"}}
							initial={{opacity: 0, scale: 0.6}}
							animate={{opacity: 1, scale: 1}}
							exit={{opacity: 0, scale: 0.6}}
							transition={{duration: 0.3}}
						/>
					</Show>
				</Presence>
			</div>
		)
	},
	play: async ({canvasElement}) => {
		const canvas = within(canvasElement)
		await waitFor(() => expect(canvas.getByTestId("box")).toBeInTheDocument())

		await userEvent.click(canvas.getByTestId("toggle"))
		// still present immediately after toggling off — exit animation hasn't finished
		expect(canvas.getByTestId("box")).toBeInTheDocument()
		// gone once the exit animation completes and Presence removes it
		await waitFor(() => expect(canvas.queryByTestId("box")).not.toBeInTheDocument(), {
			timeout: 3000,
		})

		await userEvent.click(canvas.getByTestId("toggle"))
		await waitFor(() => expect(canvas.getByTestId("box")).toBeInTheDocument())
	},
}

/**
 * `<Presence initial={false}>` suppresses the *first* enter animation for
 * every child — the `animate` target applies immediately instead.
 */
export const PresenceInitialFalse: Story = {
	render: () => (
		<Presence initial={false}>
			<Motion.div
				data-testid="box"
				style={{...box, background: "seagreen"}}
				initial={{opacity: 0}}
				animate={{opacity: 1}}
				transition={{duration: 2}}
			/>
		</Presence>
	),
	play: async ({canvasElement}) => {
		const canvas = within(canvasElement)
		const el = canvas.getByTestId("box") as HTMLElement
		// applied immediately (no 2s transition ever ran) — opacity is already 1
		await waitFor(() => expect(getComputedStyle(el).opacity).toBe("1"))
	},
}

/**
 * `exitBeforeEnter` (mode "out-in"): the incoming element's enter animation
 * waits for the outgoing element's exit to finish, instead of running in
 * parallel. This exercises the exact multi-cycle swap that used to hang in
 * jsdom (fixed by scoping mount-cycle cleanup in engine.ts) — this story is
 * its permanent, real-browser regression check.
 */
export const ExitBeforeEnter: Story = {
	render: () => {
		const [condition, setCondition] = createSignal(true)
		const El = (props: {label: string; color: string}) => (
			<Motion.div
				data-testid={`box-${props.label}`}
				style={{...box, background: props.color}}
				initial={{opacity: 0}}
				animate={{opacity: 1}}
				exit={{opacity: 0}}
				transition={{duration: 0.2}}
			/>
		)
		return (
			<div>
				<button data-testid="toggle" onClick={() => setCondition(c => !c)}>
					Swap
				</button>
				<Presence exitBeforeEnter>
					<Show
						when={condition()}
						children={<El label="a" color="royalblue" />}
						fallback={<El label="b" color="crimson" />}
					/>
				</Presence>
			</div>
		)
	},
	play: async ({canvasElement}) => {
		const canvas = within(canvasElement)
		await waitFor(() => expect(canvas.getByTestId("box-a")).toBeInTheDocument())

		await userEvent.click(canvas.getByTestId("toggle"))
		// box-a exits first; box-b must not appear until box-a is fully gone
		await waitFor(() => expect(canvas.queryByTestId("box-a")).not.toBeInTheDocument(), {
			timeout: 2000,
		})
		await waitFor(() => expect(canvas.getByTestId("box-b")).toBeInTheDocument())

		await userEvent.click(canvas.getByTestId("toggle"))
		await waitFor(() => expect(canvas.queryByTestId("box-b")).not.toBeInTheDocument(), {
			timeout: 2000,
		})
		await waitFor(() => expect(canvas.getByTestId("box-a")).toBeInTheDocument())
	},
}

/**
 * Multiple nested descendants each have their own `exit` — every one must
 * finish its own exit animation before the whole subtree is removed.
 */
export const NestedExit: Story = {
	render: () => {
		const [show, setShow] = createSignal(true)
		const exit = {opacity: 0, transition: {duration: 0.5}}
		return (
			<div>
				<button data-testid="toggle" onClick={() => setShow(s => !s)}>
					Toggle
				</button>
				<Presence>
					<Show when={show()}>
						<Motion.div data-testid="parent" style={{...box, background: "royalblue"}} exit={exit}>
							<Motion.div
								data-testid="child"
								style={{width: "40px", height: "40px", background: "crimson"}}
								exit={exit}
							/>
						</Motion.div>
					</Show>
				</Presence>
			</div>
		)
	},
	// round-trips back to the visible state so the story doesn't land on an
	// empty canvas after the automated demonstration finishes — a 0.001s
	// duration (fast enough for jsdom-based unit tests) also finishes far too
	// quickly to actually see, so this uses a human-visible 0.5s instead.
	play: async ({canvasElement}) => {
		const canvas = within(canvasElement)
		await waitFor(() => expect(canvas.getByTestId("parent")).toBeInTheDocument())

		await userEvent.click(canvas.getByTestId("toggle"))
		await waitFor(() => expect(canvas.queryByTestId("parent")).not.toBeInTheDocument(), {
			timeout: 2000,
		})

		await userEvent.click(canvas.getByTestId("toggle"))
		await waitFor(() => expect(canvas.getByTestId("parent")).toBeInTheDocument())
	},
}

/** `exit` can carry its own `transition`, overriding the component's base transition just for the exit phase. */
export const ExitTransitionOverride: Story = {
	render: () => {
		const [show, setShow] = createSignal(true)
		return (
			<div>
				<button data-testid="toggle" onClick={() => setShow(s => !s)}>
					Toggle
				</button>
				<Presence>
					<Show when={show()}>
						<Motion.div
							data-testid="box"
							style={{...box, background: "darkorange"}}
							animate={{opacity: 1}}
							exit={{opacity: 0, transition: {duration: 1.5}}}
							transition={{duration: 0.1}}
						/>
					</Show>
				</Presence>
			</div>
		)
	},
}
