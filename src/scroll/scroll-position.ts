import { createSignal, createEffect, onCleanup, Accessor } from "solid-js"
import type { ScrollOptions } from "../types.js"

// 🆕 Scroll position interface
export interface ScrollPosition {
	x: number
	y: number
	progress: number
	velocity: { x: number; y: number }
}

// 🆕 Scroll state interface
export interface ScrollState {
	position: ScrollPosition
	isScrolling: boolean
	container: Element | Window
}

// 🆕 Create scroll position signal
export function createScrollPosition(
	container: Accessor<Element | Window> = () => window,
	options: Accessor<ScrollOptions> = () => ({})
): Accessor<ScrollPosition> {
	const [position, setPosition] = createSignal<ScrollPosition>({
		x: 0,
		y: 0,
		progress: 0,
		velocity: { x: 0, y: 0 }
	})

	let lastPosition = { x: 0, y: 0 }
	let lastTime = Date.now()
	let scrollTimeout: number | null = null

	// 🆕 Calculate scroll progress
	function calculateProgress(
		scrollY: number,
		container: Element | Window
	): number {
		if (container === window) {
			const documentHeight = document.documentElement.scrollHeight
			const windowHeight = window.innerHeight
			const maxScroll = documentHeight - windowHeight
			return maxScroll > 0 ? scrollY / maxScroll : 0
		} else {
			const element = container as Element
			const scrollHeight = element.scrollHeight
			const clientHeight = element.clientHeight
			const maxScroll = scrollHeight - clientHeight
			return maxScroll > 0 ? element.scrollTop / maxScroll : 0
		}
	}

	// 🆕 Calculate scroll velocity
	function calculateVelocity(
		currentX: number,
		currentY: number,
		lastX: number,
		lastY: number,
		deltaTime: number
	): { x: number; y: number } {
		return {
			x: (currentX - lastX) / deltaTime,
			y: (currentY - lastY) / deltaTime
		}
	}

	// 🆕 Handle scroll event
	function handleScroll() {
		const containerEl = container()
		const currentTime = Date.now()
		const deltaTime = currentTime - lastTime

		let currentX = 0
		let currentY = 0

		if (containerEl === window) {
			currentX = window.scrollX
			currentY = window.scrollY
		} else {
			const element = containerEl as Element
			currentX = element.scrollLeft
			currentY = element.scrollTop
		}

		const velocity = calculateVelocity(
			currentX,
			currentY,
			lastPosition.x,
			lastPosition.y,
			deltaTime
		)

		const progress = calculateProgress(currentY, containerEl)

		setPosition({
			x: currentX,
			y: currentY,
			progress,
			velocity
		})

		lastPosition = { x: currentX, y: currentY }
		lastTime = currentTime

		// Clear existing timeout
		if (scrollTimeout) {
			clearTimeout(scrollTimeout)
		}

		// Set timeout to mark scrolling as stopped
		scrollTimeout = setTimeout(() => {
			setPosition(prev => ({
				...prev,
				velocity: { x: 0, y: 0 }
			}))
		}, 150) // 150ms threshold for scroll end
	}

	// 🆕 Set up scroll listener
	createEffect(() => {
		const containerEl = container()
		if (!containerEl) return

		// Initialize position
		handleScroll()

		// Add scroll listener
		containerEl.addEventListener("scroll", handleScroll, { passive: true })

		onCleanup(() => {
			containerEl.removeEventListener("scroll", handleScroll)
			if (scrollTimeout) {
				clearTimeout(scrollTimeout)
			}
		})
	})

	return position
}

// 🆕 Create scroll state with additional metadata
export function createScrollState(
	container: Accessor<Element | Window> = () => window,
	options: Accessor<ScrollOptions> = () => ({})
): Accessor<ScrollState> {
	const position = createScrollPosition(container, options)
	const [isScrolling, setIsScrolling] = createSignal(false)

	createEffect(() => {
		const pos = position()
		const hasVelocity = Math.abs(pos.velocity.x) > 0.1 || Math.abs(pos.velocity.y) > 0.1
		setIsScrolling(hasVelocity)
	})

	return () => ({
		position: position(),
		isScrolling: isScrolling(),
		container: container()
	})
}

// 🆕 Utility function to get scroll container
export function getScrollContainer(element: Element): Element | Window {
	let parent = element.parentElement
	
	while (parent) {
		const style = window.getComputedStyle(parent)
		const overflow = style.overflow + style.overflowY + style.overflowX
		
		if (overflow.includes("scroll") || overflow.includes("auto")) {
			return parent
		}
		
		parent = parent.parentElement
	}
	
	return window
}

// 🆕 Utility function to check if element is in viewport
export function isInViewport(
	element: Element,
	container: Element | Window = window,
	threshold: number = 0
): boolean {
	const rect = element.getBoundingClientRect()
	
	if (container === window) {
		return (
			rect.top <= window.innerHeight * (1 - threshold) &&
			rect.bottom >= window.innerHeight * threshold
		)
	} else {
		const containerElement = container as Element
		const containerRect = containerElement.getBoundingClientRect()
		return (
			rect.top <= containerRect.height * (1 - threshold) &&
			rect.bottom >= containerRect.height * threshold
		)
	}
}
