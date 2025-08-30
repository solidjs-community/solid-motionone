import type { AnimationPreset, PresetOptions } from '../types.js'

/**
 * Basic Animation Presets
 * Common animation patterns for quick use
 */

export const basicPresets: Record<string, AnimationPreset> = {
	// Fade animations
	fadeIn: {
		name: 'fadeIn',
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: 0.3, ease: 'easeOut' }
	},

	fadeOut: {
		name: 'fadeOut',
		initial: { opacity: 1 },
		animate: { opacity: 0 },
		exit: { opacity: 0 },
		transition: { duration: 0.3, ease: 'easeIn' }
	},

	// Slide animations
	slideInLeft: {
		name: 'slideInLeft',
		initial: { x: -100, opacity: 0 },
		animate: { x: 0, opacity: 1 },
		exit: { x: -100, opacity: 0 },
		transition: { duration: 0.4, ease: 'easeOut' }
	},

	slideInRight: {
		name: 'slideInRight',
		initial: { x: 100, opacity: 0 },
		animate: { x: 0, opacity: 1 },
		exit: { x: 100, opacity: 0 },
		transition: { duration: 0.4, ease: 'easeOut' }
	},

	slideInUp: {
		name: 'slideInUp',
		initial: { y: 100, opacity: 0 },
		animate: { y: 0, opacity: 1 },
		exit: { y: 100, opacity: 0 },
		transition: { duration: 0.4, ease: 'easeOut' }
	},

	slideInDown: {
		name: 'slideInDown',
		initial: { y: -100, opacity: 0 },
		animate: { y: 0, opacity: 1 },
		exit: { y: -100, opacity: 0 },
		transition: { duration: 0.4, ease: 'easeOut' }
	},

	// Scale animations
	scaleIn: {
		name: 'scaleIn',
		initial: { scale: 0, opacity: 0 },
		animate: { scale: 1, opacity: 1 },
		exit: { scale: 0, opacity: 0 },
		transition: { duration: 0.3, ease: 'easeOut' }
	},

	scaleOut: {
		name: 'scaleOut',
		initial: { scale: 1, opacity: 1 },
		animate: { scale: 0, opacity: 0 },
		exit: { scale: 0, opacity: 0 },
		transition: { duration: 0.3, ease: 'easeIn' }
	},

	// Bounce animations
	bounce: {
		name: 'bounce',
		initial: { scale: 0.3, opacity: 0 },
		animate: { 
			scale: [0.3, 1.1, 0.9, 1.03, 0.97, 1],
			opacity: [0, 1, 1, 1, 1, 1]
		},
		exit: { scale: 0.3, opacity: 0 },
		transition: { 
			duration: 0.6,
			ease: [0.175, 0.885, 0.32, 1.275]
		}
	},

	bounceIn: {
		name: 'bounceIn',
		initial: { scale: 0.3, opacity: 0 },
		animate: { 
			scale: [0.3, 1.1, 0.9, 1.03, 0.97, 1],
			opacity: [0, 1, 1, 1, 1, 1]
		},
		exit: { scale: 0.3, opacity: 0 },
		transition: { 
			duration: 0.6,
			ease: [0.175, 0.885, 0.32, 1.275]
		}
	},

	// Flip animations
	flipInX: {
		name: 'flipInX',
		initial: { rotateX: 90, opacity: 0 },
		animate: { rotateX: 0, opacity: 1 },
		exit: { rotateX: -90, opacity: 0 },
		transition: { duration: 0.6, ease: 'easeOut' }
	},

	flipInY: {
		name: 'flipInY',
		initial: { rotateY: 90, opacity: 0 },
		animate: { rotateY: 0, opacity: 1 },
		exit: { rotateY: -90, opacity: 0 },
		transition: { duration: 0.6, ease: 'easeOut' }
	},

	// Zoom animations
	zoomIn: {
		name: 'zoomIn',
		initial: { scale: 0.3, opacity: 0 },
		animate: { scale: 1, opacity: 1 },
		exit: { scale: 0.3, opacity: 0 },
		transition: { duration: 0.3, ease: 'easeOut' }
	},

	zoomOut: {
		name: 'zoomOut',
		initial: { scale: 1, opacity: 1 },
		animate: { scale: 0.3, opacity: 0 },
		exit: { scale: 0.3, opacity: 0 },
		transition: { duration: 0.3, ease: 'easeIn' }
	},

	// Attention animations
	shake: {
		name: 'shake',
		initial: { x: 0 },
		animate: { 
			x: [0, -10, 10, -10, 10, -10, 10, 0]
		},
		exit: { x: 0 },
		transition: { duration: 0.5, ease: 'easeInOut' }
	},

	pulse: {
		name: 'pulse',
		initial: { scale: 1 },
		animate: { 
			scale: [1, 1.05, 1]
		},
		exit: { scale: 1 },
		transition: { duration: 0.6, ease: 'easeInOut' }
	},

	wiggle: {
		name: 'wiggle',
		initial: { rotate: 0 },
		animate: { 
			rotate: [0, -3, 3, -3, 3, -3, 3, 0]
		},
		exit: { rotate: 0 },
		transition: { duration: 0.6, ease: 'easeInOut' }
	},

	// Stagger animations
	staggerIn: {
		name: 'staggerIn',
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 },
		transition: { duration: 0.3, ease: 'easeOut' }
	},

	staggerOut: {
		name: 'staggerOut',
		initial: { opacity: 1, y: 0 },
		animate: { opacity: 0, y: -20 },
		exit: { opacity: 0, y: -20 },
		transition: { duration: 0.3, ease: 'easeIn' }
	}
}

