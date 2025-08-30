import { createSignal, createEffect, onCleanup } from 'solid-js'
import type { ParticleOptions, ParticleState, Particle } from '../types.js'

export class ParticleManager {
  private options: ParticleOptions
  private state: ParticleState
  private particles: Particle[] = []
  private animationFrameId: number | null = null
  private lastTime: number = 0
  private particleIdCounter: number = 0

  constructor(options: ParticleOptions = {}) {
    this.options = {
      particleCount: 100,
      particleSize: 2,
      particleColor: { r: 255, g: 255, b: 255, a: 1 },
      particleVelocity: { x: 0, y: 0, z: 0 },
      particleLife: 2000,
      particleGravity: { x: 0, y: 0.1, z: 0 },
      particleEmission: 'continuous',
      particleEmissionRate: 10,
      particleEmissionBurst: 50,
      ...options
    }
    
    this.state = {
      particles: [],
      emitter: { x: 0, y: 0, z: 0 },
      emissionRate: this.options.particleEmissionRate || 10,
      emissionBurst: this.options.particleEmissionBurst || 50,
      emissionType: this.options.particleEmission || 'continuous',
      gravity: this.options.particleGravity || { x: 0, y: 0.1, z: 0 },
      isEmitting: true,
      particleCount: 0,
      maxParticles: this.options.particleCount || 100
    }
    
    this.initialize()
  }

  private initialize() {
    this.lastTime = performance.now()
    this.startParticleSystem()
  }

  private startParticleSystem() {
    const update = (currentTime: number) => {
      const deltaTime = currentTime - this.lastTime
      this.lastTime = currentTime

      this.updateParticles(deltaTime)
      this.emitParticles(deltaTime)

      this.animationFrameId = requestAnimationFrame(update)
    }

    this.animationFrameId = requestAnimationFrame(update)
  }

  private emitParticles(deltaTime: number) {
    if (!this.state.isEmitting) return

    const maxParticles = this.state.maxParticles
    const currentCount = this.particles.length

    if (currentCount >= maxParticles) return

    let particlesToEmit = 0

    switch (this.state.emissionType) {
      case 'continuous':
        particlesToEmit = Math.floor((this.state.emissionRate * deltaTime) / 1000)
        break
      case 'burst':
        if (currentCount === 0) {
          particlesToEmit = this.state.emissionBurst
        }
        break
      case 'explosion':
        if (currentCount === 0) {
          particlesToEmit = this.state.emissionBurst
        }
        break
    }

    for (let i = 0; i < particlesToEmit && currentCount + i < maxParticles; i++) {
      this.createParticle()
    }
  }

  private createParticle(): Particle {
    const id = ++this.particleIdCounter
    const emitter = this.state.emitter

    // Calculate initial position
    const position = {
      x: emitter.x + (Math.random() - 0.5) * 10,
      y: emitter.y + (Math.random() - 0.5) * 10,
      z: emitter.z + (Math.random() - 0.5) * 10
    }

    // Calculate initial velocity
    let velocity: { x: number; y: number; z: number }
    const velocityConfig = this.options.particleVelocity

    if (typeof velocityConfig === 'object' && 'min' in velocityConfig && 'max' in velocityConfig) {
      velocity = {
        x: this.randomRange(velocityConfig.min.x, velocityConfig.max.x),
        y: this.randomRange(velocityConfig.min.y, velocityConfig.max.y),
        z: this.randomRange(velocityConfig.min.z ?? 0, velocityConfig.max.z ?? 0)
      }
    } else if (typeof velocityConfig === 'object' && 'x' in velocityConfig) {
      velocity = {
        x: velocityConfig.x + (Math.random() - 0.5) * 2,
        y: velocityConfig.y + (Math.random() - 0.5) * 2,
        z: (velocityConfig as any).z ?? 0
      }
    } else {
      velocity = { x: 0, y: 0, z: 0 }
    }

    // Calculate size
    let size: number
    const sizeConfig = this.options.particleSize
    if (typeof sizeConfig === 'object' && 'min' in sizeConfig && 'max' in sizeConfig) {
      size = this.randomRange(sizeConfig.min, sizeConfig.max)
    } else {
      size = (sizeConfig as number) || 2
    }

    // Calculate color
    let color: { r: number; g: number; b: number; a: number }
    const colorConfig = this.options.particleColor
    if (typeof colorConfig === 'string') {
      color = this.parseColor(colorConfig)
    } else if (Array.isArray(colorConfig)) {
      const randomColor = colorConfig[Math.floor(Math.random() * colorConfig.length)]
      color = typeof randomColor === 'string' ? this.parseColor(randomColor) : (randomColor ?? { r: 255, g: 255, b: 255, a: 1 })
    } else {
      color = colorConfig as { r: number; g: number; b: number; a: number } ?? { r: 255, g: 255, b: 255, a: 1 }
    }

    // Calculate life
    let life: number
    const lifeConfig = this.options.particleLife
    if (typeof lifeConfig === 'object' && 'min' in lifeConfig && 'max' in lifeConfig) {
      life = this.randomRange(lifeConfig.min, lifeConfig.max)
    } else {
      life = (lifeConfig as number) || 2000
    }

    const particle: Particle = {
      id,
      position,
      velocity,
      acceleration: { x: 0, y: 0, z: 0 },
      size,
      color,
      life,
      maxLife: life,
      age: 0,
      active: true
    }

    this.particles.push(particle)
    this.state.particles = [...this.particles]
    this.state.particleCount = this.particles.length

    // Call onParticleCreate callback
    if (this.options.onParticleCreate) {
      this.options.onParticleCreate(particle)
    }

    return particle
  }

