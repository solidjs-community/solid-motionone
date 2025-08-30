import { createSignal, createEffect, onCleanup } from 'solid-js'
import type { DebugOptions, DebugState, PerformanceMetrics, TimelineEntry, DebugEvent } from '../types.js'

/**
 * Core Animation Debugger
 * Provides real-time debugging capabilities for animations
 */
export class AnimationDebugger {
	private state: DebugState
	private options: DebugOptions
	private frameCount = 0
	private lastFrameTime = 0
	private animationCount = 0
	private timeline: TimelineEntry[] = []
	private eventListeners: Array<() => void> = []

	constructor(options: DebugOptions = {}) {
		this.options = {
			showTimeline: true,
			showValues: true,
			showPerformance: true,
			logLevel: 'info',
			enableConsole: true,
			enablePanel: true,
			panelPosition: 'top-right',
			...options
		}

		this.state = {
			isEnabled: false,
			element: null,
			animationValues: {},
			performanceMetrics: {
				fps: 0,
				memoryUsage: 0,
				animationCount: 0,
				lastUpdateTime: 0
			},
			timeline: [],
			isPaused: false
		}

		this.initialize()
	}

	/**
	 * Initialize the debugger
	 */
	private initialize() {
		if (this.options.enableConsole) {
			this.setupConsoleLogging()
		}

		if (this.options.enablePanel) {
			this.createDebugPanel()
		}

		if (this.options.showPerformance) {
			this.startPerformanceMonitoring()
		}

		this.state.isEnabled = true
		this.log('debug', 'Animation Debugger initialized')
	}

	/**
	 * Setup console logging
	 */
	private setupConsoleLogging() {
		// Override console methods to capture debug logs
		const originalLog = console.log
		const originalWarn = console.warn
		const originalError = console.error

		console.log = (...args) => {
			originalLog(...args)
			this.log('info', args.join(' '))
		}

		console.warn = (...args) => {
			originalWarn(...args)
			this.log('warn', args.join(' '))
		}

		console.error = (...args) => {
			originalError(...args)
			this.log('error', args.join(' '))
		}
	}

	/**
	 * Create debug panel
	 */
	private createDebugPanel() {
		const panel = document.createElement('div')
		panel.id = 'solid-motionone-debug-panel'
		panel.style.cssText = `
			position: fixed;
			${this.options.panelPosition?.includes('top') ? 'top: 10px;' : 'bottom: 10px;'}
			${this.options.panelPosition?.includes('right') ? 'right: 10px;' : 'left: 10px;'}
			background: rgba(0, 0, 0, 0.9);
			color: white;
			padding: 10px;
			border-radius: 5px;
			font-family: monospace;
			font-size: 12px;
			z-index: 10000;
			min-width: 200px;
			max-height: 300px;
			overflow-y: auto;
		`

		document.body.appendChild(panel)
		this.updateDebugPanel()
	}

	/**
	 * Update debug panel content
	 */
	private updateDebugPanel() {
		const panel = document.getElementById('solid-motionone-debug-panel')
		if (!panel) return

		let content = '<div style="margin-bottom: 10px;"><strong>Animation Debugger</strong></div>'

		if (this.options.showPerformance) {
			content += `
				<div style="margin-bottom: 5px;">
					<strong>Performance:</strong><br>
					FPS: ${this.state.performanceMetrics.fps}<br>
					Memory: ${(this.state.performanceMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB<br>
					Animations: ${this.state.performanceMetrics.animationCount}
				</div>
			`
		}

		if (this.options.showValues && Object.keys(this.state.animationValues).length > 0) {
			content += '<div style="margin-bottom: 5px;"><strong>Values:</strong></div>'
			Object.entries(this.state.animationValues).forEach(([key, value]) => {
				content += `<div>${key}: ${JSON.stringify(value)}</div>`
			})
		}

		if (this.options.showTimeline && this.timeline.length > 0) {
			content += '<div style="margin-bottom: 5px;"><strong>Timeline:</strong></div>'
			const recentEvents = this.timeline.slice(-5)
			recentEvents.forEach(event => {
				content += `<div>${event.type}: ${event.property || ''}</div>`
			})
		}

		panel.innerHTML = content
	}

