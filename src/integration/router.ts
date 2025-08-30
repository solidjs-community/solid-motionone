import { createSignal, createEffect, onCleanup } from 'solid-js'
import type { RouterIntegrationOptions, IntegrationState } from '../types.js'

export class RouterIntegrationManager {
  private options: RouterIntegrationOptions
  private state: IntegrationState
  private currentRoute: string | null = null
  private previousRoute: string | null = null
  private isTransitioning = false
  private transitionElements: Map<string, HTMLElement> = new Map()
  private sharedElements: Map<string, HTMLElement[]> = new Map()

  constructor(options: RouterIntegrationOptions = {}) {
    this.options = {
      routeTransition: true,
      routeTransitionDuration: 300,
      routeTransitionEasing: 'easeInOut',
      routeTransitionDirection: 'fade',
      ...options
    }
    
    this.state = {
      currentRoute: null,
      previousRoute: null,
      isTransitioning: false,
      activeForm: null,
      focusedField: null,
      formErrors: {},
      formIsValid: true,
      inspectorOpen: false,
      selectedAnimation: null,
      inspectorMetrics: {
        fps: 60,
        memoryUsage: 0,
        activeAnimations: 0,
        totalElements: 0
      }
    }
    
    this.initialize()
  }

  private initialize() {
    this.setupRouteListener()
    this.setupSharedElementTracking()
  }

  private setupRouteListener() {
    // Listen for route changes (this would integrate with SolidJS router)
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', this.handleRouteChange.bind(this))
    }
  }

  private setupSharedElementTracking() {
    // Track shared elements across routes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.updateSharedElements()
        }
      })
    })

    if (typeof document !== 'undefined') {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      })
    }

    onCleanup(() => {
      observer.disconnect()
    })
  }

  private updateSharedElements() {
    if (typeof document === 'undefined') return

    const sharedElementSelectors = this.options.routeSharedElements || []
    sharedElementSelectors.forEach(selector => {
      const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[]
      this.sharedElements.set(selector, elements)
    })
  }

  private handleRouteChange(event?: PopStateEvent) {
    const newRoute = this.getCurrentRoute()
    if (newRoute !== this.currentRoute) {
      this.transitionToRoute(newRoute)
    }
  }

  private getCurrentRoute(): string {
    if (typeof window === 'undefined') return '/'
    return window.location.pathname
  }

  async transitionToRoute(newRoute: string) {
    if (this.isTransitioning) return

    this.isTransitioning = true
    this.state.isTransitioning = true
    this.previousRoute = this.currentRoute
    this.currentRoute = newRoute

    // Trigger transition start event
    if (this.options.onRouteTransitionStart) {
      this.options.onRouteTransitionStart(this.previousRoute || '', newRoute)
    }

    // Handle exit animation for previous route
    if (this.previousRoute && this.options.routeExitAnimation) {
      await this.animateRouteExit(this.previousRoute)
    }

    // Handle enter animation for new route
    if (this.options.routeEnterAnimation) {
      await this.animateRouteEnter(newRoute)
    }

    // Handle shared element transitions
    await this.animateSharedElements()

    this.isTransitioning = false
    this.state.isTransitioning = false

    // Trigger transition complete event
    if (this.options.onRouteTransitionComplete) {
      this.options.onRouteTransitionComplete(this.previousRoute || '', newRoute)
    }
  }

  private async animateRouteExit(route: string): Promise<void> {
    const elements = this.transitionElements.get(route)
    if (!elements || !this.options.routeExitAnimation) return

    return new Promise((resolve) => {
      // Apply exit animation
      const animation = this.createRouteAnimation(
        elements,
        this.options.routeExitAnimation!,
        this.options.routeTransitionDuration || 300,
        this.options.routeTransitionEasing || 'easeInOut'
      )

      animation.onfinish = () => resolve()
    })
  }

  private async animateRouteEnter(route: string): Promise<void> {
    const elements = this.transitionElements.get(route)
    if (!elements || !this.options.routeEnterAnimation) return

    return new Promise((resolve) => {
      // Apply enter animation
      const animation = this.createRouteAnimation(
        elements,
        this.options.routeEnterAnimation!,
        this.options.routeTransitionDuration || 300,
        this.options.routeTransitionEasing || 'easeInOut'
      )

      animation.onfinish = () => resolve()
    })
  }

  private async animateSharedElements(): Promise<void> {
    const sharedElements = Array.from(this.sharedElements.values()).flat()
    if (sharedElements.length === 0) return

    return new Promise((resolve) => {
      // Animate shared elements with FLIP technique
      sharedElements.forEach(element => {
        const rect = element.getBoundingClientRect()
        const transform = `translate(${rect.left}px, ${rect.top}px) scale(${rect.width / rect.width}, ${rect.height / rect.height})`
        
        element.style.transform = transform
        element.style.transition = 'none'
        
        requestAnimationFrame(() => {
          element.style.transform = ''
          element.style.transition = `transform ${this.options.routeTransitionDuration || 300}ms ${this.options.routeTransitionEasing || 'easeInOut'}`
        })
      })

      setTimeout(resolve, this.options.routeTransitionDuration || 300)
    })
  }

  private createRouteAnimation(
    element: HTMLElement,
    animation: any,
    duration: number,
    easing: string
  ): Animation {
    const keyframes = this.convertToKeyframes(animation)
    return element.animate(keyframes, {
      duration,
      easing,
      fill: 'forwards'
    })
  }

  private convertToKeyframes(animation: any): Keyframe[] {
    // Convert motionone animation to web animation keyframes
    if (typeof animation === 'object') {
      return [
        { ...animation.initial || {} },
        { ...animation.animate || {} }
      ]
    }
    return []
  }

  registerRouteElement(route: string, element: HTMLElement) {
    this.transitionElements.set(route, element)
  }

  unregisterRouteElement(route: string) {
    this.transitionElements.delete(route)
  }

  registerSharedElement(selector: string, element: HTMLElement) {
    const elements = this.sharedElements.get(selector) || []
    elements.push(element)
    this.sharedElements.set(selector, elements)
  }

  unregisterSharedElement(selector: string, element: HTMLElement) {
    const elements = this.sharedElements.get(selector) || []
    const index = elements.indexOf(element)
    if (index > -1) {
      elements.splice(index, 1)
      this.sharedElements.set(selector, elements)
    }
  }

  getState(): IntegrationState {
    return { ...this.state }
  }

  getPreviousRoute(): string | null {
    return this.previousRoute
  }

  destroy() {
    this.transitionElements.clear()
    this.sharedElements.clear()
  }
}

