import type { AnimationVariant, GestureAnimationOptions } from "../types.js"
import type { GestureState } from "../types.js"

// Gesture animation mapping
export interface GestureAnimationMapping {
	[gesture: string]: {
		animation: AnimationVariant
		trigger?: "start" | "end" | "move" | "hover" | "press"
		conditions?: (state: GestureState) => boolean
	}
}

// Gesture animation controller
export class GestureAnimationController {
	private mappings: GestureAnimationMapping = {}
	private currentAnimations: Map<string, AnimationVariant> = new Map()
	private onGestureStart?: (gesture: string) => void
	private onGestureEnd?: (gesture: string) => void

	constructor(mappings?: GestureAnimationMapping) {
		if (mappings) {
			this.setMappings(mappings)
		}
	}

	setMappings(mappings: GestureAnimationMapping) {
		this.mappings = { ...mappings }
	}

	addMapping(gesture: string, mapping: {
		animation: AnimationVariant
		trigger?: "start" | "end" | "move" | "hover" | "press"
		conditions?: (state: GestureState) => boolean
	}) {
		this.mappings[gesture] = mapping
	}

	removeMapping(gesture: string) {
		delete this.mappings[gesture]
	}

	// Handle gesture state changes
	handleGestureState(gesture: string, state: GestureState, trigger: "start" | "end" | "move" | "hover" | "press") {
		const mapping = this.mappings[gesture]
		if (!mapping) return

		// Check if trigger matches
		if (mapping.trigger && mapping.trigger !== trigger) return

		// Check conditions
		if (mapping.conditions && !mapping.conditions(state)) return

		// Apply animation
		if (trigger === "start") {
			this.startGestureAnimation(gesture, mapping.animation)
		} else if (trigger === "end") {
			this.endGestureAnimation(gesture)
		} else if (trigger === "move") {
			this.updateGestureAnimation(gesture, mapping.animation, state)
		}
	}

	private startGestureAnimation(gesture: string, animation: AnimationVariant) {
		this.currentAnimations.set(gesture, animation)
		this.onGestureStart?.(gesture)
	}

	private endGestureAnimation(gesture: string) {
		this.currentAnimations.delete(gesture)
		this.onGestureEnd?.(gesture)
	}

	private updateGestureAnimation(gesture: string, animation: AnimationVariant, state: GestureState) {
		// Update animation based on gesture state
		const updatedAnimation = this.interpolateAnimation(animation, state)
		this.currentAnimations.set(gesture, updatedAnimation)
	}

	private interpolateAnimation(animation: AnimationVariant, state: GestureState): AnimationVariant {
		// Interpolate animation values based on gesture state
		const interpolated: AnimationVariant = {}

		for (const [key, value] of Object.entries(animation)) {
			if (typeof value === "number") {
				// Interpolate numeric values based on gesture progress
				let progress = 0

				if (state.isDragging && state.panInfo) {
					progress = Math.min(Math.abs(state.panInfo.offset.x) / 100, 1)
				} else if (state.isPinching && state.pinchZoomInfo) {
					progress = Math.abs(state.pinchZoomInfo.scale - 1)
				} else if (state.isHovering) {
					progress = 1
				}

				interpolated[key] = value * progress
			} else {
				interpolated[key] = value
			}
		}

		return interpolated
	}

	getCurrentAnimations(): Map<string, AnimationVariant> {
		return new Map(this.currentAnimations)
	}

	setOnGestureStart(callback: (gesture: string) => void) {
		this.onGestureStart = callback
	}

	setOnGestureEnd(callback: (gesture: string) => void) {
		this.onGestureEnd = callback
	}

	clear() {
		this.currentAnimations.clear()
	}
}

// Complex gesture sequence system
export class GestureSequenceController {
	private sequences: Map<string, {
		steps: Array<{
			gesture: string
			animation: AnimationVariant
			duration?: number
			conditions?: (state: GestureState) => boolean
		}>
		currentStep: number
		isActive: boolean
	}> = new Map()

	private onSequenceStart?: (sequenceId: string) => void
	private onSequenceComplete?: (sequenceId: string) => void
	private onSequenceStep?: (sequenceId: string, step: number) => void

	constructor() {}

	addSequence(
		sequenceId: string,
		steps: Array<{
			gesture: string
			animation: AnimationVariant
			duration?: number
			conditions?: (state: GestureState) => boolean
		}>
	) {
		this.sequences.set(sequenceId, {
			steps,
			currentStep: 0,
			isActive: false,
		})
	}

	removeSequence(sequenceId: string) {
		this.sequences.delete(sequenceId)
	}

