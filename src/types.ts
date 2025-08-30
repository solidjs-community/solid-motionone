import type * as motionone from "@motionone/dom"
import type {PropertiesHyphen} from "csstype"
import type {JSX, ParentProps} from "solid-js"

export type {VariantDefinition, Options} from "@motionone/dom"

// 🆕 Drag System Types
export interface DragConstraints {
	left?: number
	right?: number
	top?: number
	bottom?: number
	ref?: Element
}

export interface PanInfo {
	point: { x: number; y: number }
	offset: { x: number; y: number }
	velocity: { x: number; y: number }
	distance: { x: number; y: number }
}

export interface DragOptions {
	drag?: boolean | "x" | "y"
	dragConstraints?: DragConstraints
	dragElastic?: boolean | number
	dragMomentum?: boolean
	dragSnapToOrigin?: boolean
	whileDrag?: motionone.VariantDefinition
	onDragStart?: (event: PointerEvent, info: PanInfo) => void
	onDrag?: (event: PointerEvent, info: PanInfo) => void
	onDragEnd?: (event: PointerEvent, info: PanInfo) => void
}

// 🆕 Layout Animation Types
export interface LayoutOptions {
	layout?: boolean | "position" | "size"
	layoutId?: string
	layoutRoot?: boolean
	layoutScroll?: boolean
	layoutDependency?: any
}

export interface LayoutState {
	element: Element
	id: string | undefined
	snapshot: DOMRect
	isAnimating: boolean
}

// 🆕 Scroll Integration Types
export interface ScrollOptions {
	container?: Element | Window
	offset?: number | [number, number]
	once?: boolean
	amount?: "some" | "all" | number
}

export interface ScrollPosition {
	x: number
	y: number
	progress: number
	velocity: { x: number; y: number }
}

export interface ScrollState {
	position: ScrollPosition
	isScrolling: boolean
	container: Element | Window
}

export interface TransformOptions {
	easing?: (t: number) => number
	clamp?: boolean
}

export interface ParallaxOptions {
	parallax?: boolean | number
	speed?: number
	offset?: number
	container?: Element | Window
}

// 🆕 Advanced Gesture Types
export interface MultiTouchOptions {
	minTouches?: number
	maxTouches?: number
	onMultiTouchStart?: (event: TouchEvent, state: any) => void
	onMultiTouchMove?: (event: TouchEvent, state: any) => void
	onMultiTouchEnd?: (event: TouchEvent, state: any) => void
}

export interface PinchZoomOptions {
	pinchZoom?: boolean
	initialScale?: number
	initialRotation?: number
	minScale?: number
	maxScale?: number
	momentum?: boolean
	momentumDecay?: number
	constraints?: {
		minScale?: number
		maxScale?: number
		minRotation?: number
		maxRotation?: number
	}
	onPinchStart?: (event: TouchEvent, state: any) => void
	onPinchMove?: (event: TouchEvent, state: any) => void
	onPinchEnd?: (event: TouchEvent, state: any) => void
}

// 🆕 Stagger Animation Types
export interface StaggerOptions {
	stagger?: number | StaggerConfig
	staggerDirection?: "forward" | "reverse" | "from" | "from-center" | "from-start" | "from-end"
	staggerChildren?: boolean | number
	staggerDelay?: number
	staggerDelayChildren?: number
	onStaggerStart?: (state: StaggerState) => void
	onStaggerComplete?: (state: StaggerState) => void
}

export interface StaggerConfig {
	delay?: number
	delayChildren?: number
	direction?: "forward" | "reverse" | "from" | "from-center" | "from-start" | "from-end"
	from?: number
	to?: number
}

export interface TimelineOptions {
	timeline?: TimelineConfig
	timelineDuration?: number
	timelineEasing?: (t: number) => number
	timelineRepeat?: number | "loop" | "reverse"
	timelineRepeatDelay?: number
	onTimelineStart?: (progress: number) => void
	onTimelineUpdate?: (progress: number) => void
	onTimelineComplete?: (progress: number) => void
}

export interface TimelineConfig {
	duration?: number
	easing?: (t: number) => number
	repeat?: number | "loop" | "reverse"
	repeatDelay?: number
	segments?: TimelineSegment[]
}

