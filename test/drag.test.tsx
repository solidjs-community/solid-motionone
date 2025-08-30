import { vi } from "vitest"
import { render } from "@solidjs/testing-library"
import { Motion } from "../src/index.jsx"

describe("Drag System", () => {
	it("should render Motion component with drag prop", async () => {
		render(() => (
			<Motion.div
				drag
				dragConstraints={{ left: 0, right: 300 }}
				style={{ width: "100px", height: "100px", background: "red" }}
			>
				Draggable Element
			</Motion.div>
		))

		// The component should render without errors
		expect(document.querySelector("div")).toBeTruthy()
	})

	it("should render Motion component with drag callbacks", async () => {
		const onDragStart = vi.fn()
		const onDrag = vi.fn()
		const onDragEnd = vi.fn()

		render(() => (
			<Motion.div
				drag
				onDragStart={onDragStart}
				onDrag={onDrag}
				onDragEnd={onDragEnd}
				style={{ width: "100px", height: "100px", background: "blue" }}
			>
				Draggable with Callbacks
			</Motion.div>
		))

		// The component should render without errors
		expect(document.querySelector("div")).toBeTruthy()
	})

	it("should render Motion component with whileDrag variant", async () => {
		render(() => (
			<Motion.div
				drag
				whileDrag={{ scale: 1.1 }}
				style={{ width: "100px", height: "100px", background: "green" }}
			>
				Draggable with Variant
			</Motion.div>
		))

		// The component should render without errors
		expect(document.querySelector("div")).toBeTruthy()
	})

	it("should render Motion component with drag constraints", async () => {
		render(() => (
			<Motion.div
				drag
				dragConstraints={{ left: 0, right: 300, top: 0, bottom: 200 }}
				dragElastic={0.2}
				style={{ width: "100px", height: "100px", background: "purple" }}
			>
				Constrained Draggable
			</Motion.div>
		))

		// The component should render without errors
		expect(document.querySelector("div")).toBeTruthy()
	})
})
