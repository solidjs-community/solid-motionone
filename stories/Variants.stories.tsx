import type {Meta, StoryObj} from "storybook-solidjs-vite"
import {Motion} from "../src/index.jsx"

const meta = {
	title: "Motion/Variants",
} satisfies Meta

export default meta
type Story = StoryObj

/** String `variants`: `initial`/`animate` reference a key that's looked up in the `variants` map. */
export const StringVariants: Story = {
	render: () => (
		<Motion.div
			style={{width: "80px", height: "80px", "border-radius": "8px"}}
			initial="hidden"
			animate="visible"
			variants={{
				hidden: {opacity: 0, y: -20, backgroundColor: "royalblue"},
				visible: {opacity: 1, y: 0, backgroundColor: "royalblue", transition: {duration: 0.6}},
			}}
		/>
	),
}

/**
 * Nested variant-key *inheritance*: only the root sets `initial="hidden"`.
 * Each descendant has no `initial` of its own, so it inherits the *key*
 * "hidden" from its closest ancestor and resolves it against its *own*
 * `variants` map — matching ssr.test.tsx's "Children render inherited
 * initial" case, extended here with an explicit `animate="visible"` per
 * level (inheritance only applies to `initial`, not `animate`) so the
 * whole tree visibly animates in.
 */
export const NestedInheritance: Story = {
	render: () => (
		<Motion.div
			initial="hidden"
			animate="visible"
			variants={{
				hidden: {opacity: 0, backgroundColor: "crimson"},
				visible: {opacity: 1, backgroundColor: "crimson", transition: {duration: 0.6}},
			}}
			style={{padding: "24px"}}
		>
			<Motion.ul
				animate="visible"
				variants={{
					hidden: {y: 30, backgroundColor: "darkorange"},
					visible: {y: 0, backgroundColor: "darkorange", transition: {duration: 0.6, delay: 0.2}},
				}}
				style={{padding: "16px", "list-style": "none"}}
			>
				<Motion.li
					animate="visible"
					variants={{
						hidden: {backgroundColor: "seagreen"},
						visible: {backgroundColor: "seagreen", transition: {duration: 0.6, delay: 0.4}},
					}}
					style={{padding: "12px", color: "white"}}
				>
					Each level inherits the "hidden" key, resolved against its own variants.
				</Motion.li>
			</Motion.ul>
		</Motion.div>
	),
}

/** An empty `variants={{}}` map combined with `hover`/`press` — no crash, base (unstyled) render. */
export const EmptyVariants: Story = {
	render: () => (
		<Motion.div
			style={{width: "80px", height: "80px", "border-radius": "8px", background: "lightgray"}}
			hover={{opacity: 1}}
			press={{opacity: 1}}
			variants={{}}
		/>
	),
}
