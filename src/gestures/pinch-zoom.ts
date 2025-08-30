import { createEffect, onCleanup, Accessor } from "solid-js"
import type { PinchZoomOptions, MultiTouchState } from "../types.js"
import { createMultiTouchGesture, supportsTouch } from "./multi-touch.js"

// 🆕 Pinch zoom state interface
export interface PinchZoomState {
	element: Element
	isActive: boolean
	scale: number
	rotation: number
	center: { x: number; y: number }
	velocity: { scale: number; rotation: number }
	initialScale: number
	initialRotation: number
}

// 🆕 Create pinch zoom gesture
export function createPinchZoomGesture(
	element: () => Element,
	options: Accessor<PinchZoomOptions> = () => ({})
) {
	let pinchZoomState: PinchZoomState | null = null
	let animationFrame: number | null = null

	// 🆕 Create multi-touch gesture for pinch detection
	const multiTouchState = createMultiTouchGesture(element, () => ({
		minTouches: 2,
		maxTouches: 2,
		onMultiTouchStart: (event, state) => {
			const opts = options()
			pinchZoomState = {
				element: state.element,
				isActive: true,
				scale: opts.initialScale || 1,
				rotation: opts.initialRotation || 0,
				center: state.center,
				velocity: { scale: 0, rotation: 0 },
				initialScale: opts.initialScale || 1,
				initialRotation: opts.initialRotation || 0
			}
			
			opts.onPinchStart?.(event, pinchZoomState)
		},
		onMultiTouchMove: (event, state) => {
			if (!pinchZoomState) return
			
			const opts = options()
			const previousScale = pinchZoomState.scale
			const previousRotation = pinchZoomState.rotation
			
			// Calculate new scale and rotation
			const newScale = Math.max(
				opts.minScale || 0.1,
				Math.min(opts.maxScale || 10, pinchZoomState.initialScale * state.scale)
			)
			const newRotation = pinchZoomState.initialRotation + state.rotation
			
			// Update pinch zoom state
			pinchZoomState = {
				...pinchZoomState,
				scale: newScale,
				rotation: newRotation,
				center: state.center,
				velocity: {
					scale: (newScale - previousScale) / 16, // Assuming 60fps
					rotation: (newRotation - previousRotation) / 16
				}
			}
			
			// Apply transforms
			applyPinchZoomTransform(pinchZoomState)
			
			opts.onPinchMove?.(event, pinchZoomState)
		},
		onMultiTouchEnd: (event, state) => {
			if (!pinchZoomState) return
			
			const opts = options()
			
			// Apply momentum if enabled
			if (opts.momentum) {
				applyPinchZoomMomentum(pinchZoomState)
			}
			
			pinchZoomState.isActive = false
			opts.onPinchEnd?.(event, pinchZoomState)
		}
	}))

	// 🆕 Apply pinch zoom transform
	function applyPinchZoomTransform(state: PinchZoomState) {
		const el = state.element as HTMLElement
		if (!el) return
		
		const opts = options()
		
		// Calculate transform origin
		const rect = el.getBoundingClientRect()
		const originX = ((state.center.x - rect.left) / rect.width) * 100
		const originY = ((state.center.y - rect.top) / rect.height) * 100
		
		// Apply transform
		el.style.transformOrigin = `${originX}% ${originY}%`
		el.style.transform = `scale(${state.scale}) rotate(${state.rotation}deg)`
		
		// Apply constraints if specified
		if (opts.constraints) {
			applyPinchZoomConstraints(state, opts.constraints)
		}
	}

	// 🆕 Apply pinch zoom constraints
	function applyPinchZoomConstraints(
		state: PinchZoomState,
		constraints: { minScale?: number; maxScale?: number; minRotation?: number; maxRotation?: number }
	) {
		const el = state.element as HTMLElement
		if (!el) return
		
		let constrainedScale = state.scale
		let constrainedRotation = state.rotation
		
		// Apply scale constraints
		if (constraints.minScale !== undefined) {
			constrainedScale = Math.max(constrainedScale, constraints.minScale)
		}
		if (constraints.maxScale !== undefined) {
			constrainedScale = Math.min(constrainedScale, constraints.maxScale)
		}
		
		// Apply rotation constraints
		if (constraints.minRotation !== undefined) {
			constrainedRotation = Math.max(constrainedRotation, constraints.minRotation)
		}
		if (constraints.maxRotation !== undefined) {
			constrainedRotation = Math.min(constrainedRotation, constraints.maxRotation)
		}
		
		// Update state and apply transform
		if (constrainedScale !== state.scale || constrainedRotation !== state.rotation) {
			pinchZoomState = {
				...state,
				scale: constrainedScale,
				rotation: constrainedRotation
			}
			applyPinchZoomTransform(pinchZoomState)
		}
	}

	// 🆕 Apply pinch zoom momentum
	function applyPinchZoomMomentum(state: PinchZoomState) {
		if (!state.isActive) return
		
		const opts = options()
		const momentumDecay = opts.momentumDecay || 0.95
		
		let currentScale = state.scale
		let currentRotation = state.rotation
		let currentVelocityScale = state.velocity.scale
		let currentVelocityRotation = state.velocity.rotation
		
		function animateMomentum() {
			// Apply velocity
			currentScale += currentVelocityScale
			currentRotation += currentVelocityRotation
			
			// Apply decay
			currentVelocityScale *= momentumDecay
			currentVelocityRotation *= momentumDecay
			
			// Stop animation if velocity is very small
			if (Math.abs(currentVelocityScale) < 0.001 && Math.abs(currentVelocityRotation) < 0.001) {
				if (animationFrame) {
					cancelAnimationFrame(animationFrame)
					animationFrame = null
				}
				return
			}
			
			// Apply constraints
			const constrainedScale = Math.max(
				opts.minScale || 0.1,
				Math.min(opts.maxScale || 10, currentScale)
			)
			const constrainedRotation = currentRotation
			
			// Update state and apply transform
			if (pinchZoomState) {
				pinchZoomState = {
					...pinchZoomState,
					scale: constrainedScale,
					rotation: constrainedRotation,
					velocity: { scale: currentVelocityScale, rotation: currentVelocityRotation }
				}
				applyPinchZoomTransform(pinchZoomState)
			}
			
			// Continue animation
			animationFrame = requestAnimationFrame(animateMomentum)
		}
		
		animateMomentum()
	}

	// 🆕 Reset pinch zoom
	function resetPinchZoom() {
		const el = element()
		if (!el) return
		
		const htmlEl = el as HTMLElement
		htmlEl.style.transform = ""
		htmlEl.style.transformOrigin = ""
		
		if (pinchZoomState) {
			pinchZoomState = {
				...pinchZoomState,
				scale: options().initialScale || 1,
				rotation: options().initialRotation || 0,
				isActive: false
			}
		}
	}

	// 🆕 Set up pinch zoom effect
	createEffect(() => {
		const opts = options()
		
		if (!opts.pinchZoom) return
		
		// Initialize pinch zoom state
		pinchZoomState = {
			element: element(),
			isActive: false,
			scale: opts.initialScale || 1,
			rotation: opts.initialRotation || 0,
			center: { x: 0, y: 0 },
			velocity: { scale: 0, rotation: 0 },
			initialScale: opts.initialScale || 1,
			initialRotation: opts.initialRotation || 0
		}
		
		onCleanup(() => {
			if (animationFrame) {
				cancelAnimationFrame(animationFrame)
			}
			resetPinchZoom()
		})
	})

	return {
		state: multiTouchState,
		reset: resetPinchZoom,
		getPinchZoomState: () => pinchZoomState
	}
}

// 🆕 Utility function to check if pinch zoom is supported
export function supportsPinchZoom(): boolean {
	return supportsTouch() && navigator.maxTouchPoints >= 2
}

// 🆕 Utility function to create pinch zoom constraints
export function createPinchZoomConstraints(options: {
	minScale?: number
	maxScale?: number
	minRotation?: number
	maxRotation?: number
}) {
	return options
}
