import type { 
	SpringConfig, 
	KeyframeConfig, 
	AnimationVariant, 
	AnimationControls,
	GestureAnimationOptions 
} from "../types.js"
import type { GestureState } from "../types.js"

import { SpringAnimationController, createSpringConfig } from "./spring.js"
import { KeyframeAnimationController, createKeyframeAnimation } from "./keyframes.js"
import { VariantController, createVariantController } from "./variants.js"
import { GestureAnimationController, createGestureAnimationController } from "./gesture-animations.js"

// Advanced animation state
export interface AdvancedAnimationState {
	spring: { isActive: boolean; values: { [key: string]: number } }
	keyframes: { isActive: boolean; progress: number }
	variants: { currentVariant: string | null; isAnimating: boolean }
	gestures: { activeGestures: string[]; animations: Map<string, AnimationVariant> }
}

// Advanced animation controller
export class AdvancedAnimationController {
	private springController: SpringAnimationController
	private keyframeController: KeyframeAnimationController | null = null
	private variantController: VariantController
	private gestureController: GestureAnimationController

	private isRunning = false
	onUpdate?: (state: AdvancedAnimationState) => void
	onComplete?: () => void

	constructor(options: {
		spring?: SpringConfig
		keyframes?: KeyframeConfig
		variants?: Record<string, AnimationVariant>
		gestureAnimations?: GestureAnimationOptions
	} = {}) {
		this.springController = new SpringAnimationController(options.spring)
		this.variantController = createVariantController(options.variants)
		this.gestureController = createGestureAnimationController()

		if (options.keyframes) {
			this.keyframeController = createKeyframeAnimation(options.keyframes)
		}
	}

	// Spring animations
	animateSpring(
		from: { [key: string]: number },
		to: { [key: string]: number },
		onUpdate?: (values: { [key: string]: number }) => void,
		onComplete?: () => void
	) {
		this.springController.animate(from, to, onUpdate, onComplete)
	}

	setSpringConfig(config: SpringConfig) {
		this.springController = new SpringAnimationController(config)
	}

	// Keyframe animations
	setKeyframes(keyframes: KeyframeConfig) {
		this.keyframeController = createKeyframeAnimation(keyframes)
	}

	animateKeyframes(
		onUpdate?: (values: { [key: string]: number | string }) => void,
		onComplete?: () => void
	) {
		if (this.keyframeController) {
			this.keyframeController.animate(onUpdate, onComplete)
		}
	}

	// Variant animations
	setVariants(variants: Record<string, AnimationVariant>) {
		this.variantController.setVariants(variants)
	}

	setVariant(variant: string) {
		return this.variantController.setVariant(variant)
	}

	getCurrentVariant(): string | null {
		return this.variantController.getCurrentVariant()
	}

	// Gesture animations
	setGestureAnimations(mappings: any) {
		this.gestureController.setMappings(mappings)
	}

	handleGestureState(gesture: string, state: GestureState, trigger: "start" | "end" | "move" | "hover" | "press") {
		this.gestureController.handleGestureState(gesture, state, trigger)
	}

	// Combined animation orchestration
	orchestrate(animation: {
		spring?: { from: { [key: string]: number }; to: { [key: string]: number } }
		keyframes?: KeyframeConfig
		variant?: string
		gesture?: { gesture: string; state: GestureState; trigger: "start" | "end" | "move" | "hover" | "press" }
		sequence?: "parallel" | "sequential"
	}) {
		const { spring, keyframes, variant, gesture, sequence = "parallel" } = animation

		if (sequence === "parallel") {
			// Run all animations in parallel
			if (spring) {
				this.animateSpring(spring.from, spring.to)
			}

			if (keyframes) {
				this.setKeyframes(keyframes)
				this.animateKeyframes()
			}

			if (variant) {
				this.setVariant(variant)
			}

			if (gesture) {
				this.handleGestureState(gesture.gesture, gesture.state, gesture.trigger)
			}
		} else {
			// Run animations sequentially
			this.runSequentialAnimation(animation)
		}
	}

	private runSequentialAnimation(animation: any) {
		const steps: Array<() => void> = []

		if (animation.spring) {
			steps.push(() => {
				this.animateSpring(animation.spring.from, animation.spring.to, undefined, () => {
					this.executeNextStep(steps, 1)
				})
			})
		}

		if (animation.keyframes) {
			steps.push(() => {
				this.setKeyframes(animation.keyframes)
				this.animateKeyframes(undefined, () => {
					this.executeNextStep(steps, 1)
				})
			})
		}

		if (animation.variant) {
			steps.push(() => {
				this.setVariant(animation.variant)
				this.executeNextStep(steps, 1)
			})
		}

		if (animation.gesture) {
			steps.push(() => {
				this.handleGestureState(animation.gesture.gesture, animation.gesture.state, animation.gesture.trigger)
				this.executeNextStep(steps, 1)
			})
		}

		if (steps.length > 0) {
			this.executeNextStep(steps, 0)
		}
	}

