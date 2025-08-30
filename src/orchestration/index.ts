export * from "./stagger.js"
export * from "./timeline.js"

import { createSignal, createEffect, onCleanup, Accessor } from "solid-js"
import type { OrchestrationOptions, StaggerOptions, TimelineOptions } from "../types.js"
import { createStaggerController, createStaggerChildren } from "./stagger.js"
import { createTimelineController } from "./timeline.js"

export interface OrchestrationController {
	stagger: ReturnType<typeof createStaggerController>
	timeline: ReturnType<typeof createTimelineController>
	start: () => void
	stop: () => void
	reset: () => void
	getState: () => any
}

export function createOrchestrationController(
	elements: Accessor<Element[]>,
	staggerOptions: Accessor<StaggerOptions> = () => ({}),
	timelineOptions: Accessor<TimelineOptions> = () => ({}),
	orchestrationOptions: Accessor<OrchestrationOptions> = () => ({})
): OrchestrationController {
	const stagger = createStaggerController(elements, staggerOptions)
	const timeline = createTimelineController(timelineOptions)

	function startOrchestration() {
		const opts = orchestrationOptions()
		
		if (opts.orchestrate) {
			// Start with delay if specified
			if (opts.orchestrateDelay) {
				setTimeout(() => {
					stagger.start()
					timeline.play()
				}, opts.orchestrateDelay)
			} else {
				stagger.start()
				timeline.play()
			}
		}
	}

	function stopOrchestration() {
		stagger.stop()
		timeline.pause()
	}

	function resetOrchestration() {
		stagger.reset()
		timeline.stop()
	}

	function getOrchestrationState() {
		return {
			stagger: stagger.getState(),
			timeline: {
				progress: timeline.getProgress(),
				isPlaying: timeline.isPlaying()
			}
		}
	}

	// Auto-start orchestration when options change
	createEffect(() => {
		const opts = orchestrationOptions()
		if (opts.orchestrate) {
			startOrchestration()
		}
	})

	onCleanup(() => {
		stopOrchestration()
	})

	return {
		stagger,
		timeline,
		start: startOrchestration,
		stop: stopOrchestration,
		reset: resetOrchestration,
		getState: getOrchestrationState
	}
}

export function createOrchestratedChildren(
	parentElement: Accessor<Element>,
	staggerOptions: Accessor<StaggerOptions> = () => ({}),
	timelineOptions: Accessor<TimelineOptions> = () => ({}),
	orchestrationOptions: Accessor<OrchestrationOptions> = () => ({})
) {
	return createOrchestrationController(
		() => {
			const parent = parentElement()
			if (!parent) return []
			return Array.from(parent.children) as Element[]
		},
		staggerOptions,
		timelineOptions,
		orchestrationOptions
	)
}

// Utility functions for common orchestration patterns
export function createStaggeredList(
	elements: Accessor<Element[]>,
	staggerDelay: number = 0.1,
	direction: "forward" | "reverse" | "from-center" = "forward"
) {
	return createStaggerController(elements, () => ({
		stagger: { delay: staggerDelay, direction }
	}))
}

export function createTimelineSequence(
	segments: any[],
	duration: number = 1000,
	repeat: number | "loop" | "reverse" = 1
) {
	return createTimelineController(() => ({
		timeline: {
			segments,
			duration,
			repeat
		}
	}))
}

export function createOrchestratedSequence(
	elements: Accessor<Element[]>,
	staggerDelay: number = 0.1,
	timelineDuration: number = 1000
) {
	return createOrchestrationController(
		elements,
		() => ({ stagger: { delay: staggerDelay } }),
		() => ({ timeline: { duration: timelineDuration } }),
		() => ({ orchestrate: true })
	)
}
