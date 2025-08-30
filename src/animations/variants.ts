import type { AnimationVariant, VariantsOptions } from "../types.js"

// Variant state
export interface VariantState {
	currentVariant: string | null
	previousVariant: string | null
	isAnimating: boolean
	custom: any
}

// Variant controller
export class VariantController {
	private variants: Record<string, AnimationVariant> = {}
	private currentVariant: string | null = null
	private custom: any = null
	private onVariantChange?: (variant: string, config: AnimationVariant) => void

	constructor(variants?: Record<string, AnimationVariant>) {
		if (variants) {
			this.setVariants(variants)
		}
	}

	setVariants(variants: Record<string, AnimationVariant>) {
		this.variants = { ...variants }
	}

	setCustom(custom: any) {
		this.custom = custom
	}

	getVariant(name: string): AnimationVariant | null {
		return this.variants[name] || null
	}

	getCurrentVariant(): string | null {
		return this.currentVariant
	}

	setVariant(name: string) {
		const variant = this.getVariant(name)
		if (variant) {
			const previousVariant = this.currentVariant
			this.currentVariant = name
			this.onVariantChange?.(name, variant)
			return { variant, previousVariant }
		}
		return null
	}

	setOnVariantChange(callback: (variant: string, config: AnimationVariant) => void) {
		this.onVariantChange = callback
	}

	getState(): VariantState {
		return {
			currentVariant: this.currentVariant,
			previousVariant: null, // Would need to track this
			isAnimating: false, // Would need to track this
			custom: this.custom,
		}
	}
}

// Variant orchestration
export class VariantOrchestrator {
	private controllers: Map<string, VariantController> = new Map()
	private globalVariants: Record<string, AnimationVariant> = {}

	constructor(globalVariants?: Record<string, AnimationVariant>) {
		if (globalVariants) {
			this.globalVariants = globalVariants
		}
	}

	addController(id: string, controller: VariantController) {
		this.controllers.set(id, controller)
	}

	removeController(id: string) {
		this.controllers.delete(id)
	}

	setGlobalVariants(variants: Record<string, AnimationVariant>) {
		this.globalVariants = variants
	}

	// Orchestrate variants across multiple elements
	orchestrate(
		orchestration: {
			[id: string]: {
				variant: string
				delay?: number
				stagger?: number
			}
		}
	) {
		const entries = Object.entries(orchestration)
		
		entries.forEach(([id, config], index) => {
			const controller = this.controllers.get(id)
			if (controller) {
				const delay = config.delay || 0
				const stagger = config.stagger || 0
				const totalDelay = delay + (index * stagger)

				setTimeout(() => {
					controller.setVariant(config.variant)
				}, totalDelay)
			}
		})
	}

	// Set the same variant on all controllers
	setAll(variant: string, delay: number = 0) {
		const controllers = Array.from(this.controllers.values())
		
		controllers.forEach((controller, index) => {
			setTimeout(() => {
				controller.setVariant(variant)
			}, delay + (index * 100))
		})
	}

	// Stagger variants across controllers
	stagger(variants: string[], staggerDelay: number = 100) {
		const controllers = Array.from(this.controllers.values())
		
			controllers.forEach((controller, index) => {
		const variantIndex = index % variants.length
		const variant = variants[variantIndex]
		
		if (variant) {
			setTimeout(() => {
				controller.setVariant(variant)
			}, index * staggerDelay)
		}
	})
	}
}

// Conditional variant system
export class ConditionalVariantSystem {
	private conditions: Map<string, () => boolean> = new Map()
	private variants: Record<string, AnimationVariant> = {}
	private controller: VariantController

	constructor(variants: Record<string, AnimationVariant>) {
		this.variants = variants
		this.controller = new VariantController(variants)
	}

	addCondition(name: string, condition: () => boolean) {
		this.conditions.set(name, condition)
	}

	removeCondition(name: string) {
		this.conditions.delete(name)
	}

	evaluateConditions(): string | null {
		for (const [name, condition] of this.conditions) {
			if (condition()) {
				return name
			}
		}
		return null
	}

	update() {
		const activeVariant = this.evaluateConditions()
		if (activeVariant) {
			this.controller.setVariant(activeVariant)
		}
	}

	getController(): VariantController {
		return this.controller
	}
}

// Variant inheritance system
export class VariantInheritanceSystem {
	private baseVariants: Record<string, AnimationVariant> = {}
	private inheritedVariants: Map<string, Record<string, AnimationVariant>> = new Map()

	constructor(baseVariants: Record<string, AnimationVariant>) {
		this.baseVariants = baseVariants
	}

	// Create inherited variants
	inherit(baseVariant: string, overrides: Record<string, AnimationVariant>): string {
		const inheritedName = `${baseVariant}_inherited_${Date.now()}`
		const baseVariantConfig = this.baseVariants[baseVariant]
		
		if (baseVariantConfig) {
			const inheritedConfig = { ...baseVariantConfig, ...overrides }
			this.inheritedVariants.set(inheritedName, inheritedConfig)
		}
		
		return inheritedName
	}

	// Get inherited variant
	getInheritedVariant(name: string): AnimationVariant | null {
		return this.inheritedVariants.get(name) || null
	}

	// Merge variants
	merge(variants: Record<string, AnimationVariant>): Record<string, AnimationVariant> {
		return { ...this.baseVariants, ...variants }
	}
}

// Utility functions
export function createVariantController(variants?: Record<string, AnimationVariant>): VariantController {
	return new VariantController(variants)
}

export function createVariantOrchestrator(globalVariants?: Record<string, AnimationVariant>): VariantOrchestrator {
	return new VariantOrchestrator(globalVariants)
}

export function createConditionalVariantSystem(variants: Record<string, AnimationVariant>): ConditionalVariantSystem {
	return new ConditionalVariantSystem(variants)
}

export function createVariantInheritanceSystem(baseVariants: Record<string, AnimationVariant>): VariantInheritanceSystem {
	return new VariantInheritanceSystem(baseVariants)
}

// Common variant patterns
export const commonVariants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: { opacity: 1, scale: 1 },
	hover: { scale: 1.05, y: -5 },
	tap: { scale: 0.95 },
	focus: { boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" },
	slideIn: { x: -100, opacity: 0 },
	slideOut: { x: 100, opacity: 0 },
	fadeIn: { opacity: 0 },
	fadeOut: { opacity: 0 },
	scaleIn: { scale: 0, opacity: 0 },
	scaleOut: { scale: 0, opacity: 0 },
	rotateIn: { rotate: -180, opacity: 0 },
	rotateOut: { rotate: 180, opacity: 0 },
}

// Create variants with common patterns
export function createCommonVariants(customVariants: Record<string, AnimationVariant> = {}): Record<string, AnimationVariant> {
	return { ...commonVariants, ...customVariants }
}
