import { createMemo, Accessor } from "solid-js"
import type { ScrollPosition, TransformOptions } from "../types.js"

// 🆕 Transform function type
export type TransformFunction<T = number> = (value: number) => T

// 🆕 Create transform function
export function createTransform<T = number>(
	input: Accessor<number>,
	output: [number, number],
	inputRange: [number, number] = [0, 1],
	options: Accessor<TransformOptions> = () => ({})
): Accessor<T> {
	return createMemo(() => {
		const value = input()
		const opts = options()
		
		// Clamp input value to range
		const clampedValue = Math.max(
			inputRange[0],
			Math.min(inputRange[1], value)
		)
		
		// Calculate progress within input range
		const progress = (clampedValue - inputRange[0]) / (inputRange[1] - inputRange[0])
		
		// Apply easing if specified
		let easedProgress = progress
		if (opts.easing) {
			easedProgress = opts.easing(progress)
		}
		
		// Transform to output range
		const transformedValue = output[0] + (output[1] - output[0]) * easedProgress
		
		// Apply clamp if specified
		if (opts.clamp !== false) {
			return Math.max(output[0], Math.min(output[1], transformedValue)) as T
		}
		
		return transformedValue as T
	})
}

// 🆕 Create scroll-based transform
export function createScrollTransform<T = number>(
	scrollPosition: Accessor<ScrollPosition>,
	output: [number, number],
	scrollRange: [number, number] = [0, 1],
	options: Accessor<TransformOptions> = () => ({})
): Accessor<T> {
	return createTransform(
		() => scrollPosition().progress,
		output,
		scrollRange,
		options
	)
}

// 🆕 Create scroll velocity transform
export function createScrollVelocityTransform<T = number>(
	scrollPosition: Accessor<ScrollPosition>,
	output: [number, number],
	velocityRange: [number, number] = [0, 1000],
	options: Accessor<TransformOptions> = () => ({})
): Accessor<T> {
	return createTransform(
		() => Math.abs(scrollPosition().velocity.y),
		output,
		velocityRange,
		options
	)
}

// 🆕 Create scroll X transform
export function createScrollXTransform<T = number>(
	scrollPosition: Accessor<ScrollPosition>,
	output: [number, number],
	scrollRange: [number, number] = [0, window.innerWidth],
	options: Accessor<TransformOptions> = () => ({})
): Accessor<T> {
	return createTransform(
		() => scrollPosition().x,
		output,
		scrollRange,
		options
	)
}

// 🆕 Create scroll Y transform
export function createScrollYTransform<T = number>(
	scrollPosition: Accessor<ScrollPosition>,
	output: [number, number],
	scrollRange: [number, number] = [0, document.documentElement.scrollHeight],
	options: Accessor<TransformOptions> = () => ({})
): Accessor<T> {
	return createTransform(
		() => scrollPosition().y,
		output,
		scrollRange,
		options
	)
}

// 🆕 Common easing functions
export const easing = {
	linear: (t: number) => t,
	easeIn: (t: number) => t * t,
	easeOut: (t: number) => 1 - (1 - t) * (1 - t),
	easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
	circIn: (t: number) => 1 - Math.sqrt(1 - t * t),
	circOut: (t: number) => Math.sqrt(1 - (t - 1) * (t - 1)),
	circInOut: (t: number) => t < 0.5 
		? (1 - Math.sqrt(1 - (2 * t) * (2 * t))) / 2
		: (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,
	backIn: (t: number) => {
		const c1 = 1.70158
		const c3 = c1 + 1
		return c3 * t * t * t - c1 * t * t
	},
	backOut: (t: number) => {
		const c1 = 1.70158
		const c3 = c1 + 1
		return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
	},
	backInOut: (t: number) => {
		const c1 = 1.70158
		const c2 = c1 * 1.525
		return t < 0.5
			? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
			: (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2
	}
}

// 🆕 Utility function to create custom easing
export function createEasing(
	points: [number, number][]
): TransformFunction {
	return (t: number) => {
		if (!points || points.length === 0) return 0
		if (t <= 0) return points[0]?.[1] || 0
		if (t >= 1) return points[points.length - 1]?.[1] || 0
		
		// Find the segment containing t
		for (let i = 0; i < points.length - 1; i++) {
			const [t1, y1] = points[i] || [0, 0]
			const [t2, y2] = points[i + 1] || [0, 0]
			
			if (t >= t1 && t <= t2) {
				const segmentT = (t - t1) / (t2 - t1)
				return y1 + (y2 - y1) * segmentT
			}
		}
		
		return points[points.length - 1]?.[1] || 0
	}
}
