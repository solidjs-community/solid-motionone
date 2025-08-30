import { vi, describe, it, expect, beforeEach } from "vitest"
import { render } from "@solidjs/testing-library"
import { Motion } from "../src/index.jsx"

describe("Scroll Integration System", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("should render Motion component with scroll prop", () => {
		render(() => (
			<Motion.div
				scroll
				data-testid="scroll-element"
				style={{ width: "100px", height: "100px", background: "red" }}
			>
				Scroll Element
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="scroll-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Scroll Element")
	})

	it("should render Motion component with parallax prop", () => {
		render(() => (
			<Motion.div
				parallax={0.5}
				data-testid="parallax-element"
				style={{ width: "100px", height: "100px", background: "blue" }}
			>
				Parallax Element
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="parallax-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Parallax Element")
	})

	it("should render Motion component with parallaxSpeed", () => {
		render(() => (
			<Motion.div
				parallax
				parallaxSpeed={0.3}
				data-testid="parallax-speed-element"
				style={{ width: "100px", height: "100px", background: "green" }}
			>
				Parallax Speed
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="parallax-speed-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Parallax Speed")
	})

	it("should render Motion component with parallaxOffset", () => {
		render(() => (
			<Motion.div
				parallax
				parallaxOffset={100}
				data-testid="parallax-offset-element"
				style={{ width: "100px", height: "100px", background: "yellow" }}
			>
				Parallax Offset
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="parallax-offset-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Parallax Offset")
	})

	it("should render Motion component with scrollContainer", () => {
		render(() => (
			<div style={{ height: "200px", overflow: "auto" }}>
				<Motion.div
					scroll
					scrollContainer={document.querySelector("div") as Element}
					data-testid="scroll-container-element"
					style={{ width: "100px", height: "100px", background: "purple" }}
				>
					Scroll Container
				</Motion.div>
			</div>
		))

		const element = document.querySelector('[data-testid="scroll-container-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Scroll Container")
	})

	it("should render Motion component with scrollOffset", () => {
		render(() => (
			<Motion.div
				scroll
				scrollOffset={0.5}
				data-testid="scroll-offset-element"
				style={{ width: "100px", height: "100px", background: "orange" }}
			>
				Scroll Offset
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="scroll-offset-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Scroll Offset")
	})

	it("should render Motion component with scrollOnce", () => {
		render(() => (
			<Motion.div
				scroll
				scrollOnce
				data-testid="scroll-once-element"
				style={{ width: "100px", height: "100px", background: "cyan" }}
			>
				Scroll Once
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="scroll-once-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Scroll Once")
	})

	it("should render Motion component with scrollAmount", () => {
		render(() => (
			<Motion.div
				scroll
				scrollAmount="some"
				data-testid="scroll-amount-element"
				style={{ width: "100px", height: "100px", background: "magenta" }}
			>
				Scroll Amount
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="scroll-amount-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Scroll Amount")
	})

	it("should work with existing animation props", () => {
		render(() => (
			<Motion.div
				scroll
				parallax={0.5}
				initial={{ opacity: 0.5 }}
				animate={{ opacity: 1 }}
				hover={{ scale: 1.1 }}
				data-testid="combined-scroll"
				style={{ width: "100px", height: "100px", background: "brown" }}
			>
				Combined Scroll
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="combined-scroll"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Combined Scroll")
		expect(element?.style.opacity).toBe("0.5") // Initial state should be applied
	})

	it("should work with layout animations", () => {
		render(() => (
			<Motion.div
				scroll
				layout
				parallax={0.3}
				data-testid="scroll-layout"
				style={{ width: "100px", height: "100px", background: "pink" }}
			>
				Scroll Layout
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="scroll-layout"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Scroll Layout")
	})

	it("should work with drag functionality", () => {
		render(() => (
			<Motion.div
				scroll
				drag
				parallax={0.2}
				data-testid="scroll-drag"
				style={{ width: "100px", height: "100px", background: "lime" }}
			>
				Scroll Drag
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="scroll-drag"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Scroll Drag")
	})

	it("should not interfere with non-scroll elements", () => {
		render(() => (
			<div>
				<Motion.div
					scroll
					data-testid="scroll-element"
					style={{ width: "100px", height: "100px", background: "red" }}
				>
					Scroll Element
				</Motion.div>
				<Motion.div
					data-testid="non-scroll-element"
					style={{ width: "100px", height: "100px", background: "blue" }}
				>
					Non-Scroll Element
				</Motion.div>
			</div>
		))

		const scrollElement = document.querySelector('[data-testid="scroll-element"]')
		const nonScrollElement = document.querySelector('[data-testid="non-scroll-element"]')
		
		expect(scrollElement).toBeTruthy()
		expect(nonScrollElement).toBeTruthy()
		expect(scrollElement?.textContent).toBe("Scroll Element")
		expect(nonScrollElement?.textContent).toBe("Non-Scroll Element")
	})
})
