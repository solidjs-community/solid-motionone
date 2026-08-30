import type {Meta, StoryObj} from "storybook-solidjs-vite"
import {createSignal} from "solid-js"
import {Motion} from "../src/index.jsx"

const meta = {
	title: "Motion/Animate",
} satisfies Meta

export default meta
type Story = StoryObj

const box = {
	width: "80px",
	height: "80px",
	"border-radius": "8px",
	background: "royalblue",
} as const

/** `initial` -> `animate`: the element animates from its initial style to the animate target on mount. */
export const BasicEnter: Story = {
	render: () => (
		<Motion.div style={box} initial={{opacity: 0, scale: 0.5}} animate={{opacity: 1, scale: 1}} />
	),
}

/** `initial={false}`: the enter animation is skipped — `animate` values apply immediately, no transition. */
export const InitialFalse: Story = {
	render: () => <Motion.div style={box} initial={false} animate={{opacity: 1, x: 100}} />,
}

/** When `initial` and `animate` resolve to the same target, no animation runs and `onMotionComplete` never fires. */
export const NoOpWhenEqual: Story = {
	render: () => {
		const target = {opacity: 0.6}
		let fired = false
		return (
			<div>
				<Motion.div
					style={box}
					initial={target}
					animate={target}
					onMotionComplete={() => (fired = true)}
				/>
				<p>
					If this library is working correctly, no animation ever starts here (no
					onMotionComplete), since initial already equals animate.
				</p>
			</div>
		)
	},
}

/** Changing a signal fed into `animate` reactively re-triggers the animation to the new target. */
export const ReactiveAnimateChange: Story = {
	render: () => {
		const [color, setColor] = createSignal("crimson")
		return (
			<div>
				<Motion.button
					style={{padding: "8px 16px", "margin-bottom": "12px"}}
					onClick={() => setColor(c => (c === "crimson" ? "royalblue" : "crimson"))}
				>
					Toggle color
				</Motion.button>
				<Motion.div
					style={{width: box.width, height: box.height, "border-radius": box["border-radius"]}}
					animate={{backgroundColor: color()}}
					transition={{duration: 0.5}}
				/>
			</div>
		)
	},
}
