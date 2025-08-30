import { createSignal, createEffect, onCleanup } from 'solid-js'
import type { AnimationSequence, SequenceOptions } from '../types.js'

/**
 * Animation Sequence Controller
 * Manages complex animation sequences with timing and coordination
 */
export class SequenceController {
	private sequences: AnimationSequence[]
	private options: SequenceOptions
	private currentIndex = 0
	private isPlaying = false
	private isPaused = false
	private repeatCount = 0
	private currentAnimation: any = null

	constructor(sequences: AnimationSequence[], options: SequenceOptions = {}) {
		this.sequences = sequences
		this.options = {
			repeat: false,
			repeatDelay: 0,
			repeatType: 'loop',
			...options
		}
	}

	/**
	 * Play the sequence
	 */
	async play(): Promise<void> {
		if (this.isPlaying) return

		this.isPlaying = true
		this.isPaused = false
		this.currentIndex = 0

		await this.playSequence()
	}

	/**
	 * Play the entire sequence
	 */
	private async playSequence(): Promise<void> {
		while (this.isPlaying && this.currentIndex < this.sequences.length) {
			if (this.isPaused) {
				await this.waitForResume()
			}

			const sequence = this.sequences[this.currentIndex]
			if (sequence) {
				await this.playSequenceItem(sequence)
			}
			this.currentIndex++
		}

		// Handle repeat
		if (this.isPlaying && this.shouldRepeat()) {
			await this.handleRepeat()
		} else {
			this.isPlaying = false
		}
	}

	/**
	 * Play a single sequence item
	 */
	private async playSequenceItem(sequence: AnimationSequence): Promise<void> {
		return new Promise((resolve) => {
			// Apply the animation
			this.currentAnimation = {
				animation: sequence.animation,
				transition: {
					duration: sequence.duration || 0.3,
					ease: sequence.easing || 'easeOut',
					delay: sequence.delay || 0
				}
			}

			// Simulate animation completion
			const totalDuration = (sequence.duration || 0.3) + (sequence.delay || 0)
			setTimeout(() => {
				resolve()
			}, totalDuration * 1000)
		})
	}

	/**
	 * Wait for resume if paused
	 */
	private async waitForResume(): Promise<void> {
		return new Promise((resolve) => {
			const checkResume = () => {
				if (!this.isPaused) {
					resolve()
				} else {
					setTimeout(checkResume, 10)
				}
			}
			checkResume()
		})
	}

	/**
	 * Check if sequence should repeat
	 */
	private shouldRepeat(): boolean {
		if (!this.options.repeat) return false
		
		if (typeof this.options.repeat === 'number') {
			return this.repeatCount < this.options.repeat
		}
		
		return this.options.repeat === true
	}

	/**
	 * Handle sequence repeat
	 */
	private async handleRepeat(): Promise<void> {
		this.repeatCount++

		// Apply repeat delay
		if (this.options.repeatDelay && this.options.repeatDelay > 0) {
			await new Promise(resolve => setTimeout(resolve, this.options.repeatDelay! * 1000))
		}

		// Reset for next iteration
		if (this.options.repeatType === 'reverse') {
			this.sequences = this.sequences.slice().reverse()
		} else if (this.options.repeatType === 'mirror') {
			// Mirror the sequences (reverse and apply mirror transformations)
			this.sequences = this.sequences.map(seq => seq ? {
				animation: this.mirrorAnimation(seq.animation),
				duration: seq.duration,
				delay: seq.delay,
				easing: seq.easing
			} : seq).filter(Boolean) as AnimationSequence[]
		}

		this.currentIndex = 0
		await this.playSequence()
	}

	/**
	 * Mirror animation values
	 */
	private mirrorAnimation(animation: any): any {
		const mirrored: any = {}
		
		for (const [key, value] of Object.entries(animation)) {
			if (key === 'x' || key === 'translateX') {
				mirrored[key] = typeof value === 'number' ? -value : value
			} else if (key === 'rotateY') {
				mirrored[key] = typeof value === 'number' ? -value : value
			} else {
				mirrored[key] = value
			}
		}
		
		return mirrored
	}

	/**
	 * Pause the sequence
	 */
	pause(): void {
		this.isPaused = true
	}