/**
 * Apply preset options to animation preset
 */
export function applyPresetOptions(
	preset: AnimationPreset, 
	options: PresetOptions = {}
): AnimationPreset {
	const { intensity = 1, duration, easing, delay, stagger } = options

	// Create a copy of the preset
	const modifiedPreset = { ...preset }

	// Apply intensity scaling
	if (intensity !== 1) {
		if (modifiedPreset.initial) {
			modifiedPreset.initial = scaleValues(modifiedPreset.initial, intensity)
		}
		if (modifiedPreset.animate) {
			modifiedPreset.animate = scaleValues(modifiedPreset.animate, intensity)
		}
		if (modifiedPreset.exit) {
			modifiedPreset.exit = scaleValues(modifiedPreset.exit, intensity)
		}
	}

	// Apply custom duration
	if (duration !== undefined) {
		if (!modifiedPreset.transition) {
			modifiedPreset.transition = {}
		}
		modifiedPreset.transition.duration = duration
	}

	// Apply custom easing
	if (easing !== undefined) {
		if (!modifiedPreset.transition) {
			modifiedPreset.transition = {}
		}
		modifiedPreset.transition.ease = easing
	}

	// Apply custom delay
	if (delay !== undefined) {
		if (!modifiedPreset.transition) {
			modifiedPreset.transition = {}
		}
		modifiedPreset.transition.delay = delay
	}

	// Apply stagger
	if (stagger !== undefined) {
		if (!modifiedPreset.transition) {
			modifiedPreset.transition = {}
		}
		modifiedPreset.transition.stagger = stagger
	}

	return modifiedPreset
}

/**
 * Scale animation values by intensity
 */
function scaleValues(values: any, intensity: number): any {
	if (typeof values === 'object' && values !== null) {
		const scaled: any = {}
		for (const [key, value] of Object.entries(values)) {
			if (typeof value === 'number') {
				// Scale numeric values
				scaled[key] = value * intensity
			} else if (Array.isArray(value)) {
				// Scale array values
				scaled[key] = value.map(v => typeof v === 'number' ? v * intensity : v)
			} else {
				// Keep non-numeric values unchanged
				scaled[key] = value
			}
		}
		return scaled
	}
	return values
}

/**
 * Get preset by name
 */
export function getPreset(name: string): AnimationPreset | null {
	return basicPresets[name] || null
}

/**
 * Get all preset names
 */
export function getPresetNames(): string[] {
	return Object.keys(basicPresets)
}

/**
 * Create custom preset
 */
export function createPreset(
	name: string,
	initial?: any,
	animate?: any,
	exit?: any,
	transition?: any
): AnimationPreset {
	return {
		name,
		initial,
		animate,
		exit,
		transition
	}
}
