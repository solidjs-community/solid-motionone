import { createSignal, createEffect, onCleanup } from 'solid-js'
import type { GesturePattern, GestureRecognitionOptions, GestureRecognitionState } from '../types.js'

export class GestureRecognizer {
  private element: HTMLElement
  private options: GestureRecognitionOptions
  private state: GestureRecognitionState
  private eventListeners: Array<() => void> = []
  private longPressTimer: number | null = null
  private doubleTapTimer: number | null = null
  private lastTapTime = 0
  private touchStartTime = 0
  private touchStartPosition = { x: 0, y: 0 }
  private touchStartDistance = 0
  private touchStartAngle = 0
  private isRecognizing = false

  constructor(element: HTMLElement, options: GestureRecognitionOptions) {
    this.element = element
    this.options = {
      enableSwipe: true,
      enableLongPress: true,
      enableDoubleTap: true,
      enablePinch: true,
      enableRotate: true,
      enablePan: true,
      swipeThreshold: 50,
      longPressDuration: 500,
      doubleTapDelay: 300,
      pinchThreshold: 0.1,
      rotateThreshold: 15,
      panThreshold: 10,
      ...options
    }
    
    this.state = {
      isRecognizing: false,
      currentGesture: null,
      progress: 0,
      startTime: 0,
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      distance: 0,
      angle: 0,
      scale: 1,
      rotation: 0
    }
    
    this.initialize()
  }

  private initialize() {
    this.setupEventListeners()
  }

  private setupEventListeners() {
    const element = this.element

    // Touch/Mouse start
    const handleStart = (event: PointerEvent | TouchEvent) => {
      this.touchStartTime = Date.now()
      const point = this.getEventPoint(event)
      this.touchStartPosition = point
      this.state.startPosition = point
      this.state.startTime = this.touchStartTime
      this.state.currentPosition = point
      this.isRecognizing = true

      // Start long press timer
      if (this.options.enableLongPress) {
        this.longPressTimer = window.setTimeout(() => {
          this.recognizeGesture({
            type: 'longPress',
            duration: this.options.longPressDuration
          }, event)
        }, this.options.longPressDuration!)
      }

      // Handle double tap
      if (this.options.enableDoubleTap) {
        const now = Date.now()
        if (now - this.lastTapTime < this.options.doubleTapDelay!) {
          this.recognizeGesture({
            type: 'doubleTap',
            duration: this.options.doubleTapDelay
          }, event)
          this.lastTapTime = 0
        } else {
          this.lastTapTime = now
        }
      }
    }

    // Touch/Mouse move
    const handleMove = (event: PointerEvent | TouchEvent) => {
      if (!this.isRecognizing) return

      const point = this.getEventPoint(event)
      this.state.currentPosition = point
      
      // Calculate velocity
      const deltaTime = Date.now() - this.touchStartTime
      if (deltaTime > 0) {
        this.state.velocity = {
          x: (point.x - this.touchStartPosition.x) / deltaTime,
          y: (point.y - this.touchStartPosition.y) / deltaTime
        }
      }

      // Calculate distance and angle
      this.state.distance = Math.sqrt(
        Math.pow(point.x - this.touchStartPosition.x, 2) + 
        Math.pow(point.y - this.touchStartPosition.y, 2)
      )
      this.state.angle = Math.atan2(
        point.y - this.touchStartPosition.y,
        point.x - this.touchStartPosition.x
      ) * 180 / Math.PI

      // Recognize swipe
      if (this.options.enableSwipe && this.state.distance > this.options.swipeThreshold!) {
        const direction = this.getSwipeDirection(point)
        this.recognizeGesture({
          type: 'swipe',
          direction,
          distance: this.state.distance,
          velocity: Math.sqrt(this.state.velocity.x ** 2 + this.state.velocity.y ** 2)
        }, event)
      }

      // Recognize pan
      if (this.options.enablePan && this.state.distance > this.options.panThreshold!) {
        this.recognizeGesture({
          type: 'pan',
          distance: this.state.distance
        }, event)
      }

      // Handle multi-touch gestures
      if (event instanceof TouchEvent && event.touches.length >= 2) {
        this.handleMultiTouch(event)
      }
    }

    // Touch/Mouse end
    const handleEnd = (event: PointerEvent | TouchEvent) => {
      this.isRecognizing = false
      this.state.isRecognizing = false
      this.state.progress = 0
      
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer)
        this.longPressTimer = null
      }

