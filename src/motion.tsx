import {Dynamic} from "solid-js/web"
import {useContext, splitProps, JSX, createContext} from "solid-js"
import {combineStyle} from "@solid-primitives/props"
import {MotionState} from "@motionone/dom"

import type {MotionComponentProps, MotionProxy, MotionProxyComponent} from "./types.js"
import {createAndBindMotionState} from "./primitives.js"
import {PresenceContext} from "./presence.jsx"

const OPTION_KEYS = [
	"initial",
	"animate",
	"inView",
	"inViewOptions",
	"hover",
	"press",
	"variants",
	"transition",
	"exit",
	"onMotionComplete",
	// 🆕 Drag system options
	"drag",
	"dragConstraints",
	"dragElastic",
	"dragMomentum",
	"dragSnapToOrigin",
	"whileDrag",
	"onDragStart",
	"onDrag",
	"onDragEnd",
	// 🆕 Layout animation options
	"layout",
	"layoutId",
	"layoutRoot",
	"layoutScroll",
	"layoutDependency",
	// 🆕 Scroll integration options
	"scroll",
	"scrollContainer",
	"scrollOffset",
	"scrollOnce",
	"scrollAmount",
	"parallax",
	"parallaxSpeed",
	"parallaxOffset",
	// 🆕 Advanced gesture options
	"multiTouch",
	"pinchZoom",
	"minTouches",
	"maxTouches",
	"initialScale",
	"initialRotation",
	"minScale",
	"maxScale",
	"momentum",
	"momentumDecay",
	"whilePinch",
	"onMultiTouchStart",
	"onMultiTouchMove",
	"onMultiTouchEnd",
	"onPinchStart",
	"onPinchMove",
	"onPinchEnd",
	// 🆕 Stagger and orchestration options
	"stagger",
	"staggerDirection",
	"staggerChildren",
	"staggerDelay",
	"staggerDelayChildren",
	"timeline",
	"timelineDuration",
	"timelineEasing",
	"timelineRepeat",
	"timelineRepeatDelay",
	"orchestrate",
	"orchestrateDelay",
	"orchestrateStagger",
	"orchestrateDirection",
	"orchestrateFrom",
	"orchestrateTo",
	"onStaggerStart",
	"onStaggerComplete",
	"onTimelineStart",
	"onTimelineUpdate",
	"onTimelineComplete",
	// 🆕 Phase 6: Advanced animation options
	"spring",
	"springStiffness",
	"springDamping",
	"springMass",
	"springRestDelta",
	"springRestSpeed",
	"keyframes",
	"keyframeEasing",
	"keyframeOffset",
	"variants",
	"initial",
	"animate",
	"exit",
	"whileHover",
	"whileTap",
	"whileFocus",
	"whileDrag",
	"whilePinch",
	"custom",
	"gestureAnimation",
	"gestureVariants",
	"onSpringStart",
	"onSpringComplete",
	"onKeyframeStart",
	"onKeyframeComplete",
	"onVariantStart",
	"onVariantComplete",
	"onGestureAnimationStart",
	"onGestureAnimationEnd",
	// Phase 7: Advanced Features
	"debug",
	"debugOptions",
	"pauseOnFocus",
	"resumeOnBlur",
	"pauseOnHover",
	"respectReducedMotion",
	"reducedMotionAnimation",
	"manualPause",
	"manualResume",
	"preset",
	"presetOptions",
	"sequence",
	"sequenceOptions",
	// 🆕 Phase 8: Enhanced Gestures
	"gestureRecognition",
	"advancedOrchestration",
	// 🆕 Phase 9: Integration & Polish
	"routerIntegration",
	"formIntegration",
	"animationInspector",
	// 🆕 Phase 10: Advanced Features
	"canvas",
	"canvasWidth",
	"canvasHeight",
	"canvasContext",
	"canvasPixelRatio",
	"canvasAntialias",
	"canvasAlpha",
	"canvasDepth",
	"canvasStencil",
	"canvasPreserveDrawingBuffer",
	"canvasPowerPreference",
	"canvasFailIfMajorPerformanceCaveat",
	"onCanvasReady",
	"onCanvasResize",
	"onCanvasRender",
	"webgl",
	"webglVersion",
	"webglVertexShader",
	"webglFragmentShader",
	"webglAttributes",
	"webglUniforms",
	"webglTextures",
	"webglBlendMode",
	"webglDepthTest",
	"webglCullFace",
	"webglFrontFace",
	"onWebGLReady",
	"onWebGLRender",
	"shader",
	"shaderType",
	"shaderSource",
	"shaderPrecision",
	"shaderExtensions",
	"shaderUniforms",
	"shaderAttributes",
	"shaderVaryings",
	"onShaderCompile",
	"onShaderLink",
	"threeD",
	"threeDPerspective",
	"threeDRotateX",
	"threeDRotateY",
	"threeDRotateZ",
	"threeDTranslateX",
	"threeDTranslateY",
	"threeDTranslateZ",
	"threeDScaleX",
	"threeDScaleY",
	"threeDScaleZ",
	"threeDMatrix",
	"threeDMatrixAuto",
	"onThreeDUpdate",
	"particles",
	"particleCount",
	"particleSize",
	"particleColor",
	"particleVelocity",
	"particleLife",
	"particleGravity",
	"particleEmission",
	"particleEmissionRate",
	"particleEmissionBurst",
	"onParticleCreate",
	"onParticleUpdate",
	"onParticleDestroy",
] as const