	private executeNextStep(steps: Array<() => void>, index: number) {
		if (index < steps.length) {
			const step = steps[index]
			if (step) {
				step()
			}
		}
	}

	// Animation controls
	play() {
		this.isRunning = true
		// Resume all active animations
	}

	pause() {
		this.isRunning = false
		// Pause all active animations
	}

	stop() {
		this.isRunning = false
		this.springController.stop()
		if (this.keyframeController) {
			this.keyframeController.stop()
		}
		this.gestureController.clear()
	}

	reset() {
		this.isRunning = false
		this.springController.reset()
		if (this.keyframeController) {
			this.keyframeController.reset()
		}
		this.gestureController.clear()
	}

	// State management
	getState(): AdvancedAnimationState {
		return {
			spring: {
				isActive: this.isRunning,
				values: {}, // Would need to implement getCurrentValues
			},
			keyframes: {
				isActive: this.isRunning,
				progress: 0, // Would need to track this
			},
			variants: {
				currentVariant: this.variantController.getCurrentVariant(),
				isAnimating: false, // Would need to track this
			},
			gestures: {
				activeGestures: Array.from(this.gestureController.getCurrentAnimations().keys()),
				animations: this.gestureController.getCurrentAnimations(),
			},
		}
	}

	// Event handlers
	setOnUpdate(callback: (state: AdvancedAnimationState) => void) {
		this.onUpdate = callback
	}

	setOnComplete(callback: () => void) {
		this.onComplete = callback
	}

	// Utility methods
	isActive(): boolean {
		return this.isRunning
	}

	// Create animation controls interface
	createControls(): AnimationControls {
		return {
			start: () => this.play(),
			stop: () => this.stop(),
			pause: () => this.pause(),
			resume: () => this.play(),
			reverse: () => {
				// Implement reverse functionality
			},
			seek: (progress: number) => {
				// Implement seek functionality
			},
			set: (values: any) => {
				// Implement set functionality
			},
		}
	}
}

// Factory functions
export function createAdvancedAnimationController(options?: {
	spring?: SpringConfig
	keyframes?: KeyframeConfig
	variants?: Record<string, AnimationVariant>
	gestureAnimations?: GestureAnimationOptions
}): AdvancedAnimationController {
	return new AdvancedAnimationController(options)
}

// Preset configurations
export const advancedAnimationPresets = {
	// Spring presets
	spring: {
		gentle: { stiffness: 50, damping: 15 },
		bouncy: { stiffness: 200, damping: 8 },
		stiff: { stiffness: 300, damping: 20 },
		slow: { stiffness: 30, damping: 12 },
		fast: { stiffness: 400, damping: 25 },
	},

	// Keyframe presets
	keyframes: {
		bounce: {
			y: [0, -20, 0, -10, 0, -5, 0],
			scale: [1, 1.1, 1, 1.05, 1, 1.02, 1],
		},
		shake: {
			x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0],
		},
		pulse: {
			scale: [1, 1.1, 1, 1.05, 1],
			opacity: [1, 0.8, 1, 0.9, 1],
		},
		slideIn: {
			x: [-100, 0],
			opacity: [0, 1],
		},
		slideOut: {
			x: [0, 100],
			opacity: [1, 0],
		},
	},

	// Variant presets
	variants: {
		hidden: { opacity: 0, scale: 0.8 },
		visible: { opacity: 1, scale: 1 },
		hover: { scale: 1.05, y: -5 },
		tap: { scale: 0.95 },
		focus: { boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" },
	},
}

// Create controller with preset
export function createPresetController(preset: keyof typeof advancedAnimationPresets): AdvancedAnimationController {
	const presets = advancedAnimationPresets[preset]
	
	switch (preset) {
		case "spring":
			return createAdvancedAnimationController({ spring: (presets as any).gentle })
		case "keyframes":
			return createAdvancedAnimationController({ keyframes: (presets as any).bounce })
		case "variants":
			return createAdvancedAnimationController({ variants: presets })
		default:
			return createAdvancedAnimationController()
	}
}