  private updateParticles(deltaTime: number) {
    const gravity = this.state.gravity

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i]
      
      if (!particle || !particle.active) {
        this.particles.splice(i, 1)
        continue
      }

      // Update age
      particle.age += deltaTime

      // Check if particle is dead
      if (particle.age >= particle.life) {
        particle.active = false
        
        // Call onParticleDestroy callback
        if (this.options.onParticleDestroy) {
          this.options.onParticleDestroy(particle)
        }
        continue
      }

      // Apply gravity
      particle.acceleration.x += gravity.x
      particle.acceleration.y += gravity.y
      particle.acceleration.z += gravity.z

      // Update velocity
      particle.velocity.x += particle.acceleration.x * deltaTime / 1000
      particle.velocity.y += particle.acceleration.y * deltaTime / 1000
      particle.velocity.z += particle.acceleration.z * deltaTime / 1000

      // Update position
      particle.position.x += particle.velocity.x * deltaTime / 1000
      particle.position.y += particle.velocity.y * deltaTime / 1000
      particle.position.z += particle.velocity.z * deltaTime / 1000

      // Update color alpha based on life
      const lifeRatio = 1 - (particle.age / particle.life)
      particle.color.a = lifeRatio

      // Call onParticleUpdate callback
      if (this.options.onParticleUpdate) {
        this.options.onParticleUpdate(particle, deltaTime)
      }
    }

    this.state.particles = [...this.particles]
    this.state.particleCount = this.particles.length
  }

  private randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  private parseColor(colorString: string | undefined): { r: number; g: number; b: number; a: number } {
    // Simple color parsing for hex and rgb
    if (!colorString) {
      return { r: 255, g: 255, b: 255, a: 1 }
    }
    
    if (colorString.startsWith('#')) {
      const hex = colorString.slice(1)
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return { r, g, b, a: 1 }
    } else if (colorString.startsWith('rgb')) {
      const matches = colorString.match(/\d+/g)
      if (matches && matches.length >= 3) {
        const r = parseInt(matches[0] ?? '0')
        const g = parseInt(matches[1] ?? '0')
        const b = parseInt(matches[2] ?? '0')
        const a = matches[3] ? parseInt(matches[3]) / 255 : 1
        return { r, g, b, a }
      }
    }
    
    return { r: 255, g: 255, b: 255, a: 1 }
  }

  // Public API
  setEmitter(x: number, y: number, z: number = 0) {
    this.state.emitter = { x, y, z }
  }

  setEmissionRate(rate: number) {
    this.state.emissionRate = rate
  }

  setEmissionType(type: 'continuous' | 'burst' | 'explosion') {
    this.state.emissionType = type
  }

  setGravity(x: number, y: number, z: number = 0) {
    this.state.gravity = { x, y, z }
  }

  startEmission() {
    this.state.isEmitting = true
  }

  stopEmission() {
    this.state.isEmitting = false
  }

  burst(count: number) {
    const burstCount = Math.min(count, this.state.maxParticles - this.particles.length)
    for (let i = 0; i < burstCount; i++) {
      this.createParticle()
    }
  }

  clearParticles() {
    this.particles = []
    this.state.particles = []
    this.state.particleCount = 0
  }

  getParticles(): Particle[] {
    return [...this.particles]
  }

  getState(): ParticleState {
    return { ...this.state }
  }

  renderToCanvas(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)

    for (const particle of this.particles) {
      if (!particle.active) continue

      context.save()
      context.globalAlpha = particle.color.a
      context.fillStyle = `rgb(${particle.color.r}, ${particle.color.g}, ${particle.color.b})`
      context.beginPath()
      context.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2)
      context.fill()
      context.restore()
    }
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    this.particles = []
    this.state.particles = []
    this.state.particleCount = 0
    this.state.isEmitting = false
  }
}

export function createParticleSystem(options?: ParticleOptions): ParticleManager {
  return new ParticleManager(options)
}

export function createParticleEffect(
  element: () => HTMLElement | null,
  options: ParticleOptions
) {
  let manager: ParticleManager | null = null
  let canvas: HTMLCanvasElement | null = null
  let context: CanvasRenderingContext2D | null = null

  createEffect(() => {
    const el = element()
    if (el && options.particles) {
      if (!manager) {
        manager = createParticleSystem(options)
      }

      // Create canvas for rendering
      if (!canvas) {
        canvas = document.createElement('canvas')
        canvas.width = el.clientWidth || 800
        canvas.height = el.clientHeight || 600
        canvas.style.position = 'absolute'
        canvas.style.top = '0'
        canvas.style.left = '0'
        canvas.style.pointerEvents = 'none'
        
        context = canvas.getContext('2d')
        el.appendChild(canvas)
      }

      // Set emitter position
      const rect = el.getBoundingClientRect()
      manager.setEmitter(rect.width / 2, rect.height / 2)

      // Render loop
      const render = () => {
        if (manager && context) {
          manager.renderToCanvas(context)
        }
        requestAnimationFrame(render)
      }
      render()
    }
  })

  onCleanup(() => {
    if (manager) {
      manager.destroy()
      manager = null
    }
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas)
    }
    canvas = null
    context = null
  })

  return manager
}
