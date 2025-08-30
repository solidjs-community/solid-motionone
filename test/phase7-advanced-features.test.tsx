import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@solidjs/testing-library'
import { createSignal, createRoot } from 'solid-js'
import { Motion, Presence } from '../src/index.js'
import { enableDebugging, disableDebugging } from '../src/debug/debugger.js'
import { prefersReducedMotion, createAccessibilityManager } from '../src/accessibility/pause-resume.js'
import { getPreset, applyPresetOptions } from '../src/presets/basic.js'
import { createAnimationSequence } from '../src/orchestration/sequences.js'

describe('Phase 7: Advanced Features', () => {
	beforeEach(() => {
		// Clean up any existing debug panels
		const existingPanel = document.getElementById('solid-motionone-debug-panel')
		if (existingPanel) {
			existingPanel.remove()
		}
	})

	afterEach(() => {
		// Disable debugging after each test
		disableDebugging()
	})

	describe('Debugger System', () => {
		it('should enable debugging with options', () => {
			const debuggerInstance = enableDebugging({
				showTimeline: true,
				showValues: true,
				showPerformance: true,
				logLevel: 'info',
				enableConsole: true,
				enablePanel: true,
				panelPosition: 'top-right'
			})

			expect(debuggerInstance).toBeDefined()
			expect(debuggerInstance.getState().isEnabled).toBe(true)

			// Check if debug panel was created
			const panel = document.getElementById('solid-motionone-debug-panel')
			expect(panel).toBeTruthy()
		})

		it('should track animation events', () => {
			const debuggerInstance = enableDebugging({ enableConsole: true })

			// Simulate animation tracking
			const mockElement = document.createElement('div')
			debuggerInstance.trackAnimationStart(mockElement, { property: 'opacity', value: 0 })
			debuggerInstance.trackAnimationUpdate(mockElement, 'opacity', 0.5)
			debuggerInstance.trackAnimationComplete(mockElement, { property: 'opacity', value: 1 }, 500)

			const state = debuggerInstance.getState()
			expect(state.animationValues.opacity).toBe(0.5)
			expect(state.performanceMetrics.animationCount).toBe(0) // Should be 0 after completion
		})

		it('should pause and resume debugger', () => {
			const debuggerInstance = enableDebugging()
			
			debuggerInstance.pause()
			expect(debuggerInstance.getState().isPaused).toBe(true)
			
			debuggerInstance.resume()
			expect(debuggerInstance.getState().isPaused).toBe(false)
		})

		it('should clear timeline', () => {
			const debuggerInstance = enableDebugging()
			
			// Add some events
			const mockElement = document.createElement('div')
			debuggerInstance.trackAnimationStart(mockElement, { property: 'opacity', value: 0 })
			
			expect(debuggerInstance.getTimeline().length).toBeGreaterThan(0)
			
			debuggerInstance.clearTimeline()
			expect(debuggerInstance.getTimeline().length).toBe(0)
		})
	})

	describe('Accessibility System', () => {
		it('should detect reduced motion preference', () => {
			const result = prefersReducedMotion()
			expect(typeof result).toBe('boolean')
		})

		it('should create accessibility manager', () => {
			const manager = createAccessibilityManager({
				pauseOnFocus: true,
				resumeOnBlur: true,
				pauseOnHover: true,
				respectReducedMotion: true,
				reducedMotionAnimation: { opacity: 1 }
			})

			expect(manager).toBeDefined()
			expect(manager.getState().isPaused).toBe(false)
		})

		it('should pause and resume animations', () => {
			const manager = createAccessibilityManager()
			
			manager.pause()
			expect(manager.getState().isPaused).toBe(true)
			expect(manager.shouldPause()).toBe(true)
			
			manager.resume()
			expect(manager.getState().isPaused).toBe(false)
			expect(manager.shouldPause()).toBe(false)
		})

		it('should handle manual pause/resume', () => {
			const manager = createAccessibilityManager({
				manualPause: true,
				manualResume: true
			})
			
			manager.manualPause()
			expect(manager.getState().isPaused).toBe(true)
			
			manager.manualResume()
			expect(manager.getState().isPaused).toBe(false)
		})
	})

	describe('Preset System', () => {
		it('should get preset by name', () => {
			const fadeInPreset = getPreset('fadeIn')
			expect(fadeInPreset).toBeDefined()
			expect(fadeInPreset?.name).toBe('fadeIn')
			expect(fadeInPreset?.initial).toEqual({ opacity: 0 })
			expect(fadeInPreset?.animate).toEqual({ opacity: 1 })
		})

		it('should return null for non-existent preset', () => {
			const nonExistentPreset = getPreset('nonExistent')
			expect(nonExistentPreset).toBeNull()
		})

		it('should apply preset options', () => {
			const fadeInPreset = getPreset('fadeIn')
			expect(fadeInPreset).toBeDefined()

			if (fadeInPreset) {
				const modifiedPreset = applyPresetOptions(fadeInPreset, {
					intensity: 2,
					duration: 1.0,
					easing: 'easeInOut',
					delay: 0.5
				})

				expect(modifiedPreset.transition?.duration).toBe(1.0)
				expect(modifiedPreset.transition?.ease).toBe('easeInOut')
				expect(modifiedPreset.transition?.delay).toBe(0.5)
			}
		})

		it('should scale values by intensity', () => {
			const bouncePreset = getPreset('bounce')
			expect(bouncePreset).toBeDefined()

			if (bouncePreset) {
				const modifiedPreset = applyPresetOptions(bouncePreset, {
					intensity: 2
				})

				// Check that scale values are scaled by intensity
				expect(modifiedPreset.initial?.scale).toBe(0.6) // 0.3 * 2
			}
		})
	})

	describe('Enhanced Orchestration', () => {
		it('should create animation sequence', () => {
			const sequences = [
				{ animation: { opacity: 0 }, duration: 0.3 },
				{ animation: { opacity: 1 }, duration: 0.3 },
				{ animation: { scale: 1.2 }, duration: 0.2 }
			]

			const controller = createAnimationSequence(sequences, {
				repeat: 2,
				repeatDelay: 0.5,
				repeatType: 'loop'
			})

			expect(controller).toBeDefined()
			expect(controller.getCurrentSequence()).toBeDefined()
			expect(controller.getProgress()).toBe(0)
		})

		it('should control sequence playback', () => {
			const sequences = [
				{ animation: { opacity: 0 }, duration: 0.1 },
				{ animation: { opacity: 1 }, duration: 0.1 }
			]

			const controller = createAnimationSequence(sequences)

			expect(controller.isSequencePlaying()).toBe(false)
			expect(controller.isSequencePaused()).toBe(false)

			// Test pause/resume
			controller.pause()
			expect(controller.isSequencePaused()).toBe(true)

			controller.resume()
			expect(controller.isSequencePaused()).toBe(false)

			// Test stop
			controller.stop()
			expect(controller.isSequencePlaying()).toBe(false)
		})

		it('should seek to specific sequence index', () => {
			const sequences = [
				{ animation: { opacity: 0 }, duration: 0.1 },
				{ animation: { opacity: 0.5 }, duration: 0.1 },
				{ animation: { opacity: 1 }, duration: 0.1 }
			]

			const controller = createAnimationSequence(sequences)

			controller.seek(1)
			expect(controller.getCurrentSequence()?.animation.opacity).toBe(0.5)
		})

		it('should get sequence progress', () => {
			const sequences = [
				{ animation: { opacity: 0 }, duration: 0.1 },
				{ animation: { opacity: 1 }, duration: 0.1 }
			]

			const controller = createAnimationSequence(sequences)

			expect(controller.getProgress()).toBe(0)

			controller.seek(1)
			expect(controller.getProgress()).toBe(0.5) // 1 out of 2 sequences
		})
	})

	describe('Integration Tests', () => {
		it('should use debugger with Motion component', () => {
			enableDebugging({ enablePanel: true })

			render(() => (
				<Motion.div
					debug
					debugOptions={{
						showTimeline: true,
						showValues: true,
						showPerformance: true
					}}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.1 }}
				>
					Debug Animation
				</Motion.div>
			))

			const element = screen.getByText('Debug Animation')
			expect(element).toBeInTheDocument()

			// Check if debug panel was created
			const panel = document.getElementById('solid-motionone-debug-panel')
			expect(panel).toBeTruthy()
		})

		it('should use accessibility features with Motion component', () => {
			render(() => (
				<Motion.div
					pauseOnFocus
					resumeOnBlur
					pauseOnHover
					respectReducedMotion
					reducedMotionAnimation={{ opacity: 1 }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.1 }}
				>
					Accessible Animation
				</Motion.div>
			))

			const element = screen.getByText('Accessible Animation')
			expect(element).toBeInTheDocument()
		})

		it('should use preset with Motion component', () => {
			render(() => (
				<Motion.div
					preset="fadeIn"
					presetOptions={{
						intensity: 1.5,
						duration: 0.5
					}}
				>
					Preset Animation
				</Motion.div>
			))

			const element = screen.getByText('Preset Animation')
			expect(element).toBeInTheDocument()
		})

		it('should use custom preset with Motion component', () => {
			const customPreset = {
				name: 'custom',
				initial: { opacity: 0, scale: 0.8 },
				animate: { opacity: 1, scale: 1 },
				exit: { opacity: 0, scale: 0.8 },
				transition: { duration: 0.3, ease: 'easeOut' }
			}

			render(() => (
				<Motion.div preset={customPreset}>
					Custom Preset Animation
				</Motion.div>
			))

			const element = screen.getByText('Custom Preset Animation')
			expect(element).toBeInTheDocument()
		})

		it('should use sequence with Motion component', () => {
			const sequences = [
				{ animation: { opacity: 0 }, duration: 0.1 },
				{ animation: { opacity: 1, scale: 1.2 }, duration: 0.2 },
				{ animation: { scale: 1 }, duration: 0.1 }
			]

			render(() => (
				<Motion.div
					sequence={sequences}
					sequenceOptions={{
						repeat: 1,
						repeatType: 'loop'
					}}
				>
					Sequence Animation
				</Motion.div>
			))

			const element = screen.getByText('Sequence Animation')
			expect(element).toBeInTheDocument()
		})

		it('should combine multiple Phase 7 features', () => {
			enableDebugging({ enablePanel: true })

			render(() => (
				<Motion.div
					debug
					debugOptions={{ showTimeline: true }}
					pauseOnFocus
					respectReducedMotion
					preset="bounce"
					presetOptions={{ intensity: 0.8 }}
					sequence={[
						{ animation: { opacity: 0 }, duration: 0.1 },
						{ animation: { opacity: 1 }, duration: 0.1 }
					]}
					sequenceOptions={{ repeat: 1 }}
				>
					Combined Features
				</Motion.div>
			))

			const element = screen.getByText('Combined Features')
			expect(element).toBeInTheDocument()

			// Check if debug panel was created
			const panel = document.getElementById('solid-motionone-debug-panel')
			expect(panel).toBeTruthy()
		})
	})
})
