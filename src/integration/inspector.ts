import { createSignal, createEffect, onCleanup } from 'solid-js'
import type { AnimationInspectorOptions, IntegrationState } from '../types.js'

export class AnimationInspector {
  private options: AnimationInspectorOptions
  private state: IntegrationState
  private inspectorPanel: HTMLElement | null = null
  private isOpen = false
  private selectedAnimation: any | null = null
  private animationTree: Map<string, any> = new Map()
  private performanceMetrics = {
    fps: 60,
    memoryUsage: 0,
    activeAnimations: 0,
    totalElements: 0
  }

  constructor(options: AnimationInspectorOptions = {}) {
    this.options = {
      inspectorEnabled: true,
      inspectorPosition: 'top-right',
      inspectorSize: 'medium',
      showAnimationTree: true,
      showPerformanceMetrics: true,
      showTimeline: true,
      showProperties: true,
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
    if (this.options.inspectorEnabled) {
      this.createInspectorPanel()
      this.setupPerformanceMonitoring()
      this.setupAnimationTracking()
    }
  }

  private createInspectorPanel() {
    if (typeof document === 'undefined') return

    // Create inspector panel
    this.inspectorPanel = document.createElement('div')
    this.inspectorPanel.id = 'solid-motionone-inspector'
    this.inspectorPanel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 350px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      border-radius: 8px;
      padding: 15px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      z-index: 10000;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: none;
      max-height: 80vh;
      overflow-y: auto;
    `

    // Create header
    const header = document.createElement('div')
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    `
    
    const title = document.createElement('h3')
    title.textContent = '🎬 Animation Inspector'
    title.style.margin = '0'
    title.style.fontSize = '14px'
    title.style.fontWeight = 'bold'
    
    const closeBtn = document.createElement('button')
    closeBtn.textContent = '×'
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    `
    closeBtn.onclick = () => this.close()
    
    header.appendChild(title)
    header.appendChild(closeBtn)
    this.inspectorPanel.appendChild(header)

    // Create content sections
    if (this.options.showPerformanceMetrics) {
      this.createPerformanceSection()
    }
    
    if (this.options.showAnimationTree) {
      this.createAnimationTreeSection()
    }
    
    if (this.options.showTimeline) {
      this.createTimelineSection()
    }
    
    if (this.options.showProperties) {
      this.createPropertiesSection()
    }

    // Add to document
    document.body.appendChild(this.inspectorPanel)
  }

  private createPerformanceSection() {
    if (!this.inspectorPanel) return

    const section = document.createElement('div')
    section.style.marginBottom = '15px'
    
    const title = document.createElement('h4')
    title.textContent = '📊 Performance'
    title.style.margin = '0 0 10px 0'
    title.style.fontSize = '12px'
    title.style.fontWeight = 'bold'
    
    const metrics = document.createElement('div')
    metrics.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      font-size: 11px;
    `
    
    const fpsMetric = this.createMetric('FPS', '60')
    const memoryMetric = this.createMetric('Memory', '0 MB')
    const animationsMetric = this.createMetric('Animations', '0')
    const elementsMetric = this.createMetric('Elements', '0')
    
    metrics.appendChild(fpsMetric)
    metrics.appendChild(memoryMetric)
    metrics.appendChild(animationsMetric)
    metrics.appendChild(elementsMetric)
    
    section.appendChild(title)
    section.appendChild(metrics)
    this.inspectorPanel.appendChild(section)
    
    // Store references for updates
    ;(this.inspectorPanel as any)._fpsMetric = fpsMetric
    ;(this.inspectorPanel as any)._memoryMetric = memoryMetric
    ;(this.inspectorPanel as any)._animationsMetric = animationsMetric
    ;(this.inspectorPanel as any)._elementsMetric = elementsMetric
  }

  private createAnimationTreeSection() {
    if (!this.inspectorPanel) return

    const section = document.createElement('div')
    section.style.marginBottom = '15px'
    
    const title = document.createElement('h4')
    title.textContent = '🌳 Animation Tree'
    title.style.margin = '0 0 10px 0'
    title.style.fontSize = '12px'
    title.style.fontWeight = 'bold'
    
    const tree = document.createElement('div')
    tree.id = 'animation-tree'
    tree.style.cssText = `
      max-height: 200px;
      overflow-y: auto;
      font-size: 11px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      padding: 8px;
    `
    
    section.appendChild(title)
    section.appendChild(tree)
    this.inspectorPanel.appendChild(section)
  }

  private createTimelineSection() {
    if (!this.inspectorPanel) return

    const section = document.createElement('div')
    section.style.marginBottom = '15px'
    
    const title = document.createElement('h4')
    title.textContent = '⏱️ Timeline'
    title.style.margin = '0 0 10px 0'
    title.style.fontSize = '12px'
    title.style.fontWeight = 'bold'
    
    const timeline = document.createElement('div')
    timeline.id = 'animation-timeline'
    timeline.style.cssText = `
      height: 100px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      padding: 8px;
      font-size: 11px;
    `
    
    section.appendChild(title)
    section.appendChild(timeline)
    this.inspectorPanel.appendChild(section)
  }

  private createPropertiesSection() {
    if (!this.inspectorPanel) return

    const section = document.createElement('div')
    section.style.marginBottom = '15px'
    
    const title = document.createElement('h4')
    title.textContent = '⚙️ Properties'
    title.style.margin = '0 0 10px 0'
    title.style.fontSize = '12px'
    title.style.fontWeight = 'bold'
    
    const properties = document.createElement('div')
    properties.id = 'animation-properties'
    properties.style.cssText = `
      max-height: 150px;
      overflow-y: auto;
      font-size: 11px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      padding: 8px;
    `
    
    section.appendChild(title)
    section.appendChild(properties)
    this.inspectorPanel.appendChild(section)
  }

  private createMetric(label: string, value: string) {
    const metric = document.createElement('div')
    metric.style.cssText = `
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
    `
    
    const labelEl = document.createElement('span')
    labelEl.textContent = label
    labelEl.style.opacity = '0.7'
    
    const valueEl = document.createElement('span')
    valueEl.textContent = value
    valueEl.style.fontWeight = 'bold'
    valueEl.style.color = '#4CAF50'
    
    metric.appendChild(labelEl)
    metric.appendChild(valueEl)
    
    return metric
  }

  private setupPerformanceMonitoring() {
    let frameCount = 0
    let lastTime = Date.now()
    
    const measurePerformance = () => {
      frameCount++
      const now = Date.now()
      
      if (now - lastTime >= 1000) {
        this.performanceMetrics.fps = Math.round((frameCount * 1000) / (now - lastTime))
        this.performanceMetrics.memoryUsage = this.getMemoryUsage()
        this.performanceMetrics.activeAnimations = this.animationTree.size
        this.performanceMetrics.totalElements = this.getTotalElements()
        
        this.updatePerformanceDisplay()
        
        frameCount = 0
        lastTime = now
      }
      
      if (this.isOpen) {
        requestAnimationFrame(measurePerformance)
      }
    }
    
    measurePerformance()
  }

  private setupAnimationTracking() {
    // Track animations using MutationObserver
    if (typeof document === 'undefined') return

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.updateAnimationTree()
        }
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    onCleanup(() => {
      observer.disconnect()
    })
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
    }
    return 0
  }

  private getTotalElements(): number {
    if (typeof document === 'undefined') return 0
    return document.querySelectorAll('*').length
  }

  private updatePerformanceDisplay() {
    if (!this.inspectorPanel) return

    const fpsMetric = (this.inspectorPanel as any)._fpsMetric
    const memoryMetric = (this.inspectorPanel as any)._memoryMetric
    const animationsMetric = (this.inspectorPanel as any)._animationsMetric
    const elementsMetric = (this.inspectorPanel as any)._elementsMetric

    if (fpsMetric) {
      const valueEl = fpsMetric.querySelector('span:last-child')
      if (valueEl) {
        valueEl.textContent = this.performanceMetrics.fps.toString()
        valueEl.style.color = this.performanceMetrics.fps < 30 ? '#ff6b6b' : '#4CAF50'
      }
    }

    if (memoryMetric) {
      const valueEl = memoryMetric.querySelector('span:last-child')
      if (valueEl) {
        valueEl.textContent = `${this.performanceMetrics.memoryUsage} MB`
      }
    }

    if (animationsMetric) {
      const valueEl = animationsMetric.querySelector('span:last-child')
      if (valueEl) {
        valueEl.textContent = this.performanceMetrics.activeAnimations.toString()
      }
    }

    if (elementsMetric) {
      const valueEl = elementsMetric.querySelector('span:last-child')
      if (valueEl) {
        valueEl.textContent = this.performanceMetrics.totalElements.toString()
      }
    }
  }

  private updateAnimationTree() {
    if (!this.inspectorPanel) return

    const treeContainer = this.inspectorPanel.querySelector('#animation-tree')
    if (!treeContainer) return

    // Clear existing tree
    treeContainer.innerHTML = ''

    // Build animation tree
    this.animationTree.forEach((animation, id) => {
      const item = document.createElement('div')
      item.style.cssText = `
        padding: 4px 0;
        cursor: pointer;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      `
      
      item.textContent = `${id} - ${animation.type || 'animation'}`
      item.onclick = () => this.selectAnimation(animation)
      
      treeContainer.appendChild(item)
    })
  }

  private selectAnimation(animation: any) {
    this.selectedAnimation = animation
    this.state.selectedAnimation = animation
    
    // Update properties section
    this.updatePropertiesDisplay()
    
    // Trigger selection event
    if (this.options.onAnimationSelect) {
      this.options.onAnimationSelect(animation)
    }
  }

  private updatePropertiesDisplay() {
    if (!this.inspectorPanel) return

    const propertiesContainer = this.inspectorPanel.querySelector('#animation-properties')
    if (!propertiesContainer) return

    propertiesContainer.innerHTML = ''

    if (!this.selectedAnimation) {
      propertiesContainer.textContent = 'No animation selected'
      return
    }

    // Display animation properties
    Object.entries(this.selectedAnimation).forEach(([key, value]) => {
      const property = document.createElement('div')
      property.style.cssText = `
        display: flex;
        justify-content: space-between;
        padding: 2px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      `
      
      const keyEl = document.createElement('span')
      keyEl.textContent = key
      keyEl.style.opacity = '0.7'
      
      const valueEl = document.createElement('span')
      valueEl.textContent = typeof value === 'object' ? JSON.stringify(value) : String(value)
      valueEl.style.fontWeight = 'bold'
      
      property.appendChild(keyEl)
      property.appendChild(valueEl)
      propertiesContainer.appendChild(property)
    })
  }

  open() {
    if (!this.inspectorPanel) return
    
    this.isOpen = true
    this.state.inspectorOpen = true
    this.inspectorPanel.style.display = 'block'
    
    // Trigger open event
    if (this.options.onInspectorOpen) {
      this.options.onInspectorOpen()
    }
  }

  close() {
    if (!this.inspectorPanel) return
    
    this.isOpen = false
    this.state.inspectorOpen = false
    this.inspectorPanel.style.display = 'none'
    
    // Trigger close event
    if (this.options.onInspectorClose) {
      this.options.onInspectorClose()
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  registerAnimation(id: string, animation: any) {
    this.animationTree.set(id, animation)
    this.updateAnimationTree()
  }

  unregisterAnimation(id: string) {
    this.animationTree.delete(id)
    this.updateAnimationTree()
  }

  getState(): IntegrationState {
    return { ...this.state }
  }

  getPerformanceMetrics() {
    return { ...this.performanceMetrics }
  }

  getSelectedAnimation() {
    return this.selectedAnimation
  }

  destroy() {
    if (this.inspectorPanel && this.inspectorPanel.parentNode) {
      this.inspectorPanel.parentNode.removeChild(this.inspectorPanel)
    }
    
    this.inspectorPanel = null
    this.animationTree.clear()
    this.selectedAnimation = null
    this.isOpen = false
  }
}

export function createAnimationInspector(options?: AnimationInspectorOptions): AnimationInspector {
  return new AnimationInspector(options)
}

export function createAnimationInspectorEffect(
  element: () => HTMLElement | null,
  options: AnimationInspectorOptions
) {
  let inspector: AnimationInspector | null = null

  createEffect(() => {
    const el = element()
    if (el && options.inspectorEnabled) {
      if (!inspector) {
        inspector = createAnimationInspector(options)
      }
    }
  })

  onCleanup(() => {
    if (inspector) {
      inspector.destroy()
      inspector = null
    }
  })

  return inspector
}

// Animation Inspector Helpers
export function createInspectorToggle(options: AnimationInspectorOptions = {}) {
  const inspector = createAnimationInspector(options)
  
  return {
    inspector,
    toggle: () => inspector.toggle(),
    open: () => inspector.open(),
    close: () => inspector.close(),
    getState: () => inspector.getState()
  }
}

// Global inspector instance
let globalInspector: AnimationInspector | null = null

export function getGlobalInspector(options?: AnimationInspectorOptions): AnimationInspector {
  if (!globalInspector) {
    globalInspector = createAnimationInspector(options)
  }
  return globalInspector
}

export function toggleGlobalInspector() {
  const inspector = getGlobalInspector()
  inspector.toggle()
}

// Keyboard shortcut to toggle inspector (Ctrl+Shift+I)
if (typeof document !== 'undefined') {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault()
      toggleGlobalInspector()
    }
  })
}
