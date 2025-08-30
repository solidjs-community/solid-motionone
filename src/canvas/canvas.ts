import { createSignal, createEffect, onCleanup } from 'solid-js'
import type { CanvasOptions, CanvasState } from '../types.js'

export class CanvasManager {
  private options: CanvasOptions
  private state: CanvasState
  private canvas: HTMLCanvasElement | null = null
  private context: CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext | null = null
  private animationFrameId: number | null = null
  private resizeObserver: ResizeObserver | null = null

  constructor(options: CanvasOptions = {}) {
    this.options = {
      canvasWidth: 800,
      canvasHeight: 600,
      canvasContext: '2d',
      canvasPixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
      canvasAntialias: true,
      canvasAlpha: true,
      canvasDepth: true,
      canvasStencil: false,
      canvasPreserveDrawingBuffer: false,
      canvasPowerPreference: 'default',
      canvasFailIfMajorPerformanceCaveat: false,
      ...options
    }
    
    this.state = {
      canvas: null,
      context: null,
      width: this.options.canvasWidth || 800,
      height: this.options.canvasHeight || 600,
      pixelRatio: this.options.canvasPixelRatio || 1,
      isRendering: false,
      frameCount: 0,
      lastFrameTime: 0
    }
    
    this.initialize()
  }

  private initialize() {
    this.createCanvas()
    this.setupResizeObserver()
    this.startRenderLoop()
  }

  private createCanvas() {
    if (typeof document === 'undefined') return

    this.canvas = document.createElement('canvas')
    this.canvas.width = this.state.width * this.state.pixelRatio
    this.canvas.height = this.state.height * this.state.pixelRatio
    this.canvas.style.width = `${this.state.width}px`
    this.canvas.style.height = `${this.state.height}px`

    // Get context based on type
    const contextType = this.options.canvasContext || '2d'
    
    if (contextType === '2d') {
      this.context = this.canvas.getContext('2d', {
        alpha: this.options.canvasAlpha,
        willReadFrequently: false
      }) as CanvasRenderingContext2D
    } else if (contextType === 'webgl' || contextType === 'webgl2') {
      const glOptions = {
        alpha: this.options.canvasAlpha,
        antialias: this.options.canvasAntialias,
        depth: this.options.canvasDepth,
        stencil: this.options.canvasStencil,
        preserveDrawingBuffer: this.options.canvasPreserveDrawingBuffer,
        powerPreference: this.options.canvasPowerPreference,
        failIfMajorPerformanceCaveat: this.options.canvasFailIfMajorPerformanceCaveat
      }

      if (contextType === 'webgl2') {
        this.context = this.canvas.getContext('webgl2', glOptions) as WebGL2RenderingContext
      } else {
        this.context = this.canvas.getContext('webgl', glOptions) as WebGLRenderingContext
      }
    }

    this.state.canvas = this.canvas
    this.state.context = this.context

    // Call onCanvasReady callback
    if (this.options.onCanvasReady && this.canvas && this.context) {
      this.options.onCanvasReady(this.canvas, this.context)
    }
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined' || !this.canvas) return

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        this.resizeCanvas(width, height)
      }
    })

    this.resizeObserver.observe(this.canvas)
  }

  private resizeCanvas(width: number, height: number) {
    if (!this.canvas) return

    this.state.width = width
    this.state.height = height
    
    this.canvas.width = width * this.state.pixelRatio
    this.canvas.height = height * this.state.pixelRatio
    this.canvas.style.width = `${width}px`
    this.canvas.style.height = `${height}px`

    // Call onCanvasResize callback
    if (this.options.onCanvasResize) {
      this.options.onCanvasResize(width, height)
    }
  }

  private startRenderLoop() {
    if (!this.context) return

    this.state.isRendering = true
    this.state.lastFrameTime = performance.now()

    const render = (currentTime: number) => {
      if (!this.state.isRendering) return

      const deltaTime = currentTime - this.state.lastFrameTime
      this.state.lastFrameTime = currentTime
      this.state.frameCount++

      // Call onCanvasRender callback
      if (this.options.onCanvasRender && this.context) {
        this.options.onCanvasRender(this.context, deltaTime)
      }

      this.animationFrameId = requestAnimationFrame(render)
    }

    this.animationFrameId = requestAnimationFrame(render)
  }

  private stopRenderLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    this.state.isRendering = false
  }

  // Public API
  getCanvas(): HTMLCanvasElement | null {
    return this.canvas
  }

  getContext(): CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext | null {
    return this.context
  }

  getState(): CanvasState {
    return { ...this.state }
  }

  resize(width: number, height: number) {
    this.resizeCanvas(width, height)
  }

  start() {
    if (!this.state.isRendering) {
      this.startRenderLoop()
    }
  }

  stop() {
    this.stopRenderLoop()
  }

  destroy() {
    this.stopRenderLoop()
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas)
    }

    this.canvas = null
    this.context = null
    this.state.canvas = null
    this.state.context = null
  }
}

export function createCanvas(options?: CanvasOptions): CanvasManager {
  return new CanvasManager(options)
}

export function createCanvasEffect(
  element: () => HTMLElement | null,
  options: CanvasOptions
) {
  let manager: CanvasManager | null = null

  createEffect(() => {
    const el = element()
    if (el && options.canvas) {
      if (!manager) {
        manager = createCanvas(options)
      }
      
      // Append canvas to element
      const canvas = manager.getCanvas()
      if (canvas && !canvas.parentNode) {
        el.appendChild(canvas)
      }
    }
  })

  onCleanup(() => {
    if (manager) {
      manager.destroy()
      manager = null
    }
  })

  return manager
}

// Canvas Helpers
export function createCanvas2D(options: CanvasOptions = {}) {
  return createCanvas({ ...options, canvasContext: '2d' })
}

export function createCanvasWebGL(options: CanvasOptions = {}) {
  return createCanvas({ ...options, canvasContext: 'webgl' })
}

export function createCanvasWebGL2(options: CanvasOptions = {}) {
  return createCanvas({ ...options, canvasContext: 'webgl2' })
}
