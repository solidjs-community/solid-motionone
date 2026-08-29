import type {Meta, StoryObj} from "storybook-solidjs-vite"
import {createSignal} from "solid-js"
import {motion} from "../src/index.jsx"

const meta = {
	title: "Motion/Primitives",
} satisfies Meta

export default meta
type Story = StoryObj

/**
 * The `motion` ref factory is the non-component API: bind animation
 * behavior directly to a plain element's `ref`, without going through
 * `<Motion>`. Useful for animating an element you don't otherwise control
 * (e.g. one rendered by another library).
 */
export const RefFactory: Story = {
	render: () => (
		<div
			ref={motion(() => ({
				initial: {opacity: 0, y: -20},
				animate: {opacity: 1, y: 0},
				transition: {duration: 0.6},
			}))}
			style={{
				width: "80px",
				height: "80px",
				"border-radius": "8px",
				background: "royalblue",
			}}
		/>
	),
}

/** The ref factory's options accessor is reactive, same as a `<Motion>` component's props. */
export const ReactiveRefFactory: Story = {
	render: () => {
		const [opacity, setOpacity] = createSignal(0.3)
		return (
			<div>
				<button
					style={{"margin-bottom": "12px"}}
					onClick={() => setOpacity(o => (o === 0.3 ? 1 : 0.3))}
				>
					Toggle opacity
				</button>
				<div
					ref={motion(() => ({
						initial: {opacity: 0},
						animate: {opacity: opacity()},
						transition: {duration: 0.4},
					}))}
					style={{
						width: "80px",
						height: "80px",
						"border-radius": "8px",
						background: "seagreen",
					}}
				/>
			</div>
		)
	},
}
