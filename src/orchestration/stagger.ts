import { createSignal, createEffect, onCleanup, Accessor } from "solid-js"
import type { StaggerOptions, StaggerConfig, StaggerState } from "../types.js"

export interface StaggerController {
	start: () => void
	stop: () => void
	reset: () => void
	getState: () => StaggerState
}

export interface StaggerElement {
	element: Element
	index: number
	delay: number
	animation: () => void
}

export function createStaggerController(
	elements: Accessor<Element[]>,
	options: Accessor<StaggerOptions> = () => ({})
): StaggerController {
	const [state, setState] = createSignal<StaggerState>({
		isStaggering: false,
		currentIndex: 0,
		totalElements: 0,
		progress: 0,
		direction: "forward"
	})

	let animationFrame: number | null = null
	let startTime: number | null = null
	let elementControllers: StaggerElement[] = []

	function calculateStaggerDelay(index: number, total: number, config: StaggerConfig): number {
		const { delay = 0.1, direction = "forward", from = 0, to = total - 1 } = config
		
		let targetIndex = index
		
		switch (direction) {
			case "forward":
				targetIndex = index
				break
			case "reverse":
				targetIndex = total - 1 - index
				break
			case "from":
				targetIndex = Math.abs(index - from)
				break
			case "from-center":
				const center = Math.floor(total / 2)
				targetIndex = Math.abs(index - center)
				break
			case "from-start":
				targetIndex = index
				break
			case "from-end":
				targetIndex = total - 1 - index
				break
		}
		
		return targetIndex * delay
	}

	function createElementController(element: Element, index: number): StaggerElement {
		const opts = options()
		const staggerConfig = typeof opts.stagger === "number" 
			? { delay: opts.stagger } 
			: opts.stagger || { delay: 0.1 }
		
		const delay = calculateStaggerDelay(index, elements().length, staggerConfig)
		
		return {
			element,
			index,
			delay,
			animation: () => {
				// Trigger animation on the element
				try {
					const event = new CustomEvent("stagger-animate", {
						detail: { index, delay, element }
					})
					element.dispatchEvent(event)
				} catch (error) {
					// Fallback for environments that don't support CustomEvent
					console.log("Stagger animation triggered for element", index)
				}
			}
		}
	}

	function startStagger() {
		const els = elements()
		if (els.length === 0) return

		setState({
			isStaggering: true,
			currentIndex: 0,
			totalElements: els.length,
			progress: 0,
			direction: options().staggerDirection || "forward"
		})

		// Create controllers for all elements
		elementControllers = els.map((element, index) => 
			createElementController(element, index)
		)

		startTime = performance.now()
		animateStagger()
	}

	function animateStagger() {
		if (!startTime) return

		const currentTime = performance.now()
		const elapsed = currentTime - startTime
		const opts = options()
		const staggerConfig = typeof opts.stagger === "number" 
			? { delay: opts.stagger } 
			: opts.stagger || { delay: 0.1 }
		
		const totalDuration = elementControllers.length * (staggerConfig.delay || 0.1)
		const progress = Math.min(elapsed / totalDuration, 1)

		setState(prev => ({
			...prev,
			progress,
			currentIndex: Math.floor(progress * elementControllers.length)
		}))

		// Trigger animations for elements that should be animating
		elementControllers.forEach((controller, index) => {
			const shouldAnimate = elapsed >= controller.delay && 
				!controller.element.hasAttribute("data-stagger-animated")
			
			if (shouldAnimate) {
				controller.animation()
				controller.element.setAttribute("data-stagger-animated", "true")
			}
		})

		if (progress < 1) {
			animationFrame = requestAnimationFrame(animateStagger)
		} else {
			// Stagger complete
			setState(prev => ({
				...prev,
				isStaggering: false,
				progress: 1
			}))
			
			// Trigger completion callback
			const onStaggerComplete = options().onStaggerComplete
			if (onStaggerComplete) {
				onStaggerComplete(state())
			}
		}
	}

	function stopStagger() {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame)
			animationFrame = null
		}
		
		setState(prev => ({
			...prev,
			isStaggering: false
		}))
	}

	function resetStagger() {
		stopStagger()
		
		// Remove stagger attributes from elements
		elements().forEach(element => {
			element.removeAttribute("data-stagger-animated")
		})
		
		setState({
			isStaggering: false,
			currentIndex: 0,
			totalElements: 0,
			progress: 0,
			direction: "forward"
		})
	}

	// Auto-start stagger when elements change
	createEffect(() => {
		const els = elements()
		const opts = options()
		
		if (els.length > 0 && opts.stagger) {
			// Trigger stagger start callback
			const onStaggerStart = opts.onStaggerStart
			if (onStaggerStart) {
				onStaggerStart(state())
			}
			
			startStagger()
		}
	})

	onCleanup(() => {
		stopStagger()
	})

	return {
		start: startStagger,
		stop: stopStagger,
		reset: resetStagger,
		getState: state
	}
}

export function createStaggerChildren(
	parentElement: Accessor<Element>,
	options: Accessor<StaggerOptions> = () => ({})
) {
	return createStaggerController(
		() => {
			const parent = parentElement()
			if (!parent) return []
			
			return Array.from(parent.children) as Element[]
		},
		options
	)
}

export function calculateStaggerIndex(
	index: number,
	total: number,
	direction: string = "forward",
	from?: number
): number {
	switch (direction) {
		case "forward":
			return index
		case "reverse":
			return total - 1 - index
		case "from":
			return from !== undefined ? Math.abs(index - from) : index
		case "from-center":
			const center = Math.floor(total / 2)
			return Math.abs(index - center)
		case "from-start":
			return index
		case "from-end":
			return total - 1 - index
		default:
			return index
	}
}
