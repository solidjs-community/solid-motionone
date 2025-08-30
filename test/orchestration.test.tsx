import { vi, describe, it, expect, beforeEach } from "vitest"
import { render } from "@solidjs/testing-library"
import { Motion } from "../src/index.jsx"

describe("Orchestration System", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("should render Motion component with stagger prop", () => {
		render(() => (
			<Motion.div
				stagger={0.1}
				data-testid="stagger-element"
				style={{ width: "100px", height: "100px", background: "red" }}
			>
				Stagger Element
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="stagger-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Stagger Element")
	})

	it("should render Motion component with stagger config", () => {
		render(() => (
			<Motion.div
				stagger={{ delay: 0.2, direction: "reverse" }}
				data-testid="stagger-config-element"
				style={{ width: "100px", height: "100px", background: "blue" }}
			>
				Stagger Config Element
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="stagger-config-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Stagger Config Element")
	})

	it("should render Motion component with stagger direction", () => {
		render(() => (
			<Motion.div
				stagger={0.1}
				staggerDirection="from-center"
				data-testid="stagger-direction-element"
				style={{ width: "100px", height: "100px", background: "green" }}
			>
				Stagger Direction Element
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="stagger-direction-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Stagger Direction Element")
	})

	it("should render Motion component with timeline prop", () => {
		render(() => (
			<Motion.div
				timeline={{ duration: 1000, segments: [] }}
				data-testid="timeline-element"
				style={{ width: "100px", height: "100px", background: "yellow" }}
			>
				Timeline Element
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="timeline-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Timeline Element")
	})

	it("should render Motion component with timeline duration", () => {
		render(() => (
			<Motion.div
				timeline={{ duration: 2000 }}
				timelineDuration={1500}
				data-testid="timeline-duration-element"
				style={{ width: "100px", height: "100px", background: "purple" }}
			>
				Timeline Duration Element
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="timeline-duration-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Timeline Duration Element")
	})

	it("should render Motion component with timeline repeat", () => {
		render(() => (
			<Motion.div
				timeline={{ duration: 1000, repeat: "loop" }}
				data-testid="timeline-repeat-element"
				style={{ width: "100px", height: "100px", background: "orange" }}
			>
				Timeline Repeat Element
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="timeline-repeat-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Timeline Repeat Element")
	})

	it("should render Motion component with orchestrate prop", () => {
		render(() => (
			<Motion.div
				orchestrate
				data-testid="orchestrate-element"
				style={{ width: "100px", height: "100px", background: "cyan" }}
			>
				Orchestrate Element
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="orchestrate-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Orchestrate Element")
	})

	it("should render Motion component with orchestrate delay", () => {
		render(() => (
			<Motion.div
				orchestrate
				orchestrateDelay={500}
				data-testid="orchestrate-delay-element"
				style={{ width: "100px", height: "100px", background: "magenta" }}
			>
				Orchestrate Delay Element
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="orchestrate-delay-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Orchestrate Delay Element")
	})

	it("should render Motion component with stagger children", () => {
		render(() => (
			<Motion.div
				staggerChildren={0.1}
				data-testid="stagger-children-element"
				style={{ width: "100px", height: "100px", background: "brown" }}
			>
				<Motion.div>Child 1</Motion.div>
				<Motion.div>Child 2</Motion.div>
				<Motion.div>Child 3</Motion.div>
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="stagger-children-element"]')
		expect(element).toBeTruthy()
		expect(element?.children.length).toBe(3)
	})

	it("should render Motion component with stagger delay children", () => {
		render(() => (
			<Motion.div
				staggerDelayChildren={0.2}
				data-testid="stagger-delay-children-element"
				style={{ width: "100px", height: "100px", background: "pink" }}
			>
				<Motion.div>Child 1</Motion.div>
				<Motion.div>Child 2</Motion.div>
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="stagger-delay-children-element"]')
		expect(element).toBeTruthy()
		expect(element?.children.length).toBe(2)
	})

	it("should work with existing animation props", () => {
		render(() => (
			<Motion.div
				stagger={0.1}
				initial={{ opacity: 0.5 }}
				animate={{ opacity: 1 }}
				hover={{ scale: 1.1 }}
				data-testid="orchestration-animation"
				style={{ width: "100px", height: "100px", background: "lime" }}
			>
				Orchestration Animation
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="orchestration-animation"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Orchestration Animation")
		expect(element?.style.opacity).toBe("0.5") // Initial state should be applied
	})

	it("should work with layout animations", () => {
		render(() => (
			<Motion.div
				stagger={0.1}
				layout
				data-testid="orchestration-layout"
				style={{ width: "100px", height: "100px", background: "teal" }}
			>
				Orchestration Layout
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="orchestration-layout"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Orchestration Layout")
	})

	it("should work with drag functionality", () => {
		render(() => (
			<Motion.div
				stagger={0.1}
				drag
				data-testid="orchestration-drag"
				style={{ width: "100px", height: "100px", background: "indigo" }}
			>
				Orchestration Drag
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="orchestration-drag"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Orchestration Drag")
	})

	it("should work with scroll functionality", () => {
		render(() => (
			<Motion.div
				stagger={0.1}
				scroll
				data-testid="orchestration-scroll"
				style={{ width: "100px", height: "100px", background: "violet" }}
			>
				Orchestration Scroll
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="orchestration-scroll"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Orchestration Scroll")
	})

	it("should work with advanced gestures", () => {
		render(() => (
			<Motion.div
				stagger={0.1}
				pinchZoom
				data-testid="orchestration-gestures"
				style={{ width: "100px", height: "100px", background: "coral" }}
			>
				Orchestration Gestures
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="orchestration-gestures"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Orchestration Gestures")
	})

	it("should support complex orchestration combinations", () => {
		render(() => (
			<Motion.div
				stagger={{ delay: 0.2, direction: "from-center" }}
				timeline={{ duration: 2000, repeat: "loop" }}
				orchestrate
				orchestrateDelay={300}
				layout
				drag
				scroll
				pinchZoom
				data-testid="complex-orchestration"
				style={{ width: "100px", height: "100px", background: "gold" }}
			>
				Complex Orchestration
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="complex-orchestration"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Complex Orchestration")
	})

	it("should not interfere with non-orchestration elements", () => {
		render(() => (
			<div>
				<Motion.div
					stagger={0.1}
					data-testid="orchestration-element"
					style={{ width: "100px", height: "100px", background: "red" }}
				>
					Orchestration Element
				</Motion.div>
				<Motion.div
					data-testid="non-orchestration-element"
					style={{ width: "100px", height: "100px", background: "blue" }}
				>
					Non-Orchestration Element
				</Motion.div>
			</div>
		))

		const orchestrationElement = document.querySelector('[data-testid="orchestration-element"]')
		const nonOrchestrationElement = document.querySelector('[data-testid="non-orchestration-element"]')
		
		expect(orchestrationElement).toBeTruthy()
		expect(nonOrchestrationElement).toBeTruthy()
		expect(orchestrationElement?.textContent).toBe("Orchestration Element")
		expect(nonOrchestrationElement?.textContent).toBe("Non-Orchestration Element")
	})

	it("should support timeline segments", () => {
		render(() => (
			<Motion.div
				timeline={{
					duration: 1000,
					segments: [
						{ at: 0, animation: { opacity: 0 } },
						{ at: 500, animation: { opacity: 1 } },
						{ at: 1000, animation: { opacity: 0.5 } }
					]
				}}
				data-testid="timeline-segments-element"
				style={{ width: "100px", height: "100px", background: "silver" }}
			>
				Timeline Segments
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="timeline-segments-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Timeline Segments")
	})

	it("should support orchestrate direction", () => {
		render(() => (
			<Motion.div
				orchestrate
				orchestrateDirection="reverse"
				data-testid="orchestrate-direction-element"
				style={{ width: "100px", height: "100px", background: "navy" }}
			>
				Orchestrate Direction
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="orchestrate-direction-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Orchestrate Direction")
	})

	it("should support orchestrate from/to", () => {
		render(() => (
			<Motion.div
				orchestrate
				orchestrateFrom={0}
				orchestrateTo={5}
				data-testid="orchestrate-range-element"
				style={{ width: "100px", height: "100px", background: "maroon" }}
			>
				Orchestrate Range
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="orchestrate-range-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Orchestrate Range")
	})
})
