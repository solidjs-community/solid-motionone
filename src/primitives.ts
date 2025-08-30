import {createMotionState, createStyles, MotionState, style} from "@motionone/dom"
import {Accessor, createEffect, onCleanup, useContext} from "solid-js"

import {PresenceContext, PresenceContextState} from "./presence.jsx"
import {Options, MultiTouchOptions, PinchZoomOptions, StaggerOptions, TimelineOptions, OrchestrationOptions, SpringOptions, KeyframeOptions, VariantsOptions, AnimationControlOptions, GestureAnimationOptions} from "./types.js"
import {createDragControls} from "./gestures/drag.js"
import {createLayoutEffect, createSharedLayoutEffect} from "./layout/index.js"
import {createScrollPosition, createParallaxEffect} from "./scroll/index.js"
import {createAdvancedGestures} from "./gestures/advanced.js"
import {createOrchestrationController, createStaggeredList, createTimelineSequence} from "./orchestration/index.js"
import {createAdvancedAnimationController} from "./animations/advanced-controller.js"
import { getGlobalDebugger, enableDebugging } from "./debug/debugger.js"
import { createAccessibilityEffect } from "./accessibility/pause-resume.js"
import { getPreset, applyPresetOptions } from "./presets/basic.js"
import { createAnimationSequence } from "./orchestration/sequences.js"
import { createGestureEffect } from "./gestures/recognition.js"
import { createAdvancedOrchestrationEffect } from "./orchestration/advanced.js"
import { createRouterIntegrationEffect } from "./integration/router.js"
import { createFormIntegrationEffect } from "./integration/form.js"
import { createAnimationInspectorEffect } from "./integration/inspector.js"
import { createCanvasEffect, createWebGLEffect, createParticleEffect } from "./canvas/index.js"

