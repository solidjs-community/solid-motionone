// 🆕 Advanced gesture system exports
export * from "./multi-touch.js"
export * from "./pinch-zoom.js"

// Re-export types for convenience
export type { 
	MultiTouchOptions, 
	PinchZoomOptions, 
	MultiTouchState, 
	PinchZoomState 
} from "../types.js"

// 🆕 Advanced gesture utilities
export function createAdvancedGestures(
	element: () => Element,
	options: Accessor<any> = () => ({})
) {
	const multiTouchState = createMultiTouchGesture(element, options)
	const pinchZoomControls = createPinchZoomGesture(element, options)
	
	return {
		multiTouch: multiTouchState,
		pinchZoom: pinchZoomControls,
		// Combined state getter
		getState: () => ({
			multiTouch: multiTouchState(),
			pinchZoom: pinchZoomControls.getPinchZoomState()
		}),
		// Reset all gestures
		reset: () => {
			pinchZoomControls.reset()
		}
	}
}

// 🆕 Import the gesture functions
import { createMultiTouchGesture } from "./multi-touch.js"
import { createPinchZoomGesture } from "./pinch-zoom.js"
import type { Accessor } from "solid-js"
