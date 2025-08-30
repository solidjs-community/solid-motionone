import type { KeyframeConfig, KeyframeOptions } from "../types.js"

// Keyframe interpolation types
export type InterpolationType = "linear" | "ease" | "easeIn" | "easeOut" | "easeInOut" | "step"

// Keyframe segment
export interface KeyframeSegment {
	time: number
	values: { [key: string]: number | string }
	easing?: (t: number) => number
}

// Keyframe animation controller
export class KeyframeAnimationController {
	private segments: KeyframeSegment[] = []
	private duration: number = 1000
	private isRunning = false
	private startTime: number = 0
	private onUpdate?: (values: { [key: string]: number | string }) => void
	private onComplete?: () => void

	constructor(keyframes: KeyframeConfig, options: KeyframeOptions = {}) {
		this.setKeyframes(keyframes, options)
	}

	setKeyframes(keyframes: KeyframeConfig, options: KeyframeOptions = {}) {
		this.segments = this.parseKeyframes(keyframes, options)
		this.duration = options.keyframeOffset ? 
			Math.max(...this.segments.map(s => s.time)) : 
			this.duration
	}

	private parseKeyframes(
		keyframes: KeyframeConfig, 
		options: KeyframeOptions
	): KeyframeSegment[] {
		const segments: KeyframeSegment[] = []
		const keys = Object.keys(keyframes)
		
		if (keys.length === 0) return segments

		// Simplified parsing - just create basic segments
		const firstKey = keys[0]
		if (firstKey) {
			const keyframeValue = (keyframes as any)[firstKey]
			if (Array.isArray(keyframeValue)) {
				const numFrames = keyframeValue.length
				for (let i = 0; i < numFrames; i++) {
					const time = (i / (numFrames - 1)) * this.duration
					const values: { [key: string]: number | string } = {}
					
					for (const key of keys) {
						const array = (keyframes as any)[key]
						if (Array.isArray(array) && array[i] !== undefined) {
							values[key] = array[i]
						}
					}
					
					segments.push({
						time,
						values,
						easing: options.keyframeEasing as (t: number) => number,
					})
				}
			}
		}

		return segments.sort((a, b) => a.time - b.time)
	}

	animate(
		onUpdate?: (values: { [key: string]: number | string }) => void,
		onComplete?: () => void
	) {
		this.onUpdate = onUpdate
		this.onComplete = onComplete
		this.startTime = performance.now()
		this.isRunning = true
		this.animateFrame()
	}

	private animateFrame = () => {
		if (!this.isRunning) return

		const currentTime = performance.now()
		const elapsed = currentTime - this.startTime
		const progress = Math.min(elapsed / this.duration, 1)

		const values = this.interpolate(progress)
		this.onUpdate?.(values)

		if (progress >= 1) {
			this.isRunning = false
			this.onComplete?.()
		} else {
			requestAnimationFrame(this.animateFrame)
		}
	}

	private interpolate(progress: number): { [key: string]: number | string } {
		if (this.segments.length === 0) return {}

		const currentTime = progress * this.duration
		let currentSegmentIndex = 0

		for (let i = 0; i < this.segments.length; i++) {
			if (this.segments[i]!.time <= currentTime) {
				currentSegmentIndex = i
			} else {
				break
			}
		}

		const currentSegment = this.segments[currentSegmentIndex]!
		if (!currentSegment) {
			return {}
		}

		const nextSegment = this.segments[currentSegmentIndex + 1]

		if (!nextSegment) {
			return currentSegment.values
		}

		const segmentProgress = (currentTime - currentSegment.time) / 
			(nextSegment.time - currentSegment.time)
		const easedProgress = currentSegment.easing ? 
			currentSegment.easing(segmentProgress) : 
			segmentProgress

		const interpolatedValues: { [key: string]: number | string } = {}

		for (const key of Object.keys({ ...currentSegment.values, ...nextSegment.values })) {
			const currentValue = (currentSegment.values as any)[key]
			const nextValue = (nextSegment.values as any)[key]

			if (currentValue !== undefined && nextValue !== undefined) {
				if (typeof currentValue === "number" && typeof nextValue === "number") {
					interpolatedValues[key] = currentValue + (nextValue - currentValue) * easedProgress
				} else {
					interpolatedValues[key] = easedProgress < 0.5 ? currentValue : nextValue
				}
			} else if (currentValue !== undefined) {
				interpolatedValues[key] = currentValue
			} else if (nextValue !== undefined) {
				interpolatedValues[key] = nextValue
			}
		}

		return interpolatedValues
	}

	stop() {
		this.isRunning = false
	}

	reset() {
		this.isRunning = false
		this.startTime = 0
	}
}

// Easing functions
export const easingFunctions = {
	linear: (t: number) => t,
	ease: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
	easeIn: (t: number) => t * t,
	easeOut: (t: number) => t * (2 - t),
	easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
	step: (t: number) => t < 0.5 ? 0 : 1,
	bounce: (t: number) => {
		if (t < 1 / 2.75) {
			return 7.5625 * t * t
		} else if (t < 2 / 2.75) {
			return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
		} else if (t < 2.5 / 2.75) {
			return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
		} else {
			return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375
		}
	},
	elastic: (t: number) => {
		return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1
	},
}

// Create keyframe animation
export function createKeyframeAnimation(
	keyframes: KeyframeConfig,
	options: KeyframeOptions = {}
): KeyframeAnimationController {
	return new KeyframeAnimationController(keyframes, options)
}

// Utility function to create keyframes from arrays
export function createKeyframesFromArrays(
	keyframeArrays: { [key: string]: Array<number | string> },
	options: KeyframeOptions = {}
): KeyframeAnimationController {
	return new KeyframeAnimationController(keyframeArrays as KeyframeConfig, options)
}

// Utility function to create keyframes from time-based objects
export function createKeyframesFromTimes(
	keyframeTimes: { [key: string]: { [time: string]: number | string } },
	options: KeyframeOptions = {}
): KeyframeAnimationController {
	return new KeyframeAnimationController(keyframeTimes as unknown as KeyframeConfig, options)
}