export function createRouterIntegration(options?: RouterIntegrationOptions): RouterIntegrationManager {
  return new RouterIntegrationManager(options)
}

export function createRouterIntegrationEffect(
  element: () => HTMLElement | null,
  route: string,
  options: RouterIntegrationOptions
) {
  let manager: RouterIntegrationManager | null = null

  createEffect(() => {
    const el = element()
    if (el && options.routeTransition) {
      if (!manager) {
        manager = createRouterIntegration(options)
      }
      manager.registerRouteElement(route, el)
    }
  })

  onCleanup(() => {
    if (manager) {
      manager.unregisterRouteElement(route)
    }
  })

  return manager
}

// SolidJS Router Integration Helpers
export function createRouteTransition(
  route: string,
  options: RouterIntegrationOptions = {}
) {
  const manager = createRouterIntegration(options)
  
  return {
    manager,
    registerElement: (element: HTMLElement) => manager.registerRouteElement(route, element),
    unregisterElement: () => manager.unregisterRouteElement(route),
    transitionTo: (newRoute: string) => manager.transitionToRoute(newRoute),
    getState: () => manager.getState()
  }
}

export function createSharedElementTransition(
  selector: string,
  options: RouterIntegrationOptions = {}
) {
  const manager = createRouterIntegration(options)
  
  return {
    manager,
    registerElement: (element: HTMLElement) => manager.registerSharedElement(selector, element),
    unregisterElement: (element: HTMLElement) => manager.unregisterSharedElement(selector, element),
    getState: () => manager.getState()
  }
}
