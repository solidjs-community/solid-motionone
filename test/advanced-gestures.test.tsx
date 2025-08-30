import { vi, describe, it, expect, beforeEach } from "vitest"
import { render } from "@solidjs/testing-library"
import { Motion } from "../src/index.jsx"

describe("Advanced Gestures System", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("should render Motion component with multiTouch prop", () => {
		render(() => (
			<Motion.div
				multiTouch
				data-testid="multi-touch-element"
				style={{ width: "100px", height: "100px", background: "red" }}
			>
				Multi-Touch Element
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="multi-touch-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Multi-Touch Element")
	})

	it("should render Motion component with pinchZoom prop", () => {
		render(() => (
			<Motion.div
				pinchZoom
				data-testid="pinch-zoom-element"
				style={{ width: "100px", height: "100px", background: "blue" }}
			>
				Pinch Zoom Element
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="pinch-zoom-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Pinch Zoom Element")
	})

	it("should render Motion component with minTouches and maxTouches", () => {
		render(() => (
			<Motion.div
				multiTouch
				minTouches={2}
				maxTouches={4}
				data-testid="touch-limits-element"
				style={{ width: "100px", height: "100px", background: "green" }}
			>
				Touch Limits
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="touch-limits-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Touch Limits")
	})

	it("should render Motion component with initialScale and initialRotation", () => {
		render(() => (
			<Motion.div
				pinchZoom
				initialScale={1.5}
				initialRotation={45}
				data-testid="initial-transform-element"
				style={{ width: "100px", height: "100px", background: "yellow" }}
			>
				Initial Transform
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="initial-transform-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Initial Transform")
	})

	it("should render Motion component with minScale and maxScale", () => {
		render(() => (
			<Motion.div
				pinchZoom
				minScale={0.5}
				maxScale={3.0}
				data-testid="scale-constraints-element"
				style={{ width: "100px", height: "100px", background: "purple" }}
			>
				Scale Constraints
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="scale-constraints-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Scale Constraints")
	})

	it("should render Motion component with momentum", () => {
		render(() => (
			<Motion.div
				pinchZoom
				momentum
				momentumDecay={0.9}
				data-testid="momentum-element"
				style={{ width: "100px", height: "100px", background: "orange" }}
			>
				Momentum
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="momentum-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Momentum")
	})

	it("should render Motion component with whilePinch", () => {
		render(() => (
			<Motion.div
				pinchZoom
				whilePinch={{ scale: 1.1, opacity: 0.8 }}
				data-testid="while-pinch-element"
				style={{ width: "100px", height: "100px", background: "cyan" }}
			>
				While Pinch
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="while-pinch-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("While Pinch")
	})

	it("should work with existing animation props", () => {
		render(() => (
			<Motion.div
				pinchZoom
				initial={{ opacity: 0.5 }}
				animate={{ opacity: 1 }}
				hover={{ scale: 1.1 }}
				data-testid="combined-gestures"
				style={{ width: "100px", height: "100px", background: "brown" }}
			>
				Combined Gestures
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="combined-gestures"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Combined Gestures")
		expect(element?.style.opacity).toBe("0.5") // Initial state should be applied
	})

	it("should work with layout animations", () => {
		render(() => (
			<Motion.div
				pinchZoom
				layout
				data-testid="gesture-layout"
				style={{ width: "100px", height: "100px", background: "pink" }}
			>
				Gesture Layout
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="gesture-layout"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Gesture Layout")
	})

	it("should work with drag functionality", () => {
		render(() => (
			<Motion.div
				pinchZoom
				drag
				data-testid="gesture-drag"
				style={{ width: "100px", height: "100px", background: "lime" }}
			>
				Gesture Drag
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="gesture-drag"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Gesture Drag")
	})

	it("should work with scroll functionality", () => {
		render(() => (
			<Motion.div
				pinchZoom
				scroll
				data-testid="gesture-scroll"
				style={{ width: "100px", height: "100px", background: "magenta" }}
			>
				Gesture Scroll
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="gesture-scroll"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Gesture Scroll")
	})

	it("should not interfere with non-gesture elements", () => {
		render(() => (
			<div>
				<Motion.div
					pinchZoom
					data-testid="gesture-element"
					style={{ width: "100px", height: "100px", background: "red" }}
				>
					Gesture Element
				</Motion.div>
				<Motion.div
					data-testid="non-gesture-element"
					style={{ width: "100px", height: "100px", background: "blue" }}
				>
					Non-Gesture Element
				</Motion.div>
			</div>
		))

		const gestureElement = document.querySelector('[data-testid="gesture-element"]')
		const nonGestureElement = document.querySelector('[data-testid="non-gesture-element"]')
		
		expect(gestureElement).toBeTruthy()
		expect(nonGestureElement).toBeTruthy()
		expect(gestureElement?.textContent).toBe("Gesture Element")
		expect(nonGestureElement?.textContent).toBe("Non-Gesture Element")
	})

	it("should support complex gesture combinations", () => {
		render(() => (
			<Motion.div
				multiTouch
				pinchZoom
				minTouches={2}
				maxTouches={4}
				initialScale={1.2}
				initialRotation={30}
				minScale={0.3}
				maxScale={4.0}
				momentum
				momentumDecay={0.85}
				whilePinch={{ scale: 1.05, opacity: 0.9 }}
				data-testid="complex-gestures"
				style={{ width: "100px", height: "100px", background: "teal" }}
			>
				Complex Gestures
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="complex-gestures"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Complex Gestures")
	})
})