export interface TimelineSegment {
	at?: number
	animation?: motionone.VariantDefinition
	duration?: number
	easing?: (t: number) => number
}

export interface OrchestrationOptions {
	orchestrate?: boolean
	orchestrateDelay?: number
	orchestrateStagger?: number
			orchestrateDirection?: "forward" | "reverse" | "from" | "from-center"
		orchestrateFrom?: number
		orchestrateTo?: number
		// 🆕 Phase 6: Advanced animation properties
		spring?: SpringConfig | boolean
		springStiffness?: number
		springDamping?: number
		springMass?: number
		springRestDelta?: number
		springRestSpeed?: number
		keyframes?: KeyframeConfig
		keyframeEasing?: (t: number) => number | Array<(t: number) => number>
		keyframeOffset?: number | Array<number>
		variants?: Record<string, AnimationVariant>
		initial?: string | AnimationVariant
		animate?: string | AnimationVariant
		exit?: string | AnimationVariant
		whileHover?: string | AnimationVariant
		whileTap?: string | AnimationVariant
		whileFocus?: string | AnimationVariant
		whileDrag?: string | AnimationVariant
		whilePinch?: string | AnimationVariant
		custom?: any
		gestureAnimation?: boolean
		gestureVariants?: Record<string, AnimationVariant>
	}

export interface StaggerState {
	isStaggering: boolean
	currentIndex: number
	totalElements: number
	progress: number
	direction: string
}

// 🆕 Phase 6: Advanced Animation Features Types
export interface SpringConfig {
	stiffness?: number
	damping?: number
	mass?: number
	restDelta?: number
	restSpeed?: number
}

export interface SpringOptions {
	spring?: SpringConfig | boolean
	springStiffness?: number
	springDamping?: number
	springMass?: number
	springRestDelta?: number
	springRestSpeed?: number
}

export interface KeyframeConfig {
	[key: string]: number | string | Array<number | string>
}

export interface KeyframeOptions {
	keyframes?: KeyframeConfig
	keyframeEasing?: (t: number) => number | Array<(t: number) => number>
	keyframeOffset?: number | Array<number>
}

export interface AnimationVariant {
	[key: string]: any
}

export interface VariantsOptions {
	variants?: Record<string, AnimationVariant>
	initial?: string | AnimationVariant
	animate?: string | AnimationVariant
	exit?: string | AnimationVariant
	whileHover?: string | AnimationVariant
	whileTap?: string | AnimationVariant
	whileFocus?: string | AnimationVariant
	whileDrag?: string | AnimationVariant
	whilePinch?: string | AnimationVariant
	custom?: any
}

export interface AnimationControls {
	start?: () => void
	stop?: () => void
	pause?: () => void
	resume?: () => void
	reverse?: () => void
	seek?: (progress: number) => void
	set?: (values: any) => void
}

export interface AnimationControlOptions {
	controls?: AnimationControls
	onAnimationStart?: () => void
	onAnimationComplete?: () => void
	onAnimationUpdate?: (progress: number) => void
}

export interface GestureAnimationOptions {
	gestureAnimation?: boolean
	gestureVariants?: Record<string, AnimationVariant>
	onGestureStart?: (gesture: string) => void
	onGestureEnd?: (gesture: string) => void
}

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

// 🆕 Gesture State Management
export interface GestureState {
	isHovering: boolean
	isPressing: boolean
	isDragging: boolean
	isFocused: boolean
	isPinching: boolean
	panInfo?: PanInfo
	multiTouchInfo?: MultiTouchState
	pinchZoomInfo?: PinchZoomState
}

