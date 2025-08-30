import { createSignal, createEffect, onCleanup, Accessor } from "solid-js"
import type { TimelineOptions, TimelineConfig, TimelineSegment } from "../types.js"

export interface TimelineController {
	play: () => void
	pause: () => void
	stop: () => void
	seek: (progress: number) => void
	getProgress: () => number
	isPlaying: () => boolean
}

export interface TimelineState {
	isPlaying: boolean
	progress: number
	currentSegment: number
	totalSegments: number
	duration: number
	elapsed: number
}

export function createTimelineController(
	options: Accessor<TimelineOptions> = () => ({})
): TimelineController {
	const [state, setState] = createSignal<TimelineState>({
		isPlaying: false,
		progress: 0,
		currentSegment: 0,
		totalSegments: 0,
		duration: 0,
		elapsed: 0
	})

	let animationFrame: number | null = null
	let startTime: number | null = null
	let segments: TimelineSegment[] = []
	let currentSegmentIndex = 0

	function initializeTimeline() {
		const opts = options()
		const timelineConfig = opts.timeline || {}
		
		segments = timelineConfig.segments || []
		const duration = timelineConfig.duration || 1000
		
		setState(prev => ({
			...prev,
			totalSegments: segments.length,
			duration
		}))
	}

	function playTimeline() {
		if (state().isPlaying) return

		setState(prev => ({ ...prev, isPlaying: true }))
		startTime = performance.now() - (state().elapsed)
		
		// Trigger timeline start callback
		const onTimelineStart = options().onTimelineStart
		if (onTimelineStart) {
			onTimelineStart(state().progress)
		}
		
		animateTimeline()
	}

	function pauseTimeline() {
		if (!state().isPlaying) return

		setState(prev => ({ ...prev, isPlaying: false }))
		
		if (animationFrame) {
			cancelAnimationFrame(animationFrame)
			animationFrame = null
		}
	}

	function stopTimeline() {
		pauseTimeline()
		seekTimeline(0)
	}

	function seekTimeline(progress: number) {
		const clampedProgress = Math.max(0, Math.min(1, progress))
		const elapsed = clampedProgress * state().duration
		
		setState(prev => ({
			...prev,
			progress: clampedProgress,
			elapsed
		}))
		
		// Trigger timeline update callback
		const onTimelineUpdate = options().onTimelineUpdate
		if (onTimelineUpdate) {
			onTimelineUpdate(clampedProgress)
		}
		
		// Update current segment
		updateCurrentSegment(elapsed)
	}

	function animateTimeline() {
		if (!startTime || !state().isPlaying) return

		const currentTime = performance.now()
		const elapsed = currentTime - startTime
		const progress = Math.min(elapsed / state().duration, 1)
		
		setState(prev => ({
			...prev,
			progress,
			elapsed
		}))
		
		// Trigger timeline update callback
		const onTimelineUpdate = options().onTimelineUpdate
		if (onTimelineUpdate) {
			onTimelineUpdate(progress)
		}
		
		// Update current segment
		updateCurrentSegment(elapsed)
		
		if (progress < 1) {
			animationFrame = requestAnimationFrame(animateTimeline)
		} else {
			// Timeline complete
			setState(prev => ({ ...prev, isPlaying: false }))
			
			// Trigger timeline complete callback
			const onTimelineComplete = options().onTimelineComplete
			if (onTimelineComplete) {
				onTimelineComplete(progress)
			}
			
			// Handle repeat
			const timelineConfig = options().timeline
			if (timelineConfig?.repeat) {
				handleRepeat(timelineConfig.repeat)
			}
		}
	}

	function updateCurrentSegment(elapsed: number) {
		const newSegmentIndex = segments.findIndex((segment, index) => {
			const segmentStart = segment.at || (index * (state().duration / segments.length))
			const segmentEnd = segments[index + 1]?.at || 
				((index + 1) * (state().duration / segments.length))
			
			return elapsed >= segmentStart && elapsed < segmentEnd
		})
		
		if (newSegmentIndex !== -1 && newSegmentIndex !== currentSegmentIndex) {
			currentSegmentIndex = newSegmentIndex
			setState(prev => ({ ...prev, currentSegment: newSegmentIndex }))
			
			// Execute segment animation
			const segment = segments[newSegmentIndex]
			if (segment?.animation) {
				executeSegmentAnimation(segment)
			}
		}
	}

	function executeSegmentAnimation(segment: TimelineSegment) {
		// Create a custom event to trigger the animation
		try {
			const event = new CustomEvent("timeline-segment", {
				detail: {
					segment,
					progress: state().progress,
					elapsed: state().elapsed
				}
			})
			
			// Dispatch to document for global handling
			document.dispatchEvent(event)
		} catch (error) {
			// Fallback for environments that don't support CustomEvent
			console.log("Timeline segment executed:", segment)
		}
	}

	function handleRepeat(repeat: number | "loop" | "reverse") {
		if (repeat === "loop" || (typeof repeat === "number" && repeat > 0)) {
			// Reset and play again
			setTimeout(() => {
				seekTimeline(0)
				playTimeline()
			}, options().timeline?.repeatDelay || 0)
		} else if (repeat === "reverse") {
			// Play in reverse
			setTimeout(() => {
				playTimelineReverse()
			}, options().timeline?.repeatDelay || 0)
		}
	}

	function playTimelineReverse() {
		// Implementation for reverse playback
		// This would require tracking the timeline in reverse
		console.log("Reverse playback not yet implemented")
	}

	// Initialize timeline when options change
	createEffect(() => {
		initializeTimeline()
	})

	onCleanup(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame)
		}
	})

	return {
		play: playTimeline,
		pause: pauseTimeline,
		stop: stopTimeline,
		seek: seekTimeline,
		getProgress: () => state().progress,
		isPlaying: () => state().isPlaying
	}
}

export function createTimelineSegment(
	at: number,
	animation: any,
	duration?: number,
	easing?: (t: number) => number
): TimelineSegment {
	return {
		at,
		animation,
		duration,
		easing
	}
}

export function createTimelineConfig(
	segments: TimelineSegment[],
	duration?: number,
	easing?: (t: number) => number,
	repeat?: number | "loop" | "reverse",
	repeatDelay?: number
): TimelineConfig {
	return {
		segments,
		duration,
		easing,
		repeat,
		repeatDelay
	}
}
