import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { Motion } from '../src/index.js'
import { 
  createRouterIntegration, 
  createFormIntegration, 
  createAnimationInspector,
  createRouterIntegrationEffect,
  createFormIntegrationEffect,
  createAnimationInspectorEffect
} from '../src/integration/index.js'

describe('Phase 9: Integration & Polish - Simple Tests', () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '<div id="root"></div>'
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('Router Integration', () => {
    it('should create router integration manager', () => {
      const manager = createRouterIntegration({
        routeTransition: true,
        routeTransitionDuration: 300,
        routeTransitionEasing: 'easeInOut'
      })
      
      expect(manager).toBeDefined()
      expect(manager.getState()).toBeDefined()
      expect(typeof manager.transitionToRoute).toBe('function')
      expect(typeof manager.registerRouteElement).toBe('function')
      
      manager.destroy()
    })

    it('should create router integration effect', () => {
      const element = document.createElement('div')
      const route = '/test'
      const options = {
        routeTransition: true,
        routeTransitionDuration: 300
      }
      
      const manager = createRouterIntegrationEffect(() => element, route, options)
      
      expect(manager).toBeDefined()
      expect(manager?.getState()).toBeDefined()
    })

    it('should integrate with Motion component', () => {
      const TestComponent = () => {
        return (
          <Motion.div
            routerIntegration={{
              routeTransition: true,
              routeTransitionDuration: 300,
              routeTransitionEasing: 'easeInOut',
              routeTransitionDirection: 'fade'
            }}
          >
            Router Integration Test
          </Motion.div>
        )
      }
      
      render(() => <TestComponent />)
      expect(screen.getByText('Router Integration Test')).toBeDefined()
    })
  })

  describe('Form Integration', () => {
    it('should create form integration manager', () => {
      const manager = createFormIntegration({
        formValidation: true,
        validationAnimation: { scale: 1.05 },
        errorAnimation: { x: [0, -10, 10, -10, 10, 0] }
      })
      
      expect(manager).toBeDefined()
      expect(manager.getState()).toBeDefined()
      expect(typeof manager.validateForm).toBe('function')
      expect(typeof manager.validateField).toBe('function')
      
      manager.destroy()
    })

    it('should create form integration effect', () => {
      const element = document.createElement('form')
      const options = {
        formValidation: true,
        validationAnimation: { scale: 1.05 }
      }
      
      const manager = createFormIntegrationEffect(() => element, options)
      
      expect(manager).toBeDefined()
      expect(manager?.getState()).toBeDefined()
    })

    it('should integrate with Motion component', () => {
      const TestComponent = () => {
        return (
          <Motion.div
            formIntegration={{
              formValidation: true,
              validationAnimation: { scale: 1.05 },
              errorAnimation: { x: [0, -10, 10, -10, 10, 0] },
              successAnimation: { scale: 1.02 }
            }}
          >
            Form Integration Test
          </Motion.div>
        )
      }
      
      render(() => <TestComponent />)
      expect(screen.getByText('Form Integration Test')).toBeDefined()
    })
  })

  describe('Animation Inspector', () => {
    it('should create animation inspector', () => {
      const inspector = createAnimationInspector({
        inspectorEnabled: true,
        inspectorPosition: 'top-right',
        inspectorSize: 'medium',
        showPerformance: true,
        showTimeline: true,
        showProperties: true
      })
      
      expect(inspector).toBeDefined()
      expect(inspector.getState()).toBeDefined()
      expect(typeof inspector.toggle).toBe('function')
      expect(typeof inspector.open).toBe('function')
      expect(typeof inspector.close).toBe('function')
      
      inspector.destroy()
    })

    it('should create animation inspector effect', () => {
      const element = document.createElement('div')
      const options = {
        inspectorEnabled: true,
        inspectorPosition: 'top-right',
        showPerformance: true
      }
      
      const inspector = createAnimationInspectorEffect(() => element, options)
      
      expect(inspector).toBeDefined()
      expect(inspector?.getState()).toBeDefined()
    })

    it('should integrate with Motion component', () => {
      const TestComponent = () => {
        return (
          <Motion.div
            animationInspector={{
              inspectorEnabled: true,
              inspectorPosition: 'top-right',
              inspectorSize: 'medium',
              showPerformance: true,
              showTimeline: true,
              showProperties: true
            }}
          >
            Animation Inspector Test
          </Motion.div>
        )
      }
      
      render(() => <TestComponent />)
      expect(screen.getByText('Animation Inspector Test')).toBeDefined()
    })
  })

  describe('Combined Integration', () => {
    it('should work with all Phase 9 features together', () => {
      const TestComponent = () => {
        return (
          <Motion.div
            routerIntegration={{
              routeTransition: true,
              routeTransitionDuration: 300
            }}
            formIntegration={{
              formValidation: true,
              validationAnimation: { scale: 1.05 }
            }}
            animationInspector={{
              inspectorEnabled: true,
              inspectorPosition: 'top-right'
            }}
          >
            Combined Integration Test
          </Motion.div>
        )
      }
      
      render(() => <TestComponent />)
      expect(screen.getByText('Combined Integration Test')).toBeDefined()
    })

    it('should handle integration state properly', () => {
      const routerManager = createRouterIntegration()
      const formManager = createFormIntegration()
      const inspector = createAnimationInspector()
      
      const routerState = routerManager.getState()
      const formState = formManager.getState()
      const inspectorState = inspector.getState()
      
      expect(routerState).toBeDefined()
      expect(formState).toBeDefined()
      expect(inspectorState).toBeDefined()
      
      expect(routerState.currentRoute).toBeNull()
      expect(formState.activeForm).toBeNull()
      expect(inspectorState.inspectorOpen).toBe(false)
      
      routerManager.destroy()
      formManager.destroy()
      inspector.destroy()
    })
  })
})
