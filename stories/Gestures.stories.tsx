import type {Meta, StoryObj} from "storybook-solidjs-vite"
import {createSignal} from "solid-js"
import {Motion} from "../src/index.jsx"

const meta = {
	title: "Motion/Gestures",
} satisfies Meta

export default meta
type Story = StoryObj

const box = {
	width: "80px",
	height: "80px",
	"border-radius": "8px",
	background: "royalblue",
} as const

/** `hover` — hovering the box animates it to the hover target; leaving animates back. */
export const Hover: Story = {
	render: () => {
		const [status, setStatus] = createSignal("idle")
		return (
			<div>
				<p>hover: {status()}</p>
				<Motion.div
					style={box}
					hover={{scale: 1.2, backgroundColor: "seagreen"}}
					transition={{duration: 0.15}}
					onHoverStart={() => setStatus("active")}
					onHoverEnd={() => setStatus("idle")}
				/>
			</div>
		)
	},
}

/** `press` — pressing and releasing animates to/from the press target. */
export const Press: Story = {
	render: () => {
		const [status, setStatus] = createSignal("idle")
		return (
			<div>
				<p>press: {status()}</p>
				<Motion.div
					style={box}
					press={{scale: 0.85, backgroundColor: "crimson"}}
					transition={{duration: 0.1}}
					onPressStart={() => setStatus("active")}
					onPressEnd={() => setStatus("idle")}
				/>
			</div>
		)
	},
}

/**
 * `hover` + `press` together: computeEffectiveTarget layers press on top of hover
 * (`Object.assign` order), so pressing while already hovering should show the
 * press target win over the hover one for any overlapping keys.
 */
export const HoverAndPressComposition: Story = {
	render: () => {
		const [hoverStatus, setHoverStatus] = createSignal("idle")
		const [pressStatus, setPressStatus] = createSignal("idle")
		return (
			<div>
				<p>hover: {hoverStatus()}</p>
				<p>press: {pressStatus()}</p>
				<p>Hover first (scales to 1.15, turns orange), then press while hovering (should scale to 0.85, turn crimson).</p>
				<Motion.div
					style={box}
					hover={{scale: 1.15, backgroundColor: "darkorange"}}
					press={{scale: 0.85, backgroundColor: "crimson"}}
					transition={{duration: 0.15}}
					onHoverStart={() => setHoverStatus("active")}
					onHoverEnd={() => setHoverStatus("idle")}
					onPressStart={() => setPressStatus("active")}
					onPressEnd={() => setPressStatus("idle")}
				/>
			</div>
		)
	},
}
