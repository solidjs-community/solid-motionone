import type { DragConstraints, PanInfo } from "../types.js"

// 🆕 Pointer event normalization for cross-browser compatibility
export function normalizePointerEvent(event: PointerEvent | TouchEvent): PointerEvent {
	if (event instanceof PointerEvent) {
		return event
	}
	
	// Convert TouchEvent to PointerEvent-like object
	const touch = event.touches[0] || event.changedTouches[0]
	if (!touch) {
		throw new Error("No touch point available in TouchEvent")
	}
	
	return {
		clientX: touch.clientX,
		clientY: touch.clientY,
		pageX: touch.pageX,
		pageY: touch.pageY,
		pointerId: touch.identifier,
		pointerType: "touch",
		preventDefault: () => event.preventDefault(),
		stopPropagation: () => event.stopPropagation(),
	} as PointerEvent
}

// 🆕 Velocity calculation utilities
export function calculateVelocity(
	startPoint: { x: number; y: number },
	endPoint: { x: number; y: number },
	timeDelta: number
): { x: number; y: number } {
	const deltaX = endPoint.x - startPoint.x
	const deltaY = endPoint.y - startPoint.y
	
	return {
		x: timeDelta > 0 ? deltaX / timeDelta : 0,
		y: timeDelta > 0 ? deltaY / timeDelta : 0,
	}
}

// 🆕 Distance calculation
export function calculateDistance(
	startPoint: { x: number; y: number },
	endPoint: { x: number; y: number }
): { x: number; y: number } {
	return {
		x: Math.abs(endPoint.x - startPoint.x),
		y: Math.abs(endPoint.y - startPoint.y),
	}
}

// 🆕 Constraint boundary helpers
export function applyConstraints(
	position: { x: number; y: number },
	constraints: DragConstraints,
	elementBounds: DOMRect
): { x: number; y: number } {
	let { x, y } = position
	
	// Apply boundary constraints
	if (constraints.left !== undefined) {
		x = Math.max(x, constraints.left)
	}
	if (constraints.right !== undefined) {
		x = Math.min(x, constraints.right - elementBounds.width)
	}
	if (constraints.top !== undefined) {
		y = Math.max(y, constraints.top)
	}
	if (constraints.bottom !== undefined) {
		y = Math.min(y, constraints.bottom - elementBounds.height)
	}
	
	// Apply reference element constraints
	if (constraints.ref) {
		const refBounds = constraints.ref.getBoundingClientRect()
		x = Math.max(Math.min(x, refBounds.right - elementBounds.width), refBounds.left)
		y = Math.max(Math.min(y, refBounds.bottom - elementBounds.height), refBounds.top)
	}
	
	return { x, y }
}

// 🆕 Elastic behavior calculation
export function applyElastic(
	position: { x: number; y: number },
	constraints: DragConstraints,
	elementBounds: DOMRect,
	elastic: boolean | number = false
): { x: number; y: number } {
	if (!elastic) return position
	
	const elasticFactor = typeof elastic === "number" ? elastic : 0.3
	let { x, y } = position
	
	// Apply elastic behavior at boundaries
	if (constraints.left !== undefined && x < constraints.left) {
		const overflow = constraints.left - x
		x = constraints.left - overflow * elasticFactor
	}
	if (constraints.right !== undefined && x > constraints.right - elementBounds.width) {
		const overflow = x - (constraints.right - elementBounds.width)
		x = constraints.right - elementBounds.width + overflow * elasticFactor
	}
	if (constraints.top !== undefined && y < constraints.top) {
		const overflow = constraints.top - y
		y = constraints.top - overflow * elasticFactor
	}
	if (constraints.bottom !== undefined && y > constraints.bottom - elementBounds.height) {
		const overflow = y - (constraints.bottom - elementBounds.height)
		y = constraints.bottom - elementBounds.height + overflow * elasticFactor
	}
	
	return { x, y }
}

// 🆕 Create PanInfo object
export function createPanInfo(
	startPoint: { x: number; y: number },
	currentPoint: { x: number; y: number },
	startTime: number,
	currentTime: number
): PanInfo {
	const timeDelta = currentTime - startTime
	const velocity = calculateVelocity(startPoint, currentPoint, timeDelta)
	const distance = calculateDistance(startPoint, currentPoint)
	
	return {
		point: currentPoint,
		offset: {
			x: currentPoint.x - startPoint.x,
			y: currentPoint.y - startPoint.y,
		},
		velocity,
		distance,
	}
}

// 🆕 Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: number | null = null
	let lastExecTime = 0
	
	return (...args: Parameters<T>) => {
		const currentTime = Date.now()
		
		if (currentTime - lastExecTime > delay) {
			func(...args)
			lastExecTime = currentTime
		} else {
			if (timeoutId) clearTimeout(timeoutId)
			timeoutId = window.setTimeout(() => {
				func(...args)
				lastExecTime = Date.now()
			}, delay - (currentTime - lastExecTime))
		}
	}
}