	startSequence(sequenceId: string) {
		const sequence = this.sequences.get(sequenceId)
		if (sequence && !sequence.isActive) {
			sequence.isActive = true
			sequence.currentStep = 0
			this.onSequenceStart?.(sequenceId)
			this.executeStep(sequenceId)
		}
	}

	private executeStep(sequenceId: string) {
		const sequence = this.sequences.get(sequenceId)
		if (!sequence || !sequence.isActive) return

		const step = sequence.steps[sequence.currentStep]
		if (!step) {
			// Sequence complete
			sequence.isActive = false
			this.onSequenceComplete?.(sequenceId)
			return
		}

		this.onSequenceStep?.(sequenceId, sequence.currentStep)

		// Execute step animation
		// This would integrate with the main animation system

		// Move to next step
		sequence.currentStep++

		// Schedule next step
		if (step.duration) {
			setTimeout(() => {
				this.executeStep(sequenceId)
			}, step.duration)
		} else {
			this.executeStep(sequenceId)
		}
	}

	handleGestureState(gesture: string, state: GestureState) {
		// Check if gesture matches any active sequence step
		for (const [sequenceId, sequence] of this.sequences) {
			if (sequence.isActive) {
				const currentStep = sequence.steps[sequence.currentStep]
				if (currentStep && currentStep.gesture === gesture) {
					if (!currentStep.conditions || currentStep.conditions(state)) {
						// Step condition met, continue sequence
						this.executeStep(sequenceId)
					}
				}
			}
		}
	}

	setOnSequenceStart(callback: (sequenceId: string) => void) {
		this.onSequenceStart = callback
	}

	setOnSequenceComplete(callback: (sequenceId: string) => void) {
		this.onSequenceComplete = callback
	}

	setOnSequenceStep(callback: (sequenceId: string, step: number) => void) {
		this.onSequenceStep = callback
	}

	stopSequence(sequenceId: string) {
		const sequence = this.sequences.get(sequenceId)
		if (sequence) {
			sequence.isActive = false
		}
	}

	stopAllSequences() {
		for (const sequence of this.sequences.values()) {
			sequence.isActive = false
		}
	}
}

// Gesture animation presets
export const gestureAnimationPresets = {
	drag: {
		start: { scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" },
		move: { x: 0, y: 0 }, // Will be interpolated
		end: { scale: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
	},
	pinch: {
		start: { scale: 1, opacity: 0.8 },
		move: { scale: 1, rotation: 0 }, // Will be interpolated
		end: { scale: 1, opacity: 1 },
	},
	hover: {
		start: { scale: 1.05, y: -5 },
		end: { scale: 1, y: 0 },
	},
	press: {
		start: { scale: 0.95 },
		end: { scale: 1 },
	},
	swipe: {
		start: { x: 0, opacity: 1 },
		move: { x: 0, opacity: 0.8 },
		end: { x: 0, opacity: 1 },
	},
}

// Create gesture animation controller with presets
export function createGestureAnimationController(
	presets: GestureAnimationMapping = {}
): GestureAnimationController {
	const controller = new GestureAnimationController()

	// Add common presets
	for (const [gesture, animations] of Object.entries(gestureAnimationPresets)) {
		for (const [trigger, animation] of Object.entries(animations)) {
			controller.addMapping(`${gesture}_${trigger}`, {
				animation,
				trigger: trigger as "start" | "end" | "move" | "hover" | "press",
			})
		}
	}

	// Add custom presets
	for (const [gesture, mapping] of Object.entries(presets)) {
		controller.addMapping(gesture, mapping)
	}

	return controller
}

// Create gesture sequence controller
export function createGestureSequenceController(): GestureSequenceController {
	return new GestureSequenceController()
}

// Utility function to create gesture animations from state
export function createGestureAnimationFromState(
	state: GestureState,
	baseAnimation: AnimationVariant
): AnimationVariant {
	const animation: AnimationVariant = { ...baseAnimation }

	// Interpolate based on gesture state
	if (state.isDragging && state.panInfo) {
		const progress = Math.min(Math.abs(state.panInfo.offset.x) / 100, 1)
		for (const [key, value] of Object.entries(animation)) {
			if (typeof value === "number") {
				animation[key] = value * progress
			}
		}
	}

	if (state.isPinching && state.pinchZoomInfo) {
		const scale = state.pinchZoomInfo.scale
		const rotation = state.pinchZoomInfo.rotation

		if (animation['scale'] !== undefined) {
			animation['scale'] = scale
		}
		if (animation['rotate'] !== undefined) {
			animation['rotate'] = rotation
		}
	}

	return animation
}
