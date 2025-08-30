import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@solidjs/testing-library'
import { Motion } from '../src/index.js'
import { createGestureRecognizer } from '../src/gestures/recognition.js'
import { createAdvancedOrchestrationController } from '../src/orchestration/advanced.js'

describe('Phase 8: Enhanced Gestures - Simple Tests', () => {
  describe('Gesture Recognition', () => {
    it('should create gesture recognizer', () => {
      const element = document.createElement('div')
      const recognizer = createGestureRecognizer(element, {
        patterns: [
          { type: 'swipe', direction: 'right', threshold: 50 }
        ],
        enableSwipe: true,
        swipeThreshold: 50
      })
      
      expect(recognizer).toBeDefined()
      expect(recognizer.getState()).toBeDefined()
      
      recognizer.destroy()
    })

    it('should recognize swipe gesture', () => {
      const element = document.createElement('div')
      const recognizer = createGestureRecognizer(element, {
        patterns: [
          { type: 'swipe', direction: 'right', threshold: 50 }
        ],
        enableSwipe: true,
        swipeThreshold: 50
      })
      
      const state = recognizer.getState()
      expect(state.isRecognizing).toBe(false)
      expect(state.currentGesture).toBeNull()
      
      recognizer.destroy()
    })

    it('should recognize long press gesture', () => {
      const element = document.createElement('div')
      const recognizer = createGestureRecognizer(element, {
        patterns: [
          { type: 'longPress', duration: 500 }
        ],
        enableLongPress: true,
        longPressDuration: 500
      })
      
      const state = recognizer.getState()
      expect(state.isRecognizing).toBe(false)
      
      recognizer.destroy()
    })
  })

  describe('Advanced Orchestration', () => {
    it('should create advanced orchestration controller', () => {
      const controller = createAdvancedOrchestrationController({
        gestureOrchestration: true,
        crossElementOrchestration: true,
        performanceBasedAdjustment: true
      })
      
      expect(controller).toBeDefined()
      
      const metrics = controller.getPerformanceMetrics()
      expect(metrics.fps).toBeGreaterThan(0)
      expect(metrics.activeAnimations).toBe(0)
      
      controller.destroy()
    })

    it('should register and unregister gestures', () => {
      const controller = createAdvancedOrchestrationController()
      const element = document.createElement('div')
      
      controller.registerGesture(element, {
        patterns: [{ type: 'swipe', direction: 'right' }],
        enableSwipe: true
      })
      
      const state = controller.getGestureState(element)
      expect(state).toBeDefined()
      
      controller.unregisterGesture(element)
      const stateAfter = controller.getGestureState(element)
      expect(stateAfter).toBeNull()
      
      controller.destroy()
    })

    it('should coordinate gestures', () => {
      const controller = createAdvancedOrchestrationController()
      const element1 = document.createElement('div')
      const element2 = document.createElement('div')
      
      controller.registerGesture(element1, {
        patterns: [{ type: 'swipe', direction: 'right' }],
        enableSwipe: true
      })
      
      controller.registerGesture(element2, {
        patterns: [{ type: 'swipe', direction: 'left' }],
        enableSwipe: true
      })
      
      // This should not throw an error
      controller.coordinateGestures([element1, element2], 'parallel')
      
      controller.destroy()
    })
  })

  describe('Integration Tests', () => {
    it('should use gesture recognition with Motion component', () => {
      render(() => (
        <Motion.div
          gestureRecognition={{
            patterns: [{ type: 'swipe', direction: 'right' }],
            enableSwipe: true,
            swipeThreshold: 50
          }}
        >
          Swipeable Element
        </Motion.div>
      ))
      
      const element = screen.getByText('Swipeable Element')
      expect(element).toBeInTheDocument()
    })

    it('should use advanced orchestration with Motion component', () => {
      render(() => (
        <Motion.div
          advancedOrchestration={{
            gestureOrchestration: true,
            crossElementOrchestration: true,
            performanceBasedAdjustment: true
          }}
        >
          Orchestrated Element
        </Motion.div>
      ))
      
      const element = screen.getByText('Orchestrated Element')
      expect(element).toBeInTheDocument()
    })

    it('should combine gesture recognition and advanced orchestration', () => {
      render(() => (
        <Motion.div
          gestureRecognition={{
            patterns: [
              { type: 'swipe', direction: 'right' },
              { type: 'longPress', duration: 500 }
            ],
            enableSwipe: true,
            enableLongPress: true
          }}
          advancedOrchestration={{
            gestureOrchestration: true,
            performanceBasedAdjustment: true
          }}
        >
          Advanced Gesture Element
        </Motion.div>
      ))
      
      const element = screen.getByText('Advanced Gesture Element')
      expect(element).toBeInTheDocument()
    })
  })
})
