import { vi, describe, it, expect, beforeEach } from "vitest"
import { render } from "@solidjs/testing-library"
import { Motion, LayoutGroup } from "../src/index.jsx"

describe("Layout Animation System", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("should render Motion component with layout prop", () => {
		render(() => (
			<Motion.div
				layout
				data-testid="layout-element"
				style={{ width: "100px", height: "100px", background: "red" }}
			>
				Layout Element
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="layout-element"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Layout Element")
	})

	it("should render Motion component with layoutId", () => {
		render(() => (
			<Motion.div
				layout
				layoutId="shared-element"
				data-testid="shared-layout"
				style={{ width: "100px", height: "100px", background: "blue" }}
			>
				Shared Layout
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="shared-layout"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Shared Layout")
	})

	it("should render LayoutGroup component", () => {
		render(() => (
			<LayoutGroup data-testid="layout-group">
				<Motion.div layout layoutId="test-element">
					Test Element
				</Motion.div>
			</LayoutGroup>
		))

		const group = document.querySelector('[data-testid="layout-group"]')
		expect(group).toBeTruthy()
		expect(group?.tagName).toBe("DIV")
	})

	it("should render LayoutGroup with custom element", () => {
		render(() => (
			<LayoutGroup as="section" data-testid="custom-group">
				<Motion.div layout layoutId="test-element">
					Test Element
				</Motion.div>
			</LayoutGroup>
		))

		const group = document.querySelector('[data-testid="custom-group"]')
		expect(group).toBeTruthy()
		expect(group?.tagName).toBe("SECTION")
	})

	it("should support layout position animations", () => {
		render(() => (
			<Motion.div
				layout="position"
				data-testid="position-layout"
				style={{ width: "100px", height: "100px", background: "green" }}
			>
				Position Layout
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="position-layout"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Position Layout")
	})

	it("should support layout size animations", () => {
		render(() => (
			<Motion.div
				layout="size"
				data-testid="size-layout"
				style={{ width: "100px", height: "100px", background: "yellow" }}
			>
				Size Layout
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="size-layout"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Size Layout")
	})

	it("should support layout root functionality", () => {
		render(() => (
			<Motion.div
				layout
				layoutRoot
				data-testid="layout-root"
				style={{ width: "100px", height: "100px", background: "purple" }}
			>
				Layout Root
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="layout-root"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Layout Root")
	})

	it("should support layout scroll functionality", () => {
		render(() => (
			<Motion.div
				layout
				layoutScroll
				data-testid="layout-scroll"
				style={{ width: "100px", height: "100px", background: "orange" }}
			>
				Layout Scroll
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="layout-scroll"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Layout Scroll")
	})

	it("should work with existing animation props", () => {
		render(() => (
			<Motion.div
				layout
				initial={{ opacity: 0.5 }}
				animate={{ opacity: 1 }}
				hover={{ scale: 1.1 }}
				data-testid="combined-layout"
				style={{ width: "100px", height: "100px", background: "cyan" }}
			>
				Combined Layout
			</Motion.div>
		))

		const element = document.querySelector('[data-testid="combined-layout"]')
		expect(element).toBeTruthy()
		expect(element?.textContent).toBe("Combined Layout")
		expect(element?.style.opacity).toBe("0.5") // Initial state should be applied
	})

	it("should support multiple shared layout elements", () => {
		render(() => (
			<LayoutGroup>
				<Motion.div
					layout
					layoutId="shared-1"
					data-testid="shared-1"
					style={{ width: "100px", height: "100px", background: "red" }}
				>
					Shared 1
				</Motion.div>
				<Motion.div
					layout
					layoutId="shared-1"
					data-testid="shared-2"
					style={{ width: "100px", height: "100px", background: "blue" }}
				>
					Shared 2
				</Motion.div>
			</LayoutGroup>
		))

		const element1 = document.querySelector('[data-testid="shared-1"]')
		const element2 = document.querySelector('[data-testid="shared-2"]')
		
		expect(element1).toBeTruthy()
		expect(element2).toBeTruthy()
		expect(element1?.textContent).toBe("Shared 1")
		expect(element2?.textContent).toBe("Shared 2")
	})

	it("should not interfere with non-layout elements", () => {
		render(() => (
			<div>
				<Motion.div
					layout
					data-testid="layout-element"
					style={{ width: "100px", height: "100px", background: "red" }}
				>
					Layout Element
				</Motion.div>
				<Motion.div
					data-testid="non-layout-element"
					style={{ width: "100px", height: "100px", background: "blue" }}
				>
					Non-Layout Element
				</Motion.div>
			</div>
		))

		const layoutElement = document.querySelector('[data-testid="layout-element"]')
		const nonLayoutElement = document.querySelector('[data-testid="non-layout-element"]')
		
		expect(layoutElement).toBeTruthy()
		expect(nonLayoutElement).toBeTruthy()
		expect(layoutElement?.textContent).toBe("Layout Element")
		expect(nonLayoutElement?.textContent).toBe("Non-Layout Element")
	})
})
