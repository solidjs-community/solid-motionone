import { createSignal, createEffect, onCleanup } from 'solid-js'
import type { WebGLOptions, WebGLState, ShaderOptions, ShaderUniform, ShaderAttribute } from '../types.js'

export class WebGLManager {
  private options: WebGLOptions
  private state: WebGLState
  private gl: WebGLRenderingContext | WebGL2RenderingContext | null = null
  private program: WebGLProgram | null = null
  private animationFrameId: number | null = null

  constructor(options: WebGLOptions = {}) {
    this.options = {
      webglVersion: '1.0',
      webglVertexShader: this.getDefaultVertexShader(),
      webglFragmentShader: this.getDefaultFragmentShader(),
      webglAttributes: {},
      webglUniforms: {},
      webglTextures: {},
      webglBlendMode: 'add',
      webglDepthTest: true,
      webglCullFace: 'back',
      webglFrontFace: 'ccw',
      ...options
    }
    
    this.state = {
      gl: null,
      program: null,
      attributes: {},
      uniforms: {},
      textures: {},
      buffers: {},
      vao: null,
      isInitialized: false
    }
  }

  private getDefaultVertexShader(): string {
    return `
      attribute vec3 a_position;
      attribute vec4 a_color;
      
      uniform mat4 u_modelViewMatrix;
      uniform mat4 u_projectionMatrix;
      
      varying vec4 v_color;
      
      void main() {
        gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(a_position, 1.0);
        v_color = a_color;
      }
    `
  }

  private getDefaultFragmentShader(): string {
    return `
      precision mediump float;
      
      varying vec4 v_color;
      
      void main() {
        gl_FragColor = v_color;
      }
    `
  }

  initialize(canvas: HTMLCanvasElement): boolean {
    if (typeof WebGLRenderingContext === 'undefined') {
      console.error('WebGL not supported')
      return false
    }

    // Get WebGL context
    const contextOptions = {
      alpha: true,
      antialias: true,
      depth: true,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'default',
      failIfMajorPerformanceCaveat: false
    }

    if (this.options.webglVersion === '2.0') {
      this.gl = canvas.getContext('webgl2', contextOptions) as WebGL2RenderingContext
    } else {
      this.gl = canvas.getContext('webgl', contextOptions) as WebGLRenderingContext
    }

    if (!this.gl) {
      console.error('Failed to get WebGL context')
      return false
    }

    this.state.gl = this.gl

    // Set up WebGL state
    this.setupWebGLState()

    // Create and compile shaders
    if (!this.createShaders()) {
      return false
    }

    // Set up attributes and uniforms
    this.setupAttributes()
    this.setupUniforms()

    // Set up textures
    this.setupTextures()

    // Call onWebGLReady callback
    if (this.options.onWebGLReady && this.gl && this.program) {
      this.options.onWebGLReady(this.gl, this.program)
    }

    this.state.isInitialized = true
    return true
  }

  private setupWebGLState() {
    if (!this.gl) return

    // Enable depth testing
    if (this.options.webglDepthTest) {
      this.gl.enable(this.gl.DEPTH_TEST)
      this.gl.depthFunc(this.gl.LEQUAL)
    }

    // Set up blending
    this.gl.enable(this.gl.BLEND)
    switch (this.options.webglBlendMode) {
      case 'add':
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE)
        break
      case 'subtract':
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
        break
      default:
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
    }

    // Set up face culling
    if (this.options.webglCullFace) {
      this.gl.enable(this.gl.CULL_FACE)
      switch (this.options.webglCullFace) {
        case 'front':
          this.gl.cullFace(this.gl.FRONT)
          break
        case 'back':
          this.gl.cullFace(this.gl.BACK)
          break
        case 'front-and-back':
          this.gl.cullFace(this.gl.FRONT_AND_BACK)
          break
      }
    }

    // Set front face winding
    if (this.options.webglFrontFace === 'cw') {
      this.gl.frontFace(this.gl.CW)
    } else {
      this.gl.frontFace(this.gl.CCW)
    }

