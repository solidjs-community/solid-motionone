import type {Meta, StoryObj} from "storybook-solidjs-vite"
import {Motion} from "../src/index.jsx"

const meta = {
	title: "Motion/Rendering",
} satisfies Meta

export default meta
type Story = StoryObj

/** `<Motion>` renders a `div` by default. */
export const DefaultTag: Story = {
	render: () => (
		<Motion
			style={{
				width: "80px",
				height: "80px",
				background: "royalblue",
				"border-radius": "8px",
			}}
		/>
	),
}

/** `Motion.span`, `Motion.button`, `Motion.svg` etc. — the Proxy picks the tag from the property accessed. */
export const ProxyTags: Story = {
	render: () => (
		<div style={{display: "flex", gap: "16px", "align-items": "center"}}>
			<Motion.span style={{padding: "8px", background: "seagreen", color: "white"}}>
				span
			</Motion.span>
			<Motion.button style={{padding: "8px 16px"}}>button</Motion.button>
			<Motion.svg width="60" height="60" viewBox="0 0 60 60">
				<Motion.circle cx="30" cy="30" r="28" fill="darkorange" />
			</Motion.svg>
		</div>
	),
}

/** `<Motion tag="li">` — the same tag selection via an explicit prop instead of the proxy. */
export const ExplicitTagProp: Story = {
	render: () => (
		<ul>
			<Motion tag="li" style={{background: "plum", padding: "4px"}}>
				rendered as &lt;li&gt;
			</Motion>
		</ul>
	),
}

/** SVG attributes (`viewBox`, `width`, `x`, `y`) pass through alongside animated values. */
export const SvgAttrs: Story = {
	render: () => (
		<svg viewBox="0 0 120 120" width="120" height="120">
			<Motion.rect
				initial={{height: 20}}
				animate={{height: 80}}
				transition={{duration: 0.6}}
				width="50"
				x="10"
				y="10"
				fill="crimson"
			/>
		</svg>
	),
}

/** A user-supplied `style` (object or CSS string) is merged with Motion's computed style, not replaced by it. */
export const StyleMerging: Story = {
	render: () => (
		<div style={{display: "flex", gap: "16px"}}>
			<Motion.div
				style={{width: "80px", height: "80px", background: "teal", "border-radius": "8px"}}
				initial={{opacity: 0.3}}
				animate={{opacity: 1}}
				transition={{duration: 0.8}}
			/>
			<Motion.div
				style="width: 80px; height: 80px; background: indigo; border-radius: 8px"
				initial={{opacity: 0.3}}
				animate={{opacity: 1}}
				transition={{duration: 0.8}}
			/>
		</div>
	),
}
