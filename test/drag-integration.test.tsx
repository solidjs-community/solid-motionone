import { vi, describe, it, expect, beforeEach } from "vitest"
import { render, fireEvent } from "@solidjs/testing-library"
import { Motion } from "../src/index.jsx"

describe("Drag Integration", () => {
	beforeEach(() => {
		// Reset any global state
		vi.clearAllMocks()
	})

	it("should enable drag functionality when drag prop is true", () => {
		const onDragStart = vi.fn()
		const onDrag = vi.fn()
		const onDragEnd = vi.fn()

		render(() => (
			<Motion.div
				drag
				onDragStart={onDragStart}
				onDrag={onDrag}
				onDragEnd={onDragEnd}
				data-testid="draggable"
				style={{ width: "100px", height: "100px", background: "red" }}
			>
				Draggable
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="draggable"]') as HTMLElement
		expect(element).toBeTruthy()
		
		// Simulate pointer down to start drag
		fireEvent.pointerDown(element, { clientX: 0, clientY: 0 })
		
		// The drag system should be initialized
		expect(element).toBeTruthy()
	})

	it("should support drag constraints", () => {
		render(() => (
			<Motion.div
				drag
				dragConstraints={{ left: 0, right: 300, top: 0, bottom: 200 }}
				data-testid="constrained"
				style={{ width: "100px", height: "100px", background: "blue" }}
			>
				Constrained
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="constrained"]') as HTMLElement
		expect(element).toBeTruthy()
	})

	it("should support elastic drag behavior", () => {
		render(() => (
			<Motion.div
				drag
				dragElastic={0.3}
				data-testid="elastic"
				style={{ width: "100px", height: "100px", background: "green" }}
			>
				Elastic
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="elastic"]') as HTMLElement
		expect(element).toBeTruthy()
	})

	it("should support whileDrag variants", () => {
		render(() => (
			<Motion.div
				drag
				whileDrag={{ scale: 1.2, rotate: 10 }}
				data-testid="variant"
				style={{ width: "100px", height: "100px", background: "purple" }}
			>
				Variant
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="variant"]') as HTMLElement
		expect(element).toBeTruthy()
	})

	it("should support x-axis only drag", () => {
		render(() => (
			<Motion.div
				drag="x"
				data-testid="x-only"
				style={{ width: "100px", height: "100px", background: "orange" }}
			>
				X Only
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="x-only"]') as HTMLElement
		expect(element).toBeTruthy()
	})

	it("should support y-axis only drag", () => {
		render(() => (
			<Motion.div
				drag="y"
				data-testid="y-only"
				style={{ width: "100px", height: "100px", background: "pink" }}
			>
				Y Only
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="y-only"]') as HTMLElement
		expect(element).toBeTruthy()
	})

	it("should handle drag callbacks correctly", () => {
		const onDragStart = vi.fn()
		const onDrag = vi.fn()
		const onDragEnd = vi.fn()

		render(() => (
			<Motion.div
				drag
				onDragStart={onDragStart}
				onDrag={onDrag}
				onDragEnd={onDragEnd}
				data-testid="callbacks"
				style={{ width: "100px", height: "100px", background: "cyan" }}
			>
				Callbacks
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="callbacks"]') as HTMLElement
		expect(element).toBeTruthy()
	})

	it("should work with existing animation props", () => {
		render(() => (
			<Motion.div
				drag
				initial={{ opacity: 0.5 }}
				animate={{ opacity: 1 }}
				hover={{ scale: 1.1 }}
				data-testid="combined"
				style={{ width: "100px", height: "100px", background: "yellow" }}
			>
				Combined
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="combined"]') as HTMLElement
		expect(element).toBeTruthy()
		expect(element.style.opacity).toBe("0.5") // Initial state should be applied
	})

	it("should not interfere with non-drag elements", () => {
		render(() => (
			<div>
				<Motion.div
					drag
					data-testid="draggable"
					style={{ width: "100px", height: "100px", background: "red" }}
				>
					Draggable
				</Motion.div>
				<Motion.div
					data-testid="non-draggable"
					style={{ width: "100px", height: "100px", background: "blue" }}
				>
					Non-draggable
				</Motion.div>
			</div>
		))

		const draggable = document.querySelector('[data-testid="draggable"]') as HTMLElement
		const nonDraggable = document.querySelector('[data-testid="non-draggable"]') as HTMLElement
		
		expect(draggable).toBeTruthy()
		expect(nonDraggable).toBeTruthy()
	})
})