const ATTR_KEYS = ["tag"] as const

export const ParentContext = createContext<MotionState>()

/** @internal */
export const MotionComponent = (
	props: MotionComponentProps & {
		tag?: string
		ref?: any
		style?: JSX.CSSProperties | string
	},
): JSX.Element => {
	const [options, , attrs] = splitProps(props, OPTION_KEYS, ATTR_KEYS)

	const [state, style] = createAndBindMotionState(
		() => root,
		() => ({...options}),
		useContext(PresenceContext),
		useContext(ParentContext),
	)

	let root!: Element
	return (
		<ParentContext.Provider value={state}>
			<Dynamic
				{...attrs}
				ref={(el: Element) => {
					root = el
					props.ref?.(el)
					
					// Connect onMotionComplete event handler
					if (options.onMotionComplete) {
						el.addEventListener("motioncomplete", options.onMotionComplete as EventListener)
					}
				}}
				component={props.tag || "div"}
				style={combineStyle(props.style, style)}
			/>
		</ParentContext.Provider>
	)
}

/**
 * Renders an animatable HTML or SVG element.
 *
 * @component
 * Animation props:
 * - `animate` a target of values to animate to. Accepts all the same values and keyframes as Motion One's [animate function](https://motion.dev/dom/animate). This prop is **reactive** – changing it will animate the transition element to the new state.
 * - `transition` for changing type of animation
 * - `initial` a target of values to animate from when the element is first rendered.
 * - `exit` a target of values to animate to when the element is removed. The element must be a direct child of the `<Presence>` component.
 *
 * @example
 * ```tsx
 * <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}/>
 * ```
 *
 * Interaction animation props:
 *
 * - `inView` animation target for when the element is in view
 * - `hover` animate when hovered
 * - `press` animate when pressed
 *
 * @example
 * ```tsx
 * <Motion.div hover={{ scale: 1.2 }} press={{ scale: 0.9 }}/>
 * ```
 *
 * Drag animation props:
 *
 * - `drag` enable drag functionality
 * - `dragConstraints` limit drag boundaries
 * - `whileDrag` animate during drag
 *
 * @example
 * ```tsx
 * <Motion.div drag dragConstraints={{ left: 0, right: 300 }} whileDrag={{ scale: 1.1 }}/>
 * ```
 *
 * Layout animation props:
 *
 * - `layout` enable layout animations
 * - `layoutId` shared layout identifier
 * - `layoutRoot` mark as layout root
 *
 * @example
 * ```tsx
 * <Motion.div layout layoutId="shared-element"/>
 * ```
 *
 * Scroll integration props:
 *
 * - `scroll` enable scroll-based animations
 * - `parallax` enable parallax effects
 * - `scrollContainer` specify scroll container
 *
 * @example
 * ```tsx
 * <Motion.div scroll parallax={0.5} parallaxSpeed={0.3}/>
 * ```
 *
 * Advanced gesture props:
 *
 * - `multiTouch` enable multi-touch gestures
 * - `pinchZoom` enable pinch-to-zoom
 * - `whilePinch` animate during pinch gestures
 *
 * @example
 * ```tsx
 * <Motion.div pinchZoom minScale={0.5} maxScale={3} whilePinch={{ scale: 1.1 }}/>
 * ```
 */
export const Motion = new Proxy(MotionComponent, {
	get:
		(_, tag: string): MotionProxyComponent<any> =>
		props => <MotionComponent {...props} tag={tag} />,
}) as MotionProxy
