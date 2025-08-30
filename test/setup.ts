import '@testing-library/jest-dom'

// Mock PointerEvent for JSDOM
global.PointerEvent = class PointerEvent extends Event {
	clientX: number
	clientY: number
	pageX: number
	pageY: number
	pointerId: number
	pointerType: string

	constructor(type: string, init?: any) {
		super(type, init)
		this.clientX = init?.clientX ?? 0
		this.clientY = init?.clientY ?? 0
		this.pageX = init?.pageX ?? 0
		this.pageY = init?.pageY ?? 0
		this.pointerId = init?.pointerId ?? 0
		this.pointerType = init?.pointerType ?? 'mouse'
	}
} as any

// Mock setPointerCapture and releasePointerCapture for JSDOM
if (typeof Element !== 'undefined') {
	Element.prototype.setPointerCapture = function(pointerId: number) {
		// Mock implementation
		return
	}
	
	Element.prototype.releasePointerCapture = function(pointerId: number) {
		// Mock implementation
		return
	}
}

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

// Mock IntersectionObserver for tests
global.IntersectionObserver = class IntersectionObserver {
	constructor() {}
	observe() {}
	unobserve() {}
	disconnect() {}
} as any

// Mock requestAnimationFrame for tests - use small delay to simulate real timing
global.requestAnimationFrame = (callback) => {
	// Use a small delay to simulate real animation frame timing
	return setTimeout(callback, 1)
}

global.cancelAnimationFrame = (id) => {
	clearTimeout(id)
}