      if (this.options.onGestureEnd && this.state.currentGesture) {
        this.options.onGestureEnd(this.state.currentGesture, event as PointerEvent)
      }
    }

    // Add event listeners
    element.addEventListener('pointerdown', handleStart as EventListener)
    element.addEventListener('touchstart', handleStart as EventListener)
    element.addEventListener('pointermove', handleMove as EventListener)
    element.addEventListener('touchmove', handleMove as EventListener)
    element.addEventListener('pointerup', handleEnd as EventListener)
    element.addEventListener('touchend', handleEnd as EventListener)

    // Store cleanup functions
    this.eventListeners.push(() => {
      element.removeEventListener('pointerdown', handleStart as EventListener)
      element.removeEventListener('touchstart', handleStart as EventListener)
      element.removeEventListener('pointermove', handleMove as EventListener)
      element.removeEventListener('touchmove', handleMove as EventListener)
      element.removeEventListener('pointerup', handleEnd as EventListener)
      element.removeEventListener('touchend', handleEnd as EventListener)
    })
  }

  private handleMultiTouch(event: TouchEvent) {
    if (event.touches.length < 2) return

    const touch1 = event.touches[0]
    const touch2 = event.touches[1]
    
    if (!touch1 || !touch2) return
    
    const currentDistance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    )
    
    const currentAngle = Math.atan2(
      touch2.clientY - touch1.clientY,
      touch2.clientX - touch1.clientX
    ) * 180 / Math.PI

    if (this.touchStartDistance === 0) {
      this.touchStartDistance = currentDistance
      this.touchStartAngle = currentAngle
      return
    }

    // Calculate scale and rotation
    const scale = currentDistance / this.touchStartDistance
    const rotation = currentAngle - this.touchStartAngle
    
    this.state.scale = scale
    this.state.rotation = rotation

    // Recognize pinch
    if (this.options.enablePinch && Math.abs(scale - 1) > this.options.pinchThreshold!) {
      this.recognizeGesture({
        type: 'pinch',
        threshold: this.options.pinchThreshold
      }, event as any)
    }

    // Recognize rotate
    if (this.options.enableRotate && Math.abs(rotation) > this.options.rotateThreshold!) {
      this.recognizeGesture({
        type: 'rotate',
        threshold: this.options.rotateThreshold
      }, event as any)
    }
  }

  private getEventPoint(event: PointerEvent | TouchEvent): { x: number; y: number } {
    if (event instanceof PointerEvent) {
      return { x: event.clientX, y: event.clientY }
    } else if (event instanceof TouchEvent && event.touches.length > 0 && event.touches[0]) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY }
    }
    return { x: 0, y: 0 }
  }

  private getSwipeDirection(point: { x: number; y: number }): 'up' | 'down' | 'left' | 'right' | 'diagonal' {
    const deltaX = point.x - this.touchStartPosition.x
    const deltaY = point.y - this.touchStartPosition.y
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX > absY) {
      return deltaX > 0 ? 'right' : 'left'
    } else if (absY > absX) {
      return deltaY > 0 ? 'down' : 'up'
    } else {
      return 'diagonal'
    }
  }

  private recognizeGesture(gesture: GesturePattern, event: PointerEvent | TouchEvent) {
    this.state.currentGesture = gesture
    this.state.isRecognizing = true
    this.state.progress = 1

    if (this.options.onGestureStart) {
      this.options.onGestureStart(gesture, event as PointerEvent)
    }

    if (this.options.onGestureUpdate) {
      this.options.onGestureUpdate(gesture, event as PointerEvent, this.state.progress)
    }
  }

  getState(): GestureRecognitionState {
    return { ...this.state }
  }

  destroy() {
    this.eventListeners.forEach(cleanup => cleanup())
    this.eventListeners = []
    
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }
    
    if (this.doubleTapTimer) {
      clearTimeout(this.doubleTapTimer)
      this.doubleTapTimer = null
    }
  }
}

export function createGestureRecognizer(element: HTMLElement, options: GestureRecognitionOptions): GestureRecognizer {
  return new GestureRecognizer(element, options)
}

export function createGestureEffect(element: () => HTMLElement | null, options: GestureRecognitionOptions) {
  let recognizer: GestureRecognizer | null = null

  createEffect(() => {
    const el = element()
    if (el && options.patterns.length > 0) {
      recognizer = createGestureRecognizer(el, options)
    }
  })

  onCleanup(() => {
    if (recognizer) {
      recognizer.destroy()
      recognizer = null
    }
  })

  return recognizer
}
