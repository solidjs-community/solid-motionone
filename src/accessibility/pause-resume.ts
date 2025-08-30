import { createSignal, createEffect, onCleanup } from 'solid-js'
import type { AccessibilityOptions, AccessibilityState } from '../types.js'

/**
 * Accessibility Manager for Animation Pause/Resume
 * Handles user preferences and accessibility features
 */
export class AccessibilityManager {
	private state: AccessibilityState
	private options: AccessibilityOptions
	private element: HTMLElement | null = null
	private mediaQuery: MediaQueryList | null = null
	private eventListeners: Array<() => void> = []

	constructor(options: AccessibilityOptions = {}) {
		this.options = {
			pauseOnFocus: false,
			resumeOnBlur: false,
			pauseOnHover: false,
			respectReducedMotion: true,
			reducedMotionAnimation: { opacity: 1 },
			manualPause: false,
			manualResume: false,
			...options
		}

		this.state = {
			isPaused: false,
			prefersReducedMotion: false,
			hasFocus: false,
			isHovering: false
		}

		this.initialize()
	}

	/**
	 * Initialize accessibility manager
	 */
	private initialize() {
		// Check for reduced motion preference
		this.checkReducedMotionPreference()

		// Setup media query listener
		if (this.options.respectReducedMotion) {
			this.setupReducedMotionListener()
		}
	}

	/**
	 * Check for reduced motion preference
	 */
	private checkReducedMotionPreference() {
		if (typeof window !== 'undefined' && window.matchMedia) {
			this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
			this.state.prefersReducedMotion = this.mediaQuery.matches
		}
	}

	/**
	 * Setup reduced motion media query listener
	 */
	private setupReducedMotionListener() {
		if (!this.mediaQuery) return

		const handleChange = (event: MediaQueryListEvent) => {
			this.state.prefersReducedMotion = event.matches
			this.onReducedMotionChange(event.matches)
		}

		this.mediaQuery.addEventListener('change', handleChange)
		this.eventListeners.push(() => {
			this.mediaQuery?.removeEventListener('change', handleChange)
		})
	}

	/**
	 * Handle reduced motion preference change
	 */
	private onReducedMotionChange(prefersReducedMotion: boolean) {
		if (prefersReducedMotion) {
			this.pause()
		} else {
			this.resume()
		}
	}

	/**
	 * Attach to element
	 */
	attach(element: HTMLElement) {
		this.element = element
		this.setupEventListeners()
	}

	/**
	 * Setup event listeners for accessibility features
	 */
	private setupEventListeners() {
		if (!this.element) return

		// Focus/blur events
		if (this.options.pauseOnFocus || this.options.resumeOnBlur) {
			const handleFocus = () => {
				this.state.hasFocus = true
				if (this.options.pauseOnFocus) {
					this.pause()
				}
			}

			const handleBlur = () => {
				this.state.hasFocus = false
				if (this.options.resumeOnBlur) {
					this.resume()
				}
			}

			this.element.addEventListener('focus', handleFocus)
			this.element.addEventListener('blur', handleBlur)

			this.eventListeners.push(() => {
				this.element?.removeEventListener('focus', handleFocus)
				this.element?.removeEventListener('blur', handleBlur)
			})
		}

		// Hover events
		if (this.options.pauseOnHover) {
			const handleMouseEnter = () => {
				this.state.isHovering = true
				this.pause()
			}

			const handleMouseLeave = () => {
				this.state.isHovering = false
				this.resume()
			}

			this.element.addEventListener('mouseenter', handleMouseEnter)
			this.element.addEventListener('mouseleave', handleMouseLeave)

			this.eventListeners.push(() => {
				this.element?.removeEventListener('mouseenter', handleMouseEnter)
				this.element?.removeEventListener('mouseleave', handleMouseLeave)
			})
		}
	}

	/**
	 * Pause animations
	 */
	pause() {
		if (this.state.isPaused) return

		this.state.isPaused = true
		this.applyReducedMotionAnimation()
		this.dispatchEvent('pause')
	}

	/**
	 * Resume animations
	 */
	resume() {
		if (!this.state.isPaused) return

		this.state.isPaused = false
		this.removeReducedMotionAnimation()
		this.dispatchEvent('resume')
	}

	/**
	 * Apply reduced motion animation
	 */
	private applyReducedMotionAnimation() {
		if (!this.element || !this.options.reducedMotionAnimation) return

		// Apply the reduced motion animation immediately
		Object.entries(this.options.reducedMotionAnimation).forEach(([property, value]) => {
			;(this.element as any).style[property] = value
		})
	}

	/**
	 * Remove reduced motion animation
	 */
	private removeReducedMotionAnimation() {
		if (!this.element || !this.options.reducedMotionAnimation) return

		// Remove the reduced motion animation styles
		Object.keys(this.options.reducedMotionAnimation).forEach(property => {
			;(this.element as any).style[property] = ''
		})
	}

	/**
	 * Check if animations should be paused
	 */
	shouldPause(): boolean {
		return this.state.isPaused || 
			   (!!this.options.respectReducedMotion && this.state.prefersReducedMotion)
	}

	/**
	 * Get accessibility state
	 */
	getState(): AccessibilityState {
		return { ...this.state }
	}

	/**
	 * Dispatch accessibility event
	 */
	private dispatchEvent(type: 'pause' | 'resume') {
		if (!this.element) return

		const event = new CustomEvent(`accessibility-${type}`, {
			detail: { state: this.getState() },
			bubbles: true
		})

		this.element.dispatchEvent(event)
	}

	/**
	 * Manual pause
	 */
	manualPause() {
		if (this.options.manualPause) {
			this.pause()
		}
	}

	/**
	 * Manual resume
	 */
	manualResume() {
		if (this.options.manualResume) {
			this.resume()
		}
	}

	/**
	 * Destroy accessibility manager
	 */
	destroy() {
		this.eventListeners.forEach(cleanup => cleanup())
		this.eventListeners = []
		this.element = null
	}
}

/**
 * Create accessibility manager
 */
export function createAccessibilityManager(options?: AccessibilityOptions): AccessibilityManager {
	return new AccessibilityManager(options)
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
	if (typeof window !== 'undefined' && window.matchMedia) {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches
	}
	return false
}

/**
 * Create accessibility effect for SolidJS
 */
export function createAccessibilityEffect(
	element: () => HTMLElement | null,
	options?: AccessibilityOptions
) {
	const manager = createAccessibilityManager(options)

	createEffect(() => {
		const el = element()
		if (el) {
			manager.attach(el)
		}
	})

	onCleanup(() => {
		manager.destroy()
	})

	return manager
}
