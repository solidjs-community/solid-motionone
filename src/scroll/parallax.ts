import { createEffect, onCleanup, Accessor } from "solid-js"
import type { ScrollPosition, ParallaxOptions } from "../types.js"
import { createScrollYTransform } from "./transform.js"

// 🆕 Parallax state interface
export interface ParallaxState {
	element: Element
	speed: number
	offset: number
	container: Element | Window
	isActive: boolean
}

// 🆕 Create parallax effect
export function createParallaxEffect(
	element: () => Element,
	scrollPosition: Accessor<ScrollPosition>,
	options: Accessor<ParallaxOptions> = () => ({})
) {
	let parallaxState: ParallaxState | null = null

	// 🆕 Initialize parallax
	function initializeParallax() {
		const el = element()
		const opts = options()
		
		if (!el) return

		parallaxState = {
			element: el,
			speed: opts.speed || 0.5,
			offset: opts.offset || 0,
			container: opts.container || window,
			isActive: true
		}

		// Set initial transform
		const htmlEl = el as HTMLElement
		htmlEl.style.transform = `translateY(0px)`
		htmlEl.style.willChange = "transform"
	}

	// 🆕 Update parallax position
	function updateParallax() {
		if (!parallaxState || !parallaxState.isActive) return

		const { element: el, speed, offset } = parallaxState
		const scrollY = scrollPosition().y
		
		// Calculate parallax offset
		const parallaxOffset = scrollY * speed + offset
		
		// Apply transform
		const htmlEl = el as HTMLElement
		htmlEl.style.transform = `translateY(${parallaxOffset}px)`
	}

	// 🆕 Create scroll transform for parallax
	const parallaxTransform = createScrollYTransform(
		scrollPosition,
		[0, 1000], // Output range
		[0, window.innerHeight * 2], // Input range
		() => ({ easing: (t: number) => t * (options().speed || 0.5) })
	)

	// 🆕 Set up parallax effect
	createEffect(() => {
		const opts = options()
		
		if (!opts.parallax) return

		initializeParallax()
		
		// Update on scroll
		createEffect(() => {
			updateParallax()
		})

		onCleanup(() => {
			if (parallaxState) {
				parallaxState.isActive = false
				const htmlEl = parallaxState.element as HTMLElement
				htmlEl.style.transform = ""
				htmlEl.style.willChange = ""
			}
		})
	})

	return parallaxTransform
}
