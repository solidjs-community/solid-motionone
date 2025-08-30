import { Accessor, createEffect, onCleanup } from "solid-js"
import type { LayoutOptions } from "../types.js"

// 🆕 Layout state interface
export interface LayoutState {
	element: Element
	id: string | undefined
	snapshot: DOMRect
	isAnimating: boolean
}

// 🆕 FLIP animation state
interface FLIPState {
	first: DOMRect
	last: DOMRect
	inverted: { x: number; y: number; scaleX: number; scaleY: number }
	element: Element
}

// 🆕 Create layout effect for FLIP animations
export function createLayoutEffect(
	element: () => Element,
	options: Accessor<LayoutOptions>
) {
	let previousRect: DOMRect | null = null
	let animationFrame: number | null = null

	// 🆕 Capture the "first" position
	function captureFirst() {
		const el = element()
		if (!el) return null
		
		previousRect = el.getBoundingClientRect()
		return previousRect
	}

	// 🆕 Capture the "last" position and calculate the "invert" transform
	function captureLast(): FLIPState | null {
		const el = element()
		if (!el || !previousRect) return null

		const lastRect = el.getBoundingClientRect()
		
		// Calculate the transform needed to move from last to first
		const deltaX = previousRect.left - lastRect.left
		const deltaY = previousRect.top - lastRect.top
		const scaleX = previousRect.width / lastRect.width
		const scaleY = previousRect.height / lastRect.height

		return {
			first: previousRect,
			last: lastRect,
			inverted: { x: deltaX, y: deltaY, scaleX, scaleY },
			element: el
		}
	}

	// 🆕 Apply the inverted transform
	function applyInvertedTransform(flipState: FLIPState) {
		const { element: el, inverted } = flipState
		
		// Apply the transform that makes the element appear in its first position
		el.style.transform = `translate(${inverted.x}px, ${inverted.y}px) scale(${inverted.scaleX}, ${inverted.scaleY})`
		el.style.transformOrigin = "0 0"
	}

	// 🆕 Play the animation to the final position
	function playAnimation(flipState: FLIPState) {
		const { element: el } = flipState
		
		// Use Motion One to animate to the final position
		el.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
		el.style.transform = "translate(0px, 0px) scale(1, 1)"
		
		// Clean up after animation
		const onTransitionEnd = () => {
			el.style.transition = ""
			el.style.transform = ""
			el.style.transformOrigin = ""
			el.removeEventListener("transitionend", onTransitionEnd)
		}
		
		el.addEventListener("transitionend", onTransitionEnd)
	}

	// 🆕 Main layout effect
	createEffect(() => {
		const opts = options()
		if (!opts.layout) return

		const el = element()
		if (!el) return

		// Capture initial position
		captureFirst()

		// Set up mutation observer to detect layout changes
		const observer = new MutationObserver(() => {
			if (animationFrame) return
			
			animationFrame = requestAnimationFrame(() => {
				const flipState = captureLast()
				if (flipState) {
					applyInvertedTransform(flipState)
					// Use a microtask to ensure the transform is applied before playing
					queueMicrotask(() => playAnimation(flipState))
				}
				animationFrame = null
			})
		})

		// Observe changes to the element and its children
		observer.observe(el, {
			attributes: true,
			childList: true,
			subtree: true
		})

		// Also observe the parent for layout changes
		const parent = el.parentElement
		if (parent) {
			observer.observe(parent, {
				attributes: true,
				childList: true,
				subtree: false
			})
		}

		onCleanup(() => {
			observer.disconnect()
			if (animationFrame) {
				cancelAnimationFrame(animationFrame)
			}
		})
	})
}

// 🆕 Utility function to measure layout changes
export function measureLayout(element: Element): DOMRect {
	return element.getBoundingClientRect()
}

// 🆕 Utility function to check if layout has changed
export function hasLayoutChanged(previous: DOMRect, current: DOMRect): boolean {
	return (
		previous.left !== current.left ||
		previous.top !== current.top ||
		previous.width !== current.width ||
		previous.height !== current.height
	)
}
