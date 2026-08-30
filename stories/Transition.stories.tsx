import type {Meta, StoryObj} from "storybook-solidjs-vite"
import {Motion} from "../src/index.jsx"

const meta = {
	title: "Motion/Transition",
} satisfies Meta

export default meta
type Story = StoryObj

const box = {
	width: "80px",
	height: "80px",
	"border-radius": "8px",
	background: "royalblue",
} as const

/** Global `transition`: `duration` plus `easing` (Motion One's naming — translated internally to modern Motion's `ease`). */
export const GlobalTransition: Story = {
	render: () => (
		<Motion.div
			style={box}
			initial={{rotate: 0, backgroundColor: "royalblue"}}
			animate={{rotate: 90, backgroundColor: "goldenrod"}}
			transition={{duration: 1.2, easing: "ease-in-out"}}
		/>
	),
}

/** Per-property transition override: `rotate` runs on its own, slower schedule than the other properties. */
export const PerPropertyOverride: Story = {
	render: () => (
		<Motion.div
			style={box}
			initial={{rotate: 0, opacity: 0.3}}
			animate={{rotate: 180, opacity: 1}}
			transition={{duration: 0.4, rotate: {duration: 2}}}
		/>
	),
}

/** Per-target transition override: the target object's own `transition` wins over the component-level one. */
export const PerTargetOverride: Story = {
	render: () => (
		<Motion.div
			style={box}
			initial={{opacity: 0.3}}
			animate={{opacity: 1, transition: {duration: 2}}}
			transition={{duration: 0.1}}
		/>
	),
}

/** Keyframe arrays: `x` steps through every value in the array, evenly spaced across `duration`. */
export const KeyframeArray: Story = {
	render: () => (
		<Motion.div
			style={box}
			animate={{x: [0, 150, 0, 80, 0]}}
			transition={{duration: 2}}
		/>
	),
}

/** Keyframes with a custom `offset`: skews where in the timeline each step lands. */
export const KeyframeOffset: Story = {
	render: () => (
		<Motion.div
			style={box}
			animate={{x: [0, 150, 50]}}
			transition={{duration: 2, x: {offset: [0, 0.15, 1]}}}
		/>
	),
}