export interface MotionEventHandlers {
	onMotionStart?: (event: motionone.MotionEvent) => void
	onMotionComplete?: (event: motionone.MotionEvent) => void
	onHoverStart?: (event: motionone.CustomPointerEvent) => void
	onHoverEnd?: (event: motionone.CustomPointerEvent) => void
	onPressStart?: (event: motionone.CustomPointerEvent) => void
	onPressEnd?: (event: motionone.CustomPointerEvent) => void
	onViewEnter?: (event: motionone.ViewEvent) => void
	onViewLeave?: (event: motionone.ViewEvent) => void
	// 🆕 Drag event handlers
	onDragStart?: (event: PointerEvent, info: PanInfo) => void
	onDrag?: (event: PointerEvent, info: PanInfo) => void
	onDragEnd?: (event: PointerEvent, info: PanInfo) => void
	// 🆕 Multi-touch event handlers
	onMultiTouchStart?: (event: TouchEvent, state: MultiTouchState) => void
	onMultiTouchMove?: (event: TouchEvent, state: MultiTouchState) => void
	onMultiTouchEnd?: (event: TouchEvent, state: MultiTouchState) => void
	// 🆕 Pinch zoom event handlers
	onPinchStart?: (event: TouchEvent, state: PinchZoomState) => void
	onPinchMove?: (event: TouchEvent, state: PinchZoomState) => void
	onPinchEnd?: (event: TouchEvent, state: PinchZoomState) => void
	// 🆕 Stagger and orchestration event handlers
	onStaggerStart?: (state: StaggerState) => void
	onStaggerComplete?: (state: StaggerState) => void
	onTimelineStart?: (progress: number) => void
	onTimelineUpdate?: (progress: number) => void
	onTimelineComplete?: (progress: number) => void
	// 🆕 Phase 6: Advanced animation event handlers
	onSpringStart?: (config: SpringConfig) => void
	onSpringComplete?: (config: SpringConfig) => void
	onKeyframeStart?: (keyframes: KeyframeConfig) => void
	onKeyframeComplete?: (keyframes: KeyframeConfig) => void
	onVariantStart?: (variant: string, config: AnimationVariant) => void
	onVariantComplete?: (variant: string, config: AnimationVariant) => void
	onGestureAnimationStart?: (gesture: string) => void
	onGestureAnimationEnd?: (gesture: string) => void
}

declare module "@motionone/dom" {
	/*
	 Solid style attribute supports only kebab-case properties.
	 While @motionone/dom supports both camelCase and kebab-case,
	 but provides only camelCase properties in the types.
	*/
	interface CSSStyleDeclarationWithTransform
		extends Omit<PropertiesHyphen, "direction" | "transition"> {}