    // Clear color
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
  }

  private createShaders(): boolean {
    if (!this.gl) return false

    // Create vertex shader
    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
    if (!vertexShader) {
      console.error('Failed to create vertex shader')
      return false
    }

    this.gl.shaderSource(vertexShader, this.options.webglVertexShader || this.getDefaultVertexShader())
    this.gl.compileShader(vertexShader)

    if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
      console.error('Vertex shader compilation error:', this.gl.getShaderInfoLog(vertexShader))
      this.gl.deleteShader(vertexShader)
      return false
    }

    // Create fragment shader
    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
    if (!fragmentShader) {
      console.error('Failed to create fragment shader')
      this.gl.deleteShader(vertexShader)
      return false
    }

    this.gl.shaderSource(fragmentShader, this.options.webglFragmentShader || this.getDefaultFragmentShader())
    this.gl.compileShader(fragmentShader)

    if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
      console.error('Fragment shader compilation error:', this.gl.getShaderInfoLog(fragmentShader))
      this.gl.deleteShader(vertexShader)
      this.gl.deleteShader(fragmentShader)
      return false
    }

    // Create program
    this.program = this.gl.createProgram()
    if (!this.program) {
      console.error('Failed to create WebGL program')
      this.gl.deleteShader(vertexShader)
      this.gl.deleteShader(fragmentShader)
      return false
    }

    this.gl.attachShader(this.program, vertexShader)
    this.gl.attachShader(this.program, fragmentShader)
    this.gl.linkProgram(this.program)

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Program linking error:', this.gl.getProgramInfoLog(this.program))
      this.gl.deleteProgram(this.program)
      this.gl.deleteShader(vertexShader)
      this.gl.deleteShader(fragmentShader)
      return false
    }

    this.state.program = this.program

    // Clean up shaders
    this.gl.deleteShader(vertexShader)
    this.gl.deleteShader(fragmentShader)

    return true
  }

  private setupAttributes() {
    if (!this.gl || !this.program) return

    const attributes = this.options.webglAttributes || {}
    
    for (const [name, config] of Object.entries(attributes)) {
      const location = this.gl.getAttribLocation(this.program!, name)
      if (location !== -1) {
        this.state.attributes[name] = location
      }
    }
  }

  private setupUniforms() {
    if (!this.gl || !this.program) return

    const uniforms = this.options.webglUniforms || {}
    
    for (const [name, config] of Object.entries(uniforms)) {
      const location = this.gl.getUniformLocation(this.program!, name)
      if (location) {
        this.state.uniforms[name] = location
        this.setUniform(name, config.value)
      }
    }
  }

  private setupTextures() {
    if (!this.gl) return

    const textures = this.options.webglTextures || {}
    let textureUnit = 0

    for (const [name, config] of Object.entries(textures)) {
      const texture = this.gl.createTexture()
      if (texture) {
        this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit)
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
        
        // Set texture parameters
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)

        // Upload texture data
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          config.level || 0,
          config.internalFormat || this.gl.RGBA,
          config.format || this.gl.RGBA,
          config.type || this.gl.UNSIGNED_BYTE,
          config.source
        )

        this.state.textures[name] = texture
        textureUnit++
      }
    }
  }

  setUniform(name: string, value: any) {
    if (!this.gl || !this.program) return

    const location = this.state.uniforms[name]
    if (location === undefined) return

    const uniform = this.options.webglUniforms?.[name]
    if (!uniform) return

    switch (uniform.type as any) {
      case 'float':
        this.gl.uniform1f(location, value)
        break
      case 'int':
        this.gl.uniform1i(location, value)
        break
      case 'bool':
        this.gl.uniform1i(location, value ? 1 : 0)
        break
      case 'vec2':
        this.gl.uniform2fv(location, value)
        break
      case 'vec3':
        this.gl.uniform3fv(location, value)
        break
      case 'vec4':
        this.gl.uniform4fv(location, value)
        break
      case 'mat2':
        this.gl.uniformMatrix2fv(location, false, value)
        break
      case 'mat3':
        this.gl.uniformMatrix3fv(location, false, value)
        break
      case 'mat4':
        this.gl.uniformMatrix4fv(location, false, value)
        break
      case 'sampler2D':
        this.gl.uniform1i(location, value)
        break
    }
  }

  createBuffer(data: Float32Array | Int16Array, target: number = WebGLRenderingContext.ARRAY_BUFFER): WebGLBuffer | null {
    if (!this.gl) return null

    const buffer = this.gl.createBuffer()
    if (!buffer) return null

    this.gl.bindBuffer(target, buffer)
    this.gl.bufferData(target, data, this.gl.STATIC_DRAW)

    return buffer
  }

  render(deltaTime: number) {
    if (!this.gl || !this.program || !this.state.isInitialized) return

    // Clear canvas
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    // Use program
    this.gl.useProgram(this.program)

    // Call onWebGLRender callback
    if (this.options.onWebGLRender) {
      this.options.onWebGLRender(this.gl, this.program, deltaTime)
    }
  }

  startRenderLoop() {
    if (!this.state.isInitialized) return

    this.state.isInitialized = true
    let lastTime = performance.now()

    const render = (currentTime: number) => {
      if (!this.state.isInitialized) return

      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      this.render(deltaTime)
      this.animationFrameId = requestAnimationFrame(render)
    }

    this.animationFrameId = requestAnimationFrame(render)
  }

  stopRenderLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    this.state.isInitialized = false
  }

  getState(): WebGLState {
    return { ...this.state }
  }

  destroy() {
    this.stopRenderLoop()

    if (this.gl) {
      // Clean up textures
      for (const texture of Object.values(this.state.textures)) {
        if (texture) {
          this.gl.deleteTexture(texture)
        }
      }

      // Clean up buffers
      for (const buffer of Object.values(this.state.buffers)) {
        if (buffer) {
          this.gl.deleteBuffer(buffer)
        }
      }

      // Clean up program
      if (this.program) {
        this.gl.deleteProgram(this.program)
      }

      // Clean up VAO (WebGL2)
      if (this.state.vao && 'deleteVertexArray' in this.gl) {
        (this.gl as WebGL2RenderingContext).deleteVertexArray(this.state.vao)
      }
    }

    this.gl = null
    this.program = null
    this.state.gl = null
    this.state.program = null
    this.state.attributes = {}
    this.state.uniforms = {}
    this.state.textures = {}
    this.state.buffers = {}
    this.state.vao = null
    this.state.isInitialized = false
  }
}

export function createWebGL(options?: WebGLOptions): WebGLManager {
  return new WebGLManager(options)
}

export function createWebGLEffect(
  canvas: () => HTMLCanvasElement | null,
  options: WebGLOptions
) {
  let manager: WebGLManager | null = null

  createEffect(() => {
    const canvasElement = canvas()
    if (canvasElement && options.webgl) {
      if (!manager) {
        manager = createWebGL(options)
      }
      
      if (manager.initialize(canvasElement)) {
        manager.startRenderLoop()
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
