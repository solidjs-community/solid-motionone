import { createSignal, createEffect, onCleanup, Accessor } from "solid-js"
import type { MultiTouchOptions, GestureState } from "../types.js"

// 🆕 Multi-touch gesture state interface
export interface MultiTouchState {
	element: Element
	isActive: boolean
	touches: Touch[]
	center: { x: number; y: number }
	distance: number
	angle: number
	scale: number
	rotation: number
	velocity: { x: number; y: number; scale: number; rotation: number }
}

// 🆕 Touch point interface
export interface TouchPoint {
	id: number
	x: number
	y: number
	clientX: number
	clientY: number
}

// 🆕 Create multi-touch gesture recognition
export function createMultiTouchGesture(
	element: () => Element,
	options: Accessor<MultiTouchOptions> = () => ({})
): Accessor<MultiTouchState> {
	const [state, setState] = createSignal<MultiTouchState>({
		element: element(),
		isActive: false,
		touches: [],
		center: { x: 0, y: 0 },
		distance: 0,
		angle: 0,
		scale: 1,
		rotation: 0,
		velocity: { x: 0, y: 0, scale: 0, rotation: 0 }
	})

	let lastTouches: Touch[] = []
	let lastTime = Date.now()
	let initialDistance = 0
	let initialAngle = 0
	let initialScale = 1
	let initialRotation = 0

	// 🆕 Calculate distance between two points
	function calculateDistance(point1: TouchPoint, point2: TouchPoint): number {
		const dx = point2.x - point1.x
		const dy = point2.y - point1.y
		return Math.sqrt(dx * dx + dy * dy)
	}

	// 🆕 Calculate angle between two points
	function calculateAngle(point1: TouchPoint, point2: TouchPoint): number {
		return Math.atan2(point2.y - point1.y, point2.x - point1.x) * (180 / Math.PI)
	}

	// 🆕 Calculate center point between touches
	function calculateCenter(touches: Touch[]): { x: number; y: number } {
		if (touches.length === 0) return { x: 0, y: 0 }
		
		let sumX = 0
		let sumY = 0
		
		for (const touch of touches) {
			sumX += touch.clientX
			sumY += touch.clientY
		}
		
		return {
			x: sumX / touches.length,
			y: sumY / touches.length
		}
	}

	// 🆕 Calculate scale from touches
	function calculateScale(touches: Touch[]): number {
		if (touches.length < 2) return 1
		
		const touch1 = touches[0]
		const touch2 = touches[1]
		
		if (!touch1 || !touch2) return 1
		
		const currentDistance = calculateDistance(
			{ id: touch1.identifier, x: touch1.clientX, y: touch1.clientY, clientX: touch1.clientX, clientY: touch1.clientY },
			{ id: touch2.identifier, x: touch2.clientX, y: touch2.clientY, clientX: touch2.clientX, clientY: touch2.clientY }
		)
		
		return initialDistance > 0 ? currentDistance / initialDistance : 1
	}

	// 🆕 Calculate rotation from touches
	function calculateRotation(touches: Touch[]): number {
		if (touches.length < 2) return 0
		
		const touch1 = touches[0]
		const touch2 = touches[1]
		
		if (!touch1 || !touch2) return 0
		
		const currentAngle = calculateAngle(
			{ id: touch1.identifier, x: touch1.clientX, y: touch1.clientY, clientX: touch1.clientX, clientY: touch1.clientY },
			{ id: touch2.identifier, x: touch2.clientX, y: touch2.clientY, clientX: touch2.clientX, clientY: touch2.clientY }
		)
		
		return currentAngle - initialAngle
	}

	// 🆕 Calculate velocity
	function calculateVelocity(
		current: MultiTouchState,
		previous: MultiTouchState,
		deltaTime: number
	): { x: number; y: number; scale: number; rotation: number } {
		if (deltaTime === 0) return { x: 0, y: 0, scale: 0, rotation: 0 }
		
		return {
			x: (current.center.x - previous.center.x) / deltaTime,
			y: (current.center.y - previous.center.y) / deltaTime,
			scale: (current.scale - previous.scale) / deltaTime,
			rotation: (current.rotation - previous.rotation) / deltaTime
		}
	}

	// 🆕 Handle touch start
	function handleTouchStart(event: Event) {
		const touchEvent = event as TouchEvent
		touchEvent.preventDefault()
		
		const el = element()
		if (!el) return

		const touches = Array.from(touchEvent.touches)
		const opts = options()
		
		const minTouches = opts.minTouches || 1
		const maxTouches = opts.maxTouches || 10
		
		if (touches.length < minTouches || touches.length > maxTouches) return

		lastTouches = touches
		lastTime = Date.now()
		
		const center = calculateCenter(touches)
		
		if (touches.length >= 2) {
			const touch1 = touches[0]
			const touch2 = touches[1]
			
			if (touch1 && touch2) {
				initialDistance = calculateDistance(
					{ id: touch1.identifier, x: touch1.clientX, y: touch1.clientY, clientX: touch1.clientX, clientY: touch1.clientY },
					{ id: touch2.identifier, x: touch2.clientX, y: touch2.clientY, clientX: touch2.clientX, clientY: touch2.clientY }
				)
				initialAngle = calculateAngle(
					{ id: touch1.identifier, x: touch1.clientX, y: touch1.clientY, clientX: touch1.clientX, clientY: touch1.clientY },
					{ id: touch2.identifier, x: touch2.clientX, y: touch2.clientY, clientX: touch2.clientX, clientY: touch2.clientY }
				)
			}
		}

		setState({
			element: el,
			isActive: true,
			touches,
			center,
			distance: initialDistance,
			angle: initialAngle,
			scale: 1,
			rotation: 0,
			velocity: { x: 0, y: 0, scale: 0, rotation: 0 }
		})

		// Call onMultiTouchStart callback
		opts.onMultiTouchStart?.(touchEvent, state())
	}

	// 🆕 Handle touch move
	function handleTouchMove(event: Event) {
		const touchEvent = event as TouchEvent
		touchEvent.preventDefault()
		
		const el = element()
		if (!el || !state().isActive) return

		const touches = Array.from(touchEvent.touches)
		const opts = options()
		
		const minTouches = opts.minTouches || 1
		const maxTouches = opts.maxTouches || 10
		
		if (touches.length < minTouches || touches.length > maxTouches) return

		const currentTime = Date.now()
		const deltaTime = currentTime - lastTime
		const previousState = state()
		
		const center = calculateCenter(touches)
		const scale = calculateScale(touches)
		const rotation = calculateRotation(touches)
		
		let distance = 0
		let angle = 0
		
		if (touches.length >= 2) {
			const touch1 = touches[0]
			const touch2 = touches[1]
			
			if (touch1 && touch2) {
				distance = calculateDistance(
					{ id: touch1.identifier, x: touch1.clientX, y: touch1.clientY, clientX: touch1.clientX, clientY: touch1.clientY },
					{ id: touch2.identifier, x: touch2.clientX, y: touch2.clientY, clientX: touch2.clientX, clientY: touch2.clientY }
				)
				angle = calculateAngle(
					{ id: touch1.identifier, x: touch1.clientX, y: touch1.clientY, clientX: touch1.clientX, clientY: touch1.clientY },
					{ id: touch2.identifier, x: touch2.clientX, y: touch2.clientY, clientX: touch2.clientX, clientY: touch2.clientY }
				)
			}
		}

		const newState: MultiTouchState = {
			element: el,
			isActive: true,
			touches,
			center,
			distance,
			angle,
			scale,
			rotation,
			velocity: calculateVelocity(
				{ ...previousState, center, scale, rotation },
				previousState,
				deltaTime
			)
		}

		setState(newState)
		lastTouches = touches
		lastTime = currentTime

		// Call onMultiTouchMove callback
		opts.onMultiTouchMove?.(touchEvent, newState)
	}

	// 🆕 Handle touch end
	function handleTouchEnd(event: Event) {
		const touchEvent = event as TouchEvent
		touchEvent.preventDefault()
		
		const el = element()
		if (!el) return

		const opts = options()
		
		setState(prev => ({
			...prev,
			isActive: false,
			touches: [],
			velocity: { x: 0, y: 0, scale: 0, rotation: 0 }
		}))

		// Call onMultiTouchEnd callback
		opts.onMultiTouchEnd?.(touchEvent, state())
	}

	// 🆕 Set up event listeners
	createEffect(() => {
		const el = element()
		if (!el) return

		el.addEventListener("touchstart", handleTouchStart as EventListener, { passive: false })
		el.addEventListener("touchmove", handleTouchMove as EventListener, { passive: false })
		el.addEventListener("touchend", handleTouchEnd as EventListener, { passive: false })
		el.addEventListener("touchcancel", handleTouchEnd as EventListener, { passive: false })

		onCleanup(() => {
			el.removeEventListener("touchstart", handleTouchStart as EventListener)
			el.removeEventListener("touchmove", handleTouchMove as EventListener)
			el.removeEventListener("touchend", handleTouchEnd as EventListener)
			el.removeEventListener("touchcancel", handleTouchEnd as EventListener)
		})
	})

	return state
}

// 🆕 Utility function to check if device supports touch
export function supportsTouch(): boolean {
	return "ontouchstart" in window || navigator.maxTouchPoints > 0
}

// 🆕 Utility function to get touch points from event
export function getTouchPoints(event: TouchEvent): TouchPoint[] {
	return Array.from(event.touches).map(touch => ({
		id: touch.identifier,
		x: touch.clientX,
		y: touch.clientY,
		clientX: touch.clientX,
		clientY: touch.clientY
	}))
}