	/*
	 exit is missing in types in motionone core
	 because it is only used in the Presence implementations
	*/
	interface Options {
		exit?: motionone.VariantDefinition
		// 🆕 Extend Options with drag properties
		drag?: boolean | "x" | "y"
		dragConstraints?: DragConstraints
		dragElastic?: boolean | number
		dragMomentum?: boolean
		dragSnapToOrigin?: boolean
		whileDrag?: motionone.VariantDefinition
		// 🆕 Extend Options with layout properties
		layout?: boolean | "position" | "size"
		layoutId?: string
		layoutRoot?: boolean
		layoutScroll?: boolean
		layoutDependency?: any
		// 🆕 Extend Options with scroll properties
		scroll?: boolean
		scrollContainer?: Element | Window
		scrollOffset?: number | [number, number]
		scrollOnce?: boolean
		scrollAmount?: "some" | "all" | number
		parallax?: boolean | number
		parallaxSpeed?: number
		parallaxOffset?: number
		// 🆕 Extend Options with advanced gesture properties
		multiTouch?: boolean | MultiTouchOptions
		pinchZoom?: boolean | PinchZoomOptions
		minTouches?: number
		maxTouches?: number
		initialScale?: number
		initialRotation?: number
		minScale?: number
		maxScale?: number
		momentum?: boolean
		momentumDecay?: number
		whilePinch?: motionone.VariantDefinition
		// 🆕 Extend Options with stagger and orchestration properties
		stagger?: number | StaggerConfig
		staggerDirection?: "forward" | "reverse" | "from" | "from-center" | "from-start" | "from-end"
		staggerChildren?: boolean | number
		staggerDelay?: number
		staggerDelayChildren?: number
		timeline?: TimelineConfig
		timelineDuration?: number
		timelineEasing?: (t: number) => number
		timelineRepeat?: number | "loop" | "reverse"
		timelineRepeatDelay?: number
		orchestrate?: boolean
		orchestrateDelay?: number
		orchestrateStagger?: number
		orchestrateDirection?: "forward" | "reverse" | "from" | "from-center"
		orchestrateFrom?: number
		orchestrateTo?: number
		// 🆕 Phase 6: Advanced animation properties
		spring?: SpringConfig
		springStiffness?: number
		springDamping?: number
		springMass?: number
		springRestDelta?: number
		springRestSpeed?: number
		keyframes?: KeyframeConfig
		keyframeEasing?: string | ((t: number) => number)
		keyframeOffset?: number
		whileHover?: motionone.VariantDefinition
		whileTap?: motionone.VariantDefinition
		whileFocus?: motionone.VariantDefinition
		custom?: any
		gestureAnimation?: GestureAnimationOptions
		gestureVariants?: Record<string, motionone.VariantDefinition>
		onSpringStart?: () => void
		onSpringComplete?: () => void
		onKeyframeStart?: () => void
		onKeyframeComplete?: () => void
		onVariantStart?: () => void
		onVariantComplete?: () => void
		onGestureAnimationStart?: () => void
		onGestureAnimationEnd?: () => void
		// 🆕 Phase 7: Advanced Features
		debug?: boolean
		debugOptions?: DebugOptions
		pauseOnFocus?: boolean
		resumeOnBlur?: boolean
		pauseOnHover?: boolean
		respectReducedMotion?: boolean
		reducedMotionAnimation?: motionone.VariantDefinition
		manualPause?: boolean
		manualResume?: boolean
		preset?: string | AnimationPreset
		presetOptions?: PresetOptions
		sequence?: AnimationSequence[]
		sequenceOptions?: SequenceOptions
		// 🆕 Phase 8: Enhanced Gestures
		gestureRecognition?: GestureRecognitionOptions
		advancedOrchestration?: AdvancedOrchestrationOptions
		// 🆕 Phase 9: Integration & Polish
		routerIntegration?: RouterIntegrationOptions
		formIntegration?: FormIntegrationOptions
		animationInspector?: AnimationInspectorOptions
		// 🆕 Phase 10: Advanced Features
		canvas?: boolean
		canvasWidth?: number
		canvasHeight?: number
		canvasContext?: '2d' | 'webgl' | 'webgl2'
		canvasPixelRatio?: number
		canvasAntialias?: boolean
		canvasAlpha?: boolean
		canvasDepth?: boolean
		canvasStencil?: boolean
		canvasPreserveDrawingBuffer?: boolean
		canvasPowerPreference?: 'default' | 'high-performance' | 'low-power'
		canvasFailIfMajorPerformanceCaveat?: boolean
		onCanvasReady?: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext) => void
		onCanvasResize?: (width: number, height: number) => void
		onCanvasRender?: (context: CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext, deltaTime: number) => void
		webgl?: boolean
		webglVersion?: '1.0' | '2.0'
		webglVertexShader?: string
		webglFragmentShader?: string
		webglAttributes?: Record<string, { size: number; type: number; normalized?: boolean; stride?: number; offset?: number }>
		webglUniforms?: Record<string, { type: 'float' | 'int' | 'bool' | 'vec2' | 'vec3' | 'vec4' | 'mat2' | 'mat3' | 'mat4' | 'sampler2D' | 'samplerCube'; value: any }>
		webglTextures?: Record<string, { source: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement; target?: number; level?: number; internalFormat?: number; format?: number; type?: number }>
		webglBlendMode?: 'add' | 'subtract' | 'reverse-subtract' | 'min' | 'max'
		webglDepthTest?: boolean
		webglCullFace?: 'front' | 'back' | 'front-and-back'
		webglFrontFace?: 'cw' | 'ccw'
		onWebGLReady?: (gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram) => void
		onWebGLRender?: (gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram, deltaTime: number) => void
		shader?: boolean
		shaderType?: 'vertex' | 'fragment' | 'compute'
		shaderSource?: string
		shaderPrecision?: 'lowp' | 'mediump' | 'highp'
		shaderExtensions?: string[]
		shaderUniforms?: Record<string, ShaderUniform>
		shaderAttributes?: Record<string, ShaderAttribute>
		shaderVaryings?: Record<string, ShaderVarying>
		onShaderCompile?: (shader: WebGLShader, success: boolean) => void
		onShaderLink?: (program: WebGLProgram, success: boolean) => void
		threeD?: boolean
		threeDPerspective?: number
		threeDRotateX?: number
		threeDRotateY?: number
		threeDRotateZ?: number
		threeDTranslateX?: number
		threeDTranslateY?: number
		threeDTranslateZ?: number
		threeDScaleX?: number
		threeDScaleY?: number
		threeDScaleZ?: number
		threeDMatrix?: number[]
		threeDMatrixAuto?: boolean
		onThreeDUpdate?: (matrix: number[]) => void
		particles?: boolean
		particleCount?: number
		particleSize?: number | { min: number; max: number }
		particleColor?: string | string[] | { r: number; g: number; b: number; a: number }
		particleVelocity?: { x: number; y: number; z: number } | { min: { x: number; y: number; z: number }; max: { x: number; y: number; z: number } }
		particleLife?: number | { min: number; max: number }
		particleGravity?: { x: number; y: number; z: number }
		particleEmission?: 'continuous' | 'burst' | 'explosion'
		particleEmissionRate?: number
		particleEmissionBurst?: number
		onParticleCreate?: (particle: Particle) => void
		onParticleUpdate?: (particle: Particle, deltaTime: number) => void
		onParticleDestroy?: (particle: Particle) => void
	}
}

