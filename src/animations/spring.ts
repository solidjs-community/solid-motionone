import type { SpringConfig } from "../types.js"

// Default spring configuration
const DEFAULT_SPRING_CONFIG: Required<SpringConfig> = {
	stiffness: 100,
	damping: 10,
	mass: 1,
	restDelta: 0.01,
	restSpeed: 0.01,
}

// Spring physics calculation
export class SpringPhysics {
	private config: Required<SpringConfig>
	private velocity = 0
	private position = 0
	private target = 0
	private isActive = false

	constructor(config: SpringConfig = {}) {
		this.config = { ...DEFAULT_SPRING_CONFIG, ...config }
	}

	setTarget(target: number) {
		this.target = target
		this.isActive = true
	}

	setPosition(position: number) {
		this.position = position
	}

	setVelocity(velocity: number) {
		this.velocity = velocity
	}

	update(deltaTime: number): { position: number; velocity: number; isComplete: boolean } {
		if (!this.isActive) {
			return { position: this.position, velocity: this.velocity, isComplete: true }
		}

		const { stiffness, damping, mass, restDelta, restSpeed } = this.config

		// Spring force calculation
		const displacement = this.target - this.position
		const springForce = stiffness * displacement
		const dampingForce = damping * this.velocity
		const totalForce = springForce - dampingForce

		// Acceleration = force / mass
		const acceleration = totalForce / mass

		// Update velocity and position using Euler integration
		this.velocity += acceleration * deltaTime
		this.position += this.velocity * deltaTime

		// Check if spring has settled
		const isAtRest = Math.abs(displacement) < restDelta && Math.abs(this.velocity) < restSpeed

		if (isAtRest) {
			this.isActive = false
			this.position = this.target
			this.velocity = 0
		}

		return {
			position: this.position,
			velocity: this.velocity,
			isComplete: !this.isActive,
		}
	}

	reset() {
		this.velocity = 0
		this.isActive = false
	}
}

// Multi-dimensional spring system
export class MultiSpringPhysics {
	private springs: Map<string, SpringPhysics> = new Map()
	private config: Required<SpringConfig>

	constructor(config: SpringConfig = {}) {
		this.config = { ...DEFAULT_SPRING_CONFIG, ...config }
	}

	setTarget(property: string, target: number) {
		if (!this.springs.has(property)) {
			this.springs.set(property, new SpringPhysics(this.config))
		}
		this.springs.get(property)!.setTarget(target)
	}

	setPosition(property: string, position: number) {
		if (!this.springs.has(property)) {
			this.springs.set(property, new SpringPhysics(this.config))
		}
		this.springs.get(property)!.setPosition(position)
	}

	update(deltaTime: number): { [key: string]: number } {
		const result: { [key: string]: number } = {}
		let allComplete = true

		for (const [property, spring] of this.springs) {
			const update = spring.update(deltaTime)
			result[property] = update.position
			if (!update.isComplete) {
				allComplete = false
			}
		}

		return result
	}

			isComplete(): boolean {
			for (const spring of this.springs.values()) {
				if ((spring as any).isActive) return false
			}
			return true
		}

	reset() {
		for (const spring of this.springs.values()) {
			spring.reset()
		}
	}
}

// Spring animation controller
export class SpringAnimationController {
	private physics: MultiSpringPhysics
	private startTime: number = 0
	private isRunning = false
	private onUpdate?: (values: { [key: string]: number }) => void
	private onComplete?: () => void

	constructor(config: SpringConfig = {}) {
		this.physics = new MultiSpringPhysics(config)
	}

	animate(
		from: { [key: string]: number },
		to: { [key: string]: number },
		onUpdate?: (values: { [key: string]: number }) => void,
		onComplete?: () => void
	) {
		this.onUpdate = onUpdate
		this.onComplete = onComplete
		this.startTime = performance.now()
		this.isRunning = true

		// Set initial positions
		for (const [property, value] of Object.entries(from)) {
			this.physics.setPosition(property, value)
		}

		// Set target positions
		for (const [property, value] of Object.entries(to)) {
			this.physics.setTarget(property, value)
		}

		this.animateFrame()
	}

	private animateFrame = () => {
		if (!this.isRunning) return

		const currentTime = performance.now()
		const deltaTime = (currentTime - this.startTime) / 1000 // Convert to seconds
		this.startTime = currentTime

		const values = this.physics.update(deltaTime)
		this.onUpdate?.(values)

		if (this.physics.isComplete()) {
			this.isRunning = false
			this.onComplete?.()
		} else {
			requestAnimationFrame(this.animateFrame)
		}
	}

	stop() {
		this.isRunning = false
	}

	reset() {
		this.isRunning = false
		this.physics.reset()
	}
}

// Utility functions for common spring configurations
export const springPresets = {
	gentle: { stiffness: 50, damping: 15 },
	bouncy: { stiffness: 200, damping: 8 },
	stiff: { stiffness: 300, damping: 20 },
	slow: { stiffness: 30, damping: 12 },
	fast: { stiffness: 400, damping: 25 },
}

// Create spring configuration from preset or custom values
export function createSpringConfig(
	preset?: keyof typeof springPresets | SpringConfig
): SpringConfig {
	if (typeof preset === "string" && preset in springPresets) {
		return springPresets[preset as keyof typeof springPresets]
	}
	return (preset as SpringConfig) || {}
}

// Spring easing function for use with motionone
export function createSpringEasing(config: SpringConfig = {}) {
	const springConfig = createSpringConfig(config)
	const physics = new SpringPhysics(springConfig)
	
	return (t: number): number => {
		physics.setPosition(0)
		physics.setTarget(1)
		
		const steps = 60
		const deltaTime = 1 / steps
		
		for (let i = 0; i < steps * t; i++) {
			physics.update(deltaTime)
		}
		
		return (physics as any).position
	}
}
