import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@solidjs/testing-library'
import { Motion } from '../src/index.js'
import { getPreset, applyPresetOptions } from '../src/presets/basic.js'
import { createAnimationSequence } from '../src/orchestration/sequences.js'

describe('Phase 7: Advanced Features - Simple Tests', () => {
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
	})

	describe('Integration Tests', () => {
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
	})
})
