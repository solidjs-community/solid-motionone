import { Accessor, createSignal, onCleanup } from "solid-js"
import type { DragOptions } from "../types.js"
import {
	normalizePointerEvent,
	applyConstraints,
	applyElastic,
	createPanInfo,
	throttle,
} from "./utils.js"

// 🆕 Drag state interface
export interface DragState {
	isDragging: boolean
	startPoint: { x: number; y: number } | null
	currentPoint: { x: number; y: number } | null
	startTime: number | null
	elementBounds: DOMRect | null
}

// 🆕 Drag controls interface
export interface DragControls {
	start: () => void
	stop: () => void
	state: Accessor<DragState>
}

// 🆕 Create drag controls for an element
export function createDragControls(
	element: () => Element,
	options: Accessor<DragOptions>
): DragControls {
	const [state, setState] = createSignal<DragState>({
		isDragging: false,
		startPoint: null,
		currentPoint: null,
		startTime: null,
		elementBounds: null,
	})

	let cleanup: (() => void) | null = null

	// 🆕 Handle pointer down event
	const handlePointerDown = (event: Event): void => {
		const pointerEvent = event as PointerEvent
		const opts = options()
		if (!opts.drag) return

		// Prevent default behavior for drag
		pointerEvent.preventDefault()
		
		const normalizedEvent = normalizePointerEvent(pointerEvent)
		const rect = element().getBoundingClientRect()
		
		setState({
			isDragging: true,
			startPoint: { x: normalizedEvent.clientX, y: normalizedEvent.clientY },
			currentPoint: { x: normalizedEvent.clientX, y: normalizedEvent.clientY },
			startTime: Date.now(),
			elementBounds: rect,
		})

		// Call onDragStart callback
		if (opts.onDragStart) {
			const panInfo = createPanInfo(
				{ x: normalizedEvent.clientX, y: normalizedEvent.clientY },
				{ x: normalizedEvent.clientX, y: normalizedEvent.clientY },
				Date.now(),
				Date.now()
			)
			opts.onDragStart(normalizedEvent, panInfo)
		}

		// Set pointer capture for cross-browser compatibility
		element().setPointerCapture(normalizedEvent.pointerId)
		
		// Add global event listeners
		document.addEventListener("pointermove", handlePointerMove, { passive: false })
		document.addEventListener("pointerup", handlePointerUp, { passive: false })
	}

	// 🆕 Handle pointer move event (throttled for performance)
	const handlePointerMove = throttle((event: Event): void => {
		const pointerEvent = event as PointerEvent
		const currentState = state()
		if (!currentState.isDragging) return

		const normalizedEvent = normalizePointerEvent(pointerEvent)
		const newPoint = { x: normalizedEvent.clientX, y: normalizedEvent.clientY }
		
		setState(prev => ({
			...prev,
			currentPoint: newPoint,
		}))

		// Apply constraints and elastic behavior
		const opts = options()
		if (opts.dragConstraints && currentState.elementBounds) {
			const constrainedPoint = applyConstraints(
				newPoint,
				opts.dragConstraints,
				currentState.elementBounds
			)
			
			const elasticPoint = applyElastic(
				constrainedPoint,
				opts.dragConstraints,
				currentState.elementBounds,
				opts.dragElastic
			)
			
			// Update element position
			updateElementPosition(elasticPoint, opts.drag)
		} else {
			updateElementPosition(newPoint, opts.drag)
		}

		// Call onDrag callback
		if (opts.onDrag && currentState.startPoint && currentState.startTime) {
			const panInfo = createPanInfo(
				currentState.startPoint,
				newPoint,
				currentState.startTime,
				Date.now()
			)
			opts.onDrag(normalizedEvent, panInfo)
		}
	}, 16) // ~60fps

	// 🆕 Handle pointer up event
	const handlePointerUp = (event: Event): void => {
		const pointerEvent = event as PointerEvent
		const currentState = state()
		if (!currentState.isDragging) return

		const normalizedEvent = normalizePointerEvent(pointerEvent)
		const opts = options()

		// Call onDragEnd callback
		if (opts.onDragEnd && currentState.startPoint && currentState.startTime) {
			const panInfo = createPanInfo(
				currentState.startPoint,
				currentState.currentPoint || currentState.startPoint,
				currentState.startTime,
				Date.now()
			)
			opts.onDragEnd(normalizedEvent, panInfo)
		}

		// Reset drag state
		setState({
			isDragging: false,
			startPoint: null,
			currentPoint: null,
			startTime: null,
			elementBounds: null,
		})

		// Release pointer capture
		element().releasePointerCapture(normalizedEvent.pointerId)
		
		// Remove global event listeners
		document.removeEventListener("pointermove", handlePointerMove)
		document.removeEventListener("pointerup", handlePointerUp)
	}

	// 🆕 Update element position based on drag type
	function updateElementPosition(point: { x: number; y: number }, dragType?: boolean | "x" | "y"): void {
		const el = element() as HTMLElement
		const rect = el.getBoundingClientRect()
		const parentRect = el.parentElement?.getBoundingClientRect() || rect
		
		const x = point.x - parentRect.left
		const y = point.y - parentRect.top

		// Apply drag type constraints
		if (dragType === "x") {
			el.style.transform = `translateX(${x}px)`
		} else if (dragType === "y") {
			el.style.transform = `translateY(${y}px)`
		} else {
			el.style.transform = `translate(${x}px, ${y}px)`
		}
	}

	// 🆕 Start drag system
	const start = (): void => {
		if (cleanup) return
		
		const el = element()
		el.addEventListener("pointerdown", handlePointerDown, { passive: false })
		
		cleanup = () => {
			el.removeEventListener("pointerdown", handlePointerDown)
			document.removeEventListener("pointermove", handlePointerMove)
			document.removeEventListener("pointerup", handlePointerUp)
		}
	}

	// 🆕 Stop drag system
	const stop = (): void => {
		if (cleanup) {
			cleanup()
			cleanup = null
		}
		setState({
			isDragging: false,
			startPoint: null,
			currentPoint: null,
			startTime: null,
			elementBounds: null,
		})
	}

	// Auto-cleanup on unmount
	onCleanup(() => {
		stop()
	})

	return {
		start,
		stop,
		state,
	}
}