// Phase 7: Advanced Features - Debugger System
export interface DebugOptions {
	showTimeline?: boolean
	showValues?: boolean
	showPerformance?: boolean
	logLevel?: 'debug' | 'info' | 'warn' | 'error'
	enableConsole?: boolean
	enablePanel?: boolean
	panelPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export interface DebugState {
	isEnabled: boolean
	element: HTMLElement | null
	animationValues: Record<string, any>
	performanceMetrics: PerformanceMetrics
	timeline: TimelineEntry[]
	isPaused: boolean
}

export interface PerformanceMetrics {
	fps: number
	memoryUsage: number
	animationCount: number
	lastUpdateTime: number
}

export interface TimelineEntry {
	id: string
	timestamp: number
	type: 'start' | 'update' | 'complete' | 'pause' | 'resume'
	property?: string
	value?: any
	duration?: number
}

export interface DebugEvent {
	type: 'animation-start' | 'animation-update' | 'animation-complete' | 'performance-update'
	element: HTMLElement
	data: any
	timestamp: number
}

// Phase 7: Advanced Features - Accessibility System
export interface AccessibilityOptions {
	pauseOnFocus?: boolean
	resumeOnBlur?: boolean
	pauseOnHover?: boolean
	respectReducedMotion?: boolean
	reducedMotionAnimation?: motionone.VariantDefinition
	manualPause?: boolean
	manualResume?: boolean
}

export interface AccessibilityState {
	isPaused: boolean
	prefersReducedMotion: boolean
	hasFocus: boolean
	isHovering: boolean
}

// Phase 7: Advanced Features - Preset System
export interface AnimationPreset {
	name: string
	initial?: motionone.VariantDefinition
	animate?: motionone.VariantDefinition
	exit?: motionone.VariantDefinition
	transition?: any
	options?: Record<string, any>
}

export interface PresetOptions {
	intensity?: number
	duration?: number
	easing?: string
	delay?: number
	stagger?: number
}

// Phase 7: Advanced Features - Enhanced Orchestration
export interface AnimationSequence {
	animation: motionone.VariantDefinition
	duration?: number
	delay?: number
	easing?: string
}

export interface SequenceOptions {
	sequence?: AnimationSequence[]
	repeat?: number | boolean
	repeatDelay?: number
	repeatType?: 'loop' | 'reverse' | 'mirror'
}

export interface AnimationGroup {
	stagger?: number
	direction?: 'forward' | 'reverse' | 'random'
	children: any
}

export interface GroupOptions {
	stagger?: number
	direction?: 'forward' | 'reverse' | 'random'
	onGroupStart?: () => void
	onGroupComplete?: () => void
}

export interface AdvancedOrchestrationOptions {
	mode?: 'parallel' | 'sequential' | 'stagger'
	children?: AnimationSequence[]
	delay?: number
	duration?: number
	onOrchestrationStart?: () => void
	onOrchestrationComplete?: () => void
}

// 🆕 Extended MotionComponentProps to include all gesture options
export type MotionComponentProps = ParentProps<MotionEventHandlers & motionone.Options & DragOptions & LayoutOptions & ScrollOptions & MultiTouchOptions & PinchZoomOptions & StaggerOptions & TimelineOptions & OrchestrationOptions & SpringOptions & KeyframeOptions & VariantsOptions & AnimationControlOptions & GestureAnimationOptions & DebugOptions & AccessibilityOptions & PresetOptions & SequenceOptions & GroupOptions & AdvancedOrchestrationOptions & GestureRecognitionOptions & RouterIntegrationOptions & FormIntegrationOptions & AnimationInspectorOptions & CanvasOptions & WebGLOptions & ShaderOptions & ThreeDOptions & ParticleOptions>

export type MotionComponent = {
	// <Motion />
	(props: JSX.IntrinsicElements["div"] & MotionComponentProps): JSX.Element
	// <Motion tag="div" />
	<T extends keyof JSX.IntrinsicElements>(
		props: JSX.IntrinsicElements[T] & MotionComponentProps & {tag: T},
	): JSX.Element
}

export type MotionProxyComponent<T> = (props: T & MotionComponentProps) => JSX.Element

export type MotionProxy = MotionComponent & {
	// <Motion.div />
	[K in keyof JSX.IntrinsicElements]: MotionProxyComponent<JSX.IntrinsicElements[K]>
}

declare module "solid-js" {
	namespace JSX {
		interface Directives {
			motion: motionone.Options
		}
	}
}

// export only here so the `JSX` import won't be shaken off the tree:
export type E = JSX.Element

// 🆕 Phase 8: Enhanced Gestures
export interface GesturePattern {
  type: 'swipe' | 'longPress' | 'doubleTap' | 'pinch' | 'rotate' | 'pan'
  direction?: 'up' | 'down' | 'left' | 'right' | 'diagonal'
  threshold?: number
  duration?: number
  distance?: number
  velocity?: number
}

export interface GestureRecognitionOptions {
  patterns: GesturePattern[]
  enableSwipe?: boolean
  enableLongPress?: boolean
  enableDoubleTap?: boolean
  enablePinch?: boolean
  enableRotate?: boolean
  enablePan?: boolean
  swipeThreshold?: number
  longPressDuration?: number
  doubleTapDelay?: number
  pinchThreshold?: number
  rotateThreshold?: number
  panThreshold?: number
  onGestureStart?: (gesture: GesturePattern, event: PointerEvent) => void
  onGestureUpdate?: (gesture: GesturePattern, event: PointerEvent, progress: number) => void
  onGestureEnd?: (gesture: GesturePattern, event: PointerEvent) => void
}

export interface GestureRecognitionState {
  isRecognizing: boolean
  currentGesture: GesturePattern | null
  progress: number
  startTime: number
  startPosition: { x: number; y: number }
  currentPosition: { x: number; y: number }
  velocity: { x: number; y: number }
  distance: number
  angle: number
  scale: number
  rotation: number
}

export interface AdvancedOrchestrationOptions {
  // Gesture-based orchestration
  gestureOrchestration?: boolean
  gestureSequences?: Record<string, AnimationSequence[]>
  gesturePresets?: Record<string, AnimationPreset>
  
