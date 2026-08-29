import type {Meta, StoryObj} from "storybook-solidjs-vite"
import {createSignal} from "solid-js"
import {Motion} from "../src/index.jsx"

const meta = {
	title: "Motion/InView",
} satisfies Meta

export default meta
type Story = StoryObj

const box = {
	width: "80px",
	height: "80px",
	"border-radius": "8px",
	background: "seagreen",
} as const

/**
 * `inView` — scroll the box into the viewport to trigger its inView target;
 * scroll it back out to reverse. This prop has no automated test coverage
 * (relies on IntersectionObserver, which jsdom doesn't implement), so this
 * story is the first real, browser-driven verification of it.
 */
export const ScrollTrigger: Story = {
	render: () => {
		const [status, setStatus] = createSignal("not yet")
		return (
			<div>
				<p style={{position: "sticky", top: "0", background: "white"}}>inView: {status()}</p>
				<p>Scroll down to bring the box into view.</p>
				<div style={{height: "700px"}} />
				<Motion.div
					style={box}
					inView={{scale: 1.3, backgroundColor: "#ffcc00"}}
					transition={{duration: 0.3}}
					onViewEnter={() => setStatus("entered")}
					onViewLeave={() => setStatus("left")}
				/>
				<div style={{height: "700px"}} />
			</div>
		)
	},
}

/** `inViewOptions.amount` — requires more of the element to be visible before triggering. */
export const AmountOption: Story = {
	render: () => {
		const [status, setStatus] = createSignal("not yet")
		return (
			<div>
				<p style={{position: "sticky", top: "0", background: "white"}}>inView (amount: 0.8): {status()}</p>
				<p>Requires 80% of the box visible before triggering — scroll slowly.</p>
				<div style={{height: "700px"}} />
				<Motion.div
					style={box}
					inView={{scale: 1.3, backgroundColor: "#ffcc00"}}
					inViewOptions={{amount: 0.8}}
					transition={{duration: 0.3}}
					onViewEnter={() => setStatus("entered")}
					onViewLeave={() => setStatus("left")}
				/>
				<div style={{height: "700px"}} />
			</div>
		)
	},
}