	/**
	 * Start performance monitoring
	 */
	private startPerformanceMonitoring() {
		let lastTime = performance.now()
		let frames = 0

		const measurePerformance = () => {
			const currentTime = performance.now()
			frames++

			if (currentTime - lastTime >= 1000) {
				this.state.performanceMetrics.fps = Math.round((frames * 1000) / (currentTime - lastTime))
				this.state.performanceMetrics.animationCount = this.animationCount
				this.state.performanceMetrics.lastUpdateTime = currentTime

				// Estimate memory usage (rough approximation)
				if ('memory' in performance) {
					this.state.performanceMetrics.memoryUsage = (performance as any).memory.usedJSHeapSize
				}

				frames = 0
				lastTime = currentTime

				this.updateDebugPanel()
			}

			requestAnimationFrame(measurePerformance)
		}

		requestAnimationFrame(measurePerformance)
	}

	/**
	 * Log debug message
	 */
	private log(level: 'debug' | 'info' | 'warn' | 'error', message: string) {
		if (this.options.logLevel === 'debug' || 
			(level === 'info' && this.options.logLevel === 'info') ||
			(level === 'warn' && ['info', 'warn'].includes(this.options.logLevel || '')) ||
			(level === 'error' && ['info', 'warn', 'error'].includes(this.options.logLevel || ''))) {
			
			console.log(`[Animation Debug] ${message}`)
		}
	}

	/**
	 * Track animation start
	 */
	trackAnimationStart(element: HTMLElement, animation: any) {
		this.animationCount++
		this.state.element = element

		const event: TimelineEntry = {
			id: `anim-${Date.now()}-${Math.random()}`,
			timestamp: performance.now(),
			type: 'start',
			property: animation.property,
			value: animation.value
		}

		this.timeline.push(event)
		this.log('info', `Animation started: ${animation.property} = ${animation.value}`)
		this.updateDebugPanel()
	}

	/**
	 * Track animation update
	 */
	trackAnimationUpdate(element: HTMLElement, property: string, value: any) {
		this.state.animationValues[property] = value

		const event: TimelineEntry = {
			id: `update-${Date.now()}-${Math.random()}`,
			timestamp: performance.now(),
			type: 'update',
			property,
			value
		}

		this.timeline.push(event)
		this.log('debug', `Animation update: ${property} = ${value}`)
		this.updateDebugPanel()
	}

	/**
	 * Track animation complete
	 */
	trackAnimationComplete(element: HTMLElement, animation: any, duration: number) {
		this.animationCount = Math.max(0, this.animationCount - 1)

		const event: TimelineEntry = {
			id: `complete-${Date.now()}-${Math.random()}`,
			timestamp: performance.now(),
			type: 'complete',
			property: animation.property,
			value: animation.value,
			duration
		}

		this.timeline.push(event)
		this.log('info', `Animation completed: ${animation.property} in ${duration}ms`)
		this.updateDebugPanel()
	}

	/**
	 * Pause debugger
	 */
	pause() {
		this.state.isPaused = true
		this.log('info', 'Debugger paused')
	}

	/**
	 * Resume debugger
	 */
	resume() {
		this.state.isPaused = false
		this.log('info', 'Debugger resumed')
	}

	/**
	 * Get debug state
	 */
	getState(): DebugState {
		return { ...this.state }
	}

	/**
	 * Get timeline
	 */
	getTimeline(): TimelineEntry[] {
		return [...this.timeline]
	}

	/**
	 * Clear timeline
	 */
	clearTimeline() {
		this.timeline = []
		this.state.timeline = []
		this.log('info', 'Timeline cleared')
	}

	/**
	 * Destroy debugger
	 */
	destroy() {
		this.state.isEnabled = false
		
		// Remove debug panel
		const panel = document.getElementById('solid-motionone-debug-panel')
		if (panel) {
			panel.remove()
		}

		// Clean up event listeners
		this.eventListeners.forEach(cleanup => cleanup())
		this.eventListeners = []

		this.log('info', 'Animation Debugger destroyed')
	}
}

/**
 * Create animation debugger
 */
export function createAnimationDebugger(options?: DebugOptions): AnimationDebugger {
	return new AnimationDebugger(options)
}

/**
 * Global debugger instance
 */
let globalDebugger: AnimationDebugger | null = null

/**
 * Get or create global debugger
 */
export function getGlobalDebugger(options?: DebugOptions): AnimationDebugger {
	if (!globalDebugger) {
		globalDebugger = createAnimationDebugger(options)
	}
	return globalDebugger
}

/**
 * Enable global debugging
 */
export function enableDebugging(options?: DebugOptions) {
	globalDebugger = getGlobalDebugger(options)
	return globalDebugger
}

/**
 * Disable global debugging
 */
export function disableDebugging() {
	if (globalDebugger) {
		globalDebugger.destroy()
		globalDebugger = null
	}
}