  // Advanced coordination
  coordinationGroups?: string[]
  crossElementOrchestration?: boolean
  elementDependencies?: Record<string, string[]>
  
  // Performance optimization
  lazyLoading?: boolean
  animationPooling?: boolean
  memoryOptimization?: boolean
  
  // Advanced timing
  adaptiveTiming?: boolean
  performanceBasedAdjustment?: boolean
  frameRateOptimization?: boolean
}

export interface GestureOrchestrationController {
  registerGesture(element: HTMLElement, options: GestureRecognitionOptions): void
  unregisterGesture(element: HTMLElement): void
  triggerGesture(element: HTMLElement, gesture: GesturePattern): void
  getGestureState(element: HTMLElement): GestureRecognitionState | null
  coordinateGestures(elements: HTMLElement[], coordinationType: 'parallel' | 'sequential' | 'dependent'): void
}

// 🆕 Phase 9: Integration & Polish
export interface RouterIntegrationOptions {
  // Route transition animations
  routeTransition?: boolean
  routeTransitionDuration?: number
  routeTransitionEasing?: string
  routeTransitionDirection?: 'left' | 'right' | 'up' | 'down' | 'fade'
  
  // Route-specific animations
  routeEnterAnimation?: motionone.VariantDefinition
  routeExitAnimation?: motionone.VariantDefinition
  routeSharedElements?: string[]
  
