export * from "./types.js"
export {Motion} from "./motion.jsx"
export {Presence} from "./presence.jsx"
export {createMotion, motion} from "./primitives.js"
export {LayoutGroup} from "./layout/LayoutGroup.jsx"
export {createScrollPosition, createScrollState} from "./scroll/scroll-position.js"
export {createTransform, createScrollTransform, easing} from "./scroll/transform.js"
export {createParallaxEffect} from "./scroll/parallax.js"
export {createMultiTouchGesture, supportsTouch} from "./gestures/multi-touch.js"
export {createPinchZoomGesture, supportsPinchZoom} from "./gestures/pinch-zoom.js"
export {createAdvancedGestures} from "./gestures/advanced.js"
export {createStaggerController, createStaggerChildren, calculateStaggerIndex} from "./orchestration/stagger.js"
export {createTimelineController, createTimelineSegment, createTimelineConfig} from "./orchestration/timeline.js"
export {createOrchestrationController, createOrchestratedChildren, createStaggeredList, createTimelineSequence, createOrchestratedSequence} from "./orchestration/index.js"
// 🆕 Phase 6: Advanced Animation Features
export * from "./animations/index.js"

// 🆕 Phase 7: Advanced Features
export * from "./debug/index.js"
export * from "./accessibility/index.js"
export * from "./presets/index.js"
export * from "./orchestration/sequences.js"

// 🆕 Phase 8: Enhanced Gestures
export * from "./gestures/recognition.js"
export * from "./orchestration/advanced.js"

// 🆕 Phase 9: Integration & Polish
export * from "./integration/index.js"
export * from "./canvas/index.js"
