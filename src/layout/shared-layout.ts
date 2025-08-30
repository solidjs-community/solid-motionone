import { Accessor, createEffect, onCleanup } from "solid-js"
import type { LayoutOptions } from "../types.js"
import { useLayoutGroup } from "./LayoutGroup.jsx"
import { createLayoutEffect } from "./layout-effect.js"

// 🆕 Shared layout animation state
interface SharedLayoutState {
	id: string
	element: Element
	previousRect: DOMRect | null
	currentRect: DOMRect
	isAnimating: boolean
}

// 🆕 Create shared layout effect
export function createSharedLayoutEffect(
	element: () => Element,
	options: Accessor<LayoutOptions>
) {
	const layoutGroup = useLayoutGroup()
	
	if (!layoutGroup) {
		// Fall back to regular layout effect if no layout group
		return createLayoutEffect(element, options)
	}

	let sharedState: SharedLayoutState | null = null
	let animationFrame: number | null = null

	// 🆕 Register element with layout group
	createEffect(() => {
		const el = element()
		const opts = options()
		
		if (!el || !opts.layoutId) return

		// Register with layout group
		layoutGroup.registerElement(el, opts.layoutId)

		// Capture initial state
		sharedState = {
			id: opts.layoutId,
			element: el,
			previousRect: null,
			currentRect: el.getBoundingClientRect(),
			isAnimating: false
		}

		onCleanup(() => {
			layoutGroup.unregisterElement(el)
		})
	})

	// 🆕 Handle layout changes
	createEffect(() => {
		const el = element()
		const opts = options()
		
		if (!el || !opts.layoutId || !sharedState) return

		// Check for existing layout state
		const existingState = layoutGroup.getLayoutState(opts.layoutId)
		
		if (existingState && existingState.element !== el) {
			// Another element with the same layoutId exists
			animateSharedLayout(sharedState, existingState)
		}
	})

	// 🆕 Animate between shared layout elements
	function animateSharedLayout(
		currentState: SharedLayoutState,
		previousState: any
	) {
		const { element: currentEl } = currentState
		const { element: previousEl, snapshot: previousRect } = previousState

		// Calculate the transform needed
		const deltaX = previousRect.left - currentEl.getBoundingClientRect().left
		const deltaY = previousRect.top - currentEl.getBoundingClientRect().top
		const scaleX = previousRect.width / currentEl.getBoundingClientRect().width
		const scaleY = previousRect.height / currentEl.getBoundingClientRect().height

		// Apply the transform to make current element appear in previous position
		currentEl.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`
		currentEl.style.transformOrigin = "0 0"

		// Animate to final position
		if (animationFrame) {
			cancelAnimationFrame(animationFrame)
		}

		animationFrame = requestAnimationFrame(() => {
			currentEl.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
			currentEl.style.transform = "translate(0px, 0px) scale(1, 1)"

			const onTransitionEnd = () => {
				currentEl.style.transition = ""
				currentEl.style.transform = ""
				currentEl.style.transformOrigin = ""
				currentEl.removeEventListener("transitionend", onTransitionEnd)
			}

			currentEl.addEventListener("transitionend", onTransitionEnd)
		})
	}

	// 🆕 Update layout state when element changes
	createEffect(() => {
		const el = element()
		const opts = options()
		
		if (!el || !opts.layoutId || !sharedState) return

		const currentRect = el.getBoundingClientRect()
		
		// Update layout group state
		layoutGroup.updateLayout(opts.layoutId, currentRect)
		
		// Update local state
		sharedState.previousRect = sharedState.currentRect
		sharedState.currentRect = currentRect
	})

	onCleanup(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame)
		}
	})
}

// 🆕 Utility function to check if elements share layout
export function elementsShareLayout(element1: Element, element2: Element): boolean {
	const id1 = element1.getAttribute("data-layout-id")
	const id2 = element2.getAttribute("data-layout-id")
	return id1 && id2 && id1 === id2
}

// 🆕 Utility function to get shared layout elements
export function getSharedLayoutElements(root: Element, layoutId: string): Element[] {
	const elements: Element[] = []
	const walker = document.createTreeWalker(
		root,
		NodeFilter.SHOW_ELEMENT,
		{
			acceptNode: (node) => {
				const element = node as Element
				return element.getAttribute("data-layout-id") === layoutId
					? NodeFilter.FILTER_ACCEPT
					: NodeFilter.FILTER_SKIP
			}
		}
	)

	let node
	while (node = walker.nextNode()) {
		elements.push(node as Element)
	}

	return elements
}