  // Router event handlers
  onRouteEnter?: (route: string, element: HTMLElement) => void
  onRouteExit?: (route: string, element: HTMLElement) => void
  onRouteTransitionStart?: (from: string, to: string) => void
  onRouteTransitionComplete?: (from: string, to: string) => void
}

export interface FormIntegrationOptions {
  // Form validation animations
  formValidation?: boolean
  validationAnimation?: motionone.VariantDefinition
  errorAnimation?: motionone.VariantDefinition
  successAnimation?: motionone.VariantDefinition
  
  // Form field animations
  fieldFocusAnimation?: motionone.VariantDefinition
  fieldBlurAnimation?: motionone.VariantDefinition
  fieldErrorAnimation?: motionone.VariantDefinition
  fieldSuccessAnimation?: motionone.VariantDefinition
  
  // Form submission animations
  submitAnimation?: motionone.VariantDefinition
  loadingAnimation?: motionone.VariantDefinition
  
  // Form event handlers
  onFieldFocus?: (field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => void
  onFieldBlur?: (field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => void
  onFieldError?: (field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, error: string) => void
  onFieldSuccess?: (field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => void
  onFormSubmit?: (form: HTMLFormElement) => void
  onFormValidation?: (form: HTMLFormElement, isValid: boolean) => void
}

export interface AnimationInspectorOptions {
  // Inspector panel options
  inspectorEnabled?: boolean
  inspectorPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  inspectorSize?: 'small' | 'medium' | 'large'
  
  // Inspector features
  showAnimationTree?: boolean
  showPerformanceMetrics?: boolean
  showTimeline?: boolean
  showProperties?: boolean
  
  // Inspector event handlers
  onInspectorOpen?: () => void
  onInspectorClose?: () => void
  onAnimationSelect?: (animation: any) => void
  onPropertyChange?: (property: string, value: any) => void
}

export interface IntegrationState {
  // Router state
  currentRoute: string | null
  previousRoute: string | null
  isTransitioning: boolean
  
  // Form state
  activeForm: HTMLFormElement | null
  focusedField: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
  formErrors: Record<string, string>
  formIsValid: boolean
  
  // Inspector state
  inspectorOpen: boolean
  selectedAnimation: any | null
  inspectorMetrics: {
    fps: number
    memoryUsage: number
    activeAnimations: number
    totalElements: number
  }
}

// 🆕 Phase 10: Advanced Features - Canvas Integration
export interface CanvasOptions {
	canvas?: boolean
	canvasWidth?: number
	canvasHeight?: number
	canvasContext?: '2d' | 'webgl' | 'webgl2'
	canvasPixelRatio?: number
	canvasAntialias?: boolean
	canvasAlpha?: boolean
	canvasDepth?: boolean
	canvasStencil?: boolean
	canvasPreserveDrawingBuffer?: boolean
	canvasPowerPreference?: 'default' | 'high-performance' | 'low-power'
	canvasFailIfMajorPerformanceCaveat?: boolean
	onCanvasReady?: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext) => void
	onCanvasResize?: (width: number, height: number) => void
	onCanvasRender?: (context: CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext, deltaTime: number) => void
}

export interface CanvasState {
	canvas: HTMLCanvasElement | null
	context: CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext | null
	width: number
	height: number
	pixelRatio: number
	isRendering: boolean
	frameCount: number
	lastFrameTime: number
}

// 🆕 Phase 10: Advanced Features - WebGL Support
export interface WebGLOptions {
	webgl?: boolean
	webglVersion?: '1.0' | '2.0'
	webglVertexShader?: string
	webglFragmentShader?: string
	webglAttributes?: Record<string, { size: number; type: number; normalized?: boolean; stride?: number; offset?: number }>
	webglUniforms?: Record<string, { type: 'float' | 'int' | 'bool' | 'vec2' | 'vec3' | 'vec4' | 'mat2' | 'mat3' | 'mat4'; value: any }>
	webglTextures?: Record<string, { source: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement; target?: number; level?: number; internalFormat?: number; format?: number; type?: number }>
	webglBlendMode?: 'add' | 'subtract' | 'reverse-subtract' | 'min' | 'max'
	webglDepthTest?: boolean
	webglCullFace?: 'front' | 'back' | 'front-and-back'
	webglFrontFace?: 'cw' | 'ccw'
	onWebGLReady?: (gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram) => void
	onWebGLRender?: (gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram, deltaTime: number) => void
}

export interface WebGLState {
	gl: WebGLRenderingContext | WebGL2RenderingContext | null
	program: WebGLProgram | null
	attributes: Record<string, number>
	uniforms: Record<string, WebGLUniformLocation | null>
	textures: Record<string, WebGLTexture | null>
	buffers: Record<string, WebGLBuffer | null>
	vao: WebGLVertexArrayObject | null
	isInitialized: boolean
}

// 🆕 Phase 10: Advanced Features - Shader System
export interface ShaderOptions {
	shader?: boolean
	shaderType?: 'vertex' | 'fragment' | 'compute'
	shaderSource?: string
	shaderPrecision?: 'lowp' | 'mediump' | 'highp'
	shaderExtensions?: string[]
	shaderUniforms?: Record<string, ShaderUniform>
	shaderAttributes?: Record<string, ShaderAttribute>
	shaderVaryings?: Record<string, ShaderVarying>
	onShaderCompile?: (shader: WebGLShader, success: boolean) => void
	onShaderLink?: (program: WebGLProgram, success: boolean) => void
}

export interface ShaderUniform {
	type: 'float' | 'int' | 'bool' | 'vec2' | 'vec3' | 'vec4' | 'mat2' | 'mat3' | 'mat4' | 'sampler2D' | 'samplerCube'
	value: number | number[] | boolean
	location?: WebGLUniformLocation
}

export interface ShaderAttribute {
	type: 'float' | 'vec2' | 'vec3' | 'vec4'
	size: number
	normalized?: boolean
	stride?: number
	offset?: number
	buffer?: WebGLBuffer
	location?: number
}

export interface ShaderVarying {
	type: 'float' | 'vec2' | 'vec3' | 'vec4'
	interpolation?: 'smooth' | 'flat' | 'noperspective'
}

// 🆕 Phase 10: Advanced Features - 3D Animation Support
export interface ThreeDOptions {
	threeD?: boolean
	threeDPerspective?: number
	threeDRotateX?: number
	threeDRotateY?: number
	threeDRotateZ?: number
	threeDTranslateX?: number
	threeDTranslateY?: number
	threeDTranslateZ?: number
	threeDScaleX?: number
	threeDScaleY?: number
	threeDScaleZ?: number
	threeDMatrix?: number[]
	threeDMatrixAuto?: boolean
	onThreeDUpdate?: (matrix: number[]) => void
}

export interface ThreeDState {
	matrix: number[]
	perspective: number
	rotation: { x: number; y: number; z: number }
	translation: { x: number; y: number; z: number }
	scale: { x: number; y: number; z: number }
	isDirty: boolean
}

// 🆕 Phase 10: Advanced Features - Particle System
export interface ParticleOptions {
	particles?: boolean
	particleCount?: number
	particleSize?: number | { min: number; max: number }
	particleColor?: string | string[] | { r: number; g: number; b: number; a: number }
	particleVelocity?: { x: number; y: number; z: number } | { min: { x: number; y: number; z: number }; max: { x: number; y: number; z: number } }
	particleLife?: number | { min: number; max: number }
	particleGravity?: { x: number; y: number; z: number }
	particleEmission?: 'continuous' | 'burst' | 'explosion'
	particleEmissionRate?: number
	particleEmissionBurst?: number
	onParticleCreate?: (particle: Particle) => void
	onParticleUpdate?: (particle: Particle, deltaTime: number) => void
	onParticleDestroy?: (particle: Particle) => void
}

export interface Particle {
	id: number
	position: { x: number; y: number; z: number }
	velocity: { x: number; y: number; z: number }
	acceleration: { x: number; y: number; z: number }
	size: number
	color: { r: number; g: number; b: number; a: number }
	life: number
	maxLife: number
	age: number
	active: boolean
}

export interface ParticleState {
	particles: Particle[]
	emitter: { x: number; y: number; z: number }
	emissionRate: number
	emissionBurst: number
	emissionType: 'continuous' | 'burst' | 'explosion'
	gravity: { x: number; y: number; z: number }
	isEmitting: boolean
	particleCount: number
	maxParticles: number
}