/** @internal */
export function createAndBindMotionState(
	el: () => Element,
	options: Accessor<Options>,
	presence_state?: PresenceContextState,
	parent_state?: MotionState,
): [MotionState, ReturnType<typeof createStyles>] {
	const state = createMotionState(
		presence_state?.initial === false ? {...options(), initial: false} : options(),
		parent_state,
	)

	// 🆕 Create drag controls if drag options are present
	createEffect(() => {
		const opts = options()
		if (opts.drag) {
			const controls = createDragControls(el, options)
			controls.start()
			
			// Cleanup drag controls when component unmounts or drag is disabled
			onCleanup(() => {
				controls.stop()
			})
		}
	})

	// 🆕 Create layout effect if layout options are present
	createEffect(() => {
		const opts = options()
		if (opts.layout || opts.layoutId) {
			if (opts.layoutId) {
				// Use shared layout effect for layoutId
				createSharedLayoutEffect(el, options)
			} else {
				// Use regular layout effect
				createLayoutEffect(el, options)
			}
		}
	})

	// 🆕 Create scroll effects if scroll options are present
	createEffect(() => {
		const opts = options()
		if (opts.scroll || opts.parallax) {
			// Create scroll position tracking
			const scrollPosition = createScrollPosition(
				() => opts.scrollContainer || window,
				() => opts as any
			)

			// Create parallax effect if specified
			if (opts.parallax) {
				createParallaxEffect(el, scrollPosition, () => opts as any)
			}
		}
	})

	// 🆕 Create advanced gesture effects if gesture options are present
	createEffect(() => {
		const opts = options()
		if (opts.multiTouch || opts.pinchZoom) {
			// Create advanced gestures
			const gestureControls = createAdvancedGestures(el, options)
			
			// Cleanup gesture controls when component unmounts
			onCleanup(() => {
				gestureControls.reset()
			})
		}
	})

	// 🆕 Create orchestration effects if orchestration options are present
	createEffect(() => {
		const opts = options()
		if (opts.stagger || opts.timeline || opts.orchestrate) {
			// Create orchestration controller
			const orchestrationControls = createOrchestrationController(
				() => [el()],
				() => opts as StaggerOptions,
				() => opts as TimelineOptions,
				() => opts as OrchestrationOptions
			)
			
			// Cleanup orchestration controls when component unmounts
			onCleanup(() => {
				orchestrationControls.reset()
			})
		}
	})

	// 🆕 Create advanced animation effects if advanced animation options are present
	createEffect(() => {
		const opts = options() as any // Cast to include Phase 6 properties
		if (opts.spring || opts.keyframes || opts.variants || opts.gestureAnimation) {
			// Create advanced animation controller
			const advancedAnimationControls = createAdvancedAnimationController({
				spring: opts.spring ? (typeof opts.spring === "boolean" ? {} : opts.spring) : undefined,
				keyframes: opts.keyframes,
				variants: opts.variants,
				gestureAnimations: opts.gestureAnimation ? {
					gestureAnimation: opts.gestureAnimation,
					gestureVariants: opts.gestureVariants,
				} : undefined,
			})
			
			// Set up event handlers
			if (opts.onSpringStart || opts.onKeyframeStart || opts.onVariantStart || opts.onGestureAnimationStart) {
				advancedAnimationControls.setOnUpdate((state) => {
					if (opts.onSpringStart && state.spring.isActive) {
						opts.onSpringStart(opts.spring as any)
					}
					
					if (opts.onKeyframeStart && state.keyframes.isActive) {
						opts.onKeyframeStart(opts.keyframes as any)
					}
					
					if (opts.onVariantStart && state.variants.currentVariant) {
						opts.onVariantStart(state.variants.currentVariant, opts.variants?.[state.variants.currentVariant] || {})
					}
					
					if (opts.onGestureAnimationStart && state.gestures.activeGestures.length > 0) {
						opts.onGestureAnimationStart(state.gestures.activeGestures[0])
					}
				})
			}
			
			// Cleanup advanced animation controls when component unmounts
			onCleanup(() => {
				advancedAnimationControls.reset()
			})
		}
	})

	// 🆕 Phase 7: Advanced Features - Debugger System
	createEffect(() => {
		const opts = options() as any
		if (opts.debug) {
			const debuggerInstance = getGlobalDebugger(opts.debugOptions)
			// Debugger is automatically initialized and will track animations
		}
	})

	// 🆕 Phase 7: Advanced Features - Accessibility System
	createEffect(() => {
		const opts = options() as any
		if (opts.pauseOnFocus || opts.resumeOnBlur || opts.pauseOnHover || opts.respectReducedMotion) {
			const accessibilityManager = createAccessibilityEffect(() => el() as HTMLElement, {
				pauseOnFocus: opts.pauseOnFocus,
				resumeOnBlur: opts.resumeOnBlur,
				pauseOnHover: opts.pauseOnHover,
				respectReducedMotion: opts.respectReducedMotion,
				reducedMotionAnimation: opts.reducedMotionAnimation,
				manualPause: opts.manualPause,
				manualResume: opts.manualResume
			})
		}
	})

	// 🆕 Phase 7: Advanced Features - Preset System
	createEffect(() => {
		const opts = options() as any
		if (opts.preset) {
			const preset = typeof opts.preset === 'string' ? getPreset(opts.preset) : opts.preset
			if (preset) {
				const appliedPreset = applyPresetOptions(preset, opts.presetOptions)
				
				// Apply preset values to options
				if (appliedPreset.initial && !opts.initial) {
					opts.initial = appliedPreset.initial
				}
				if (appliedPreset.animate && !opts.animate) {
					opts.animate = appliedPreset.animate
				}
				if (appliedPreset.exit && !opts.exit) {
					opts.exit = appliedPreset.exit
				}
				if (appliedPreset.transition && !opts.transition) {
					opts.transition = appliedPreset.transition
				}
			}
		}
	})

	// 🆕 Phase 7: Advanced Features - Enhanced Orchestration
	createEffect(() => {
		const opts = options() as any
		if (opts.sequence) {
			const sequenceController = createAnimationSequence(opts.sequence, opts.sequenceOptions)
			// Sequence controller is ready to be used
		}
	})

	// 🆕 Phase 8: Enhanced Gestures - Gesture Recognition
	createEffect(() => {
		const opts = options() as any
		if (opts.gestureRecognition && opts.gestureRecognition.patterns.length > 0) {
			const gestureRecognizer = createGestureEffect(() => el() as HTMLElement, opts.gestureRecognition)
			// Gesture recognizer is ready to be used
		}
	})

	// 🆕 Phase 8: Enhanced Gestures - Advanced Orchestration
	createEffect(() => {
		const opts = options() as any
		if (opts.advancedOrchestration) {
			const orchestrationController = createAdvancedOrchestrationEffect(() => el() as HTMLElement, opts.advancedOrchestration)
			// Advanced orchestration controller is ready to be used
		}
	})

	// 🆕 Phase 9: Integration & Polish - Router Integration
	createEffect(() => {
		const opts = options() as any
		if (opts.routerIntegration && opts.routerIntegration.routeTransition) {
			const route = window.location.pathname
			const routerManager = createRouterIntegrationEffect(() => el() as HTMLElement, route, opts.routerIntegration)
			// Router integration manager is ready to be used
		}
	})

	// 🆕 Phase 9: Integration & Polish - Form Integration
	createEffect(() => {
		const opts = options() as any
		if (opts.formIntegration && opts.formIntegration.formValidation) {
			const formManager = createFormIntegrationEffect(() => el() as HTMLElement, opts.formIntegration)
			// Form integration manager is ready to be used
		}
	})

	// 🆕 Phase 9: Integration & Polish - Animation Inspector
	createEffect(() => {
		const opts = options() as any
		if (opts.animationInspector && opts.animationInspector.inspectorEnabled) {
			const inspector = createAnimationInspectorEffect(() => el() as HTMLElement, opts.animationInspector)
			// Animation inspector is ready to be used
		}
	})

	// 🆕 Phase 10: Advanced Features - Canvas Integration
	createEffect(() => {
		const opts = options() as any
		if (opts.canvas) {
			const canvas = createCanvasEffect(() => el() as HTMLElement, opts)
			// Canvas integration is ready to be used
		}
	})

	// 🆕 Phase 10: Advanced Features - WebGL Integration
	createEffect(() => {
		const opts = options() as any
		if (opts.webgl) {
			const canvas = el() as HTMLCanvasElement
			const webgl = createWebGLEffect(() => canvas, opts)
			// WebGL integration is ready to be used
		}
	})

	// 🆕 Phase 10: Advanced Features - 3D Animation
	// createEffect(() => {
	// 	const opts = options() as any
	// 	if (opts.threeD) {
	// 		const threeD = createThreeDEffect(() => el() as HTMLElement, opts)
	// 		// 3D animation is ready to be used
	// 	}
	// })

	// 🆕 Phase 10: Advanced Features - Particle System
	createEffect(() => {
		const opts = options() as any
		if (opts.particles) {
			const particles = createParticleEffect(() => el() as HTMLElement, opts)
			// Particle system is ready to be used
		}
	})

	createEffect(() => {
		/*
		Motion components under <Presence exitBeforeEnter> should wait before animating in
		this is done with additional signal, because effects will still run immediately
		*/
		if (presence_state && !presence_state.mount()) return

		const el_ref = el(),
			unmount = state.mount(el_ref)

		createEffect(() => state.update(options()))

		onCleanup(() => {
			if (presence_state && options().exit) {
				state.setActive("exit", true)
				el_ref.addEventListener("motioncomplete", unmount)
			} else unmount()
		})
	})

	return [state, createStyles(state.getTarget())] as const
}

/**
 * createMotion provides MotionOne as a compact Solid primitive.
 *
 * @param target Target Element to animate.
 * @param options Options to effect the animation.
 * @param presenceState Optional PresenceContext override, defaults to current parent.
 * @returns Object to access MotionState
 */
export function createMotion(
	target: Element,
	options: Accessor<Options> | Options,
	presenceState?: PresenceContextState,
): MotionState {
	const [state, styles] = createAndBindMotionState(
		() => target,
		typeof options === "function" ? options : () => options,
		presenceState,
	)

	for (const key in styles) {
		style.set(target, key, styles[key])
	}

	return state
}

/**
 * motion is a Solid directive that makes binding to elements easier.
 *
 * @param el Target Element to bind to.
 * @param props Options to effect the animation.
 */
export function motion(el: Element, props: Accessor<Options>): void {
	createMotion(el, props, useContext(PresenceContext))
}