	/**
	 * Resume the sequence
	 */
	resume(): void {
		this.isPaused = false
	}

	/**
	 * Stop the sequence
	 */
	stop(): void {
		this.isPlaying = false
		this.isPaused = false
		this.currentIndex = 0
		this.repeatCount = 0
	}

	/**
	 * Seek to specific sequence index
	 */
	seek(index: number): void {
		if (index >= 0 && index < this.sequences.length) {
			this.currentIndex = index
		}
	}

	/**
	 * Get current sequence
	 */
	getCurrentSequence(): AnimationSequence | null {
		return this.sequences[this.currentIndex] || null
	}

	/**
	 * Get sequence progress (0-1)
	 */
	getProgress(): number {
		return this.sequences.length > 0 ? this.currentIndex / this.sequences.length : 0
	}

	/**
	 * Check if sequence is playing
	 */
	isSequencePlaying(): boolean {
		return this.isPlaying
	}

	/**
	 * Check if sequence is paused
	 */
	isSequencePaused(): boolean {
		return this.isPaused
	}
}

/**
 * Create animation sequence
 */
export function createAnimationSequence(
	sequences: AnimationSequence[],
	options?: SequenceOptions
): SequenceController {
	return new SequenceController(sequences, options)
}

/**
 * Create sequence from array of animations
 */
export function createSequenceFromAnimations(
	animations: any[],
	options?: SequenceOptions
): SequenceController {
	const sequences: AnimationSequence[] = animations.map(animation => ({
		animation,
		duration: 0.3,
		delay: 0,
		easing: 'easeOut'
	}))

	return createAnimationSequence(sequences, options)
}

/**
 * Create staggered sequence
 */
export function createStaggeredSequence(
	baseAnimation: any,
	count: number,
	stagger: number = 0.1,
	options?: SequenceOptions
): SequenceController {
	const sequences: AnimationSequence[] = Array.from({ length: count }, (_, index) => ({
		animation: baseAnimation,
		duration: 0.3,
		delay: index * stagger,
		easing: 'easeOut'
	}))

	return createAnimationSequence(sequences, options)
}

/**
 * Create parallel sequence (all animations start at once)
 */
export function createParallelSequence(
	animations: any[],
	options?: SequenceOptions
): SequenceController {
	const sequences: AnimationSequence[] = animations.map(animation => ({
		animation,
		duration: 0.3,
		delay: 0, // All start at the same time
		easing: 'easeOut'
	}))

	return createAnimationSequence(sequences, options)
}

/**
 * Create sequence with custom timing
 */
export function createTimedSequence(
	sequences: Array<{ animation: any; time: number }>,
	options?: SequenceOptions
): SequenceController {
	const animationSequences: AnimationSequence[] = sequences.map((seq, index) => ({
		animation: seq.animation,
		duration: 0.3,
		delay: seq.time,
		easing: 'easeOut'
	}))

	return createAnimationSequence(animationSequences, options)
}

/**
 * Sequence presets
 */
export const sequencePresets = {
	// Fade in sequence
	fadeInSequence: (count: number = 3) => createStaggeredSequence(
		{ opacity: [0, 1] },
		count,
		0.1
	),

	// Slide in sequence
	slideInSequence: (direction: 'left' | 'right' | 'up' | 'down' = 'left', count: number = 3) => {
		const animation = direction === 'left' ? { x: [-100, 0], opacity: [0, 1] } :
						 direction === 'right' ? { x: [100, 0], opacity: [0, 1] } :
						 direction === 'up' ? { y: [-100, 0], opacity: [0, 1] } :
						 { y: [100, 0], opacity: [0, 1] }

		return createStaggeredSequence(animation, count, 0.1)
	},

	// Scale sequence
	scaleSequence: (count: number = 3) => createStaggeredSequence(
		{ scale: [0, 1], opacity: [0, 1] },
		count,
		0.1
	),

	// Bounce sequence
	bounceSequence: (count: number = 3) => createStaggeredSequence(
		{ 
			scale: [0.3, 1.1, 0.9, 1.03, 0.97, 1],
			opacity: [0, 1, 1, 1, 1, 1]
		},
		count,
		0.15
	)
}
