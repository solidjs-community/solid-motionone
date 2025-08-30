<p>
  <img width="100%" src="https://assets.solidjs.com/banner?background=tiles&project=solid-motionone" alt="solid-motionone">
</p>

# solid-motionone

A tiny, performant animation library for SolidJS with advanced features including drag, layout animations, scroll integration, advanced gestures, orchestration, and cutting-edge graphics capabilities.

## ✨ Features

### 🎯 Core Animation
- **Tiny & Performant**: Only 54kb gzipped (core), 189kb with all features
- **TypeScript**: Full type safety with comprehensive interfaces
- **SolidJS Native**: Built specifically for SolidJS reactivity patterns
- **Motion One Powered**: Leverages the full power of Motion One under the hood

### 🖱️ Drag System (Phase 1)
- **Drag Constraints**: Limit drag boundaries with elastic behavior
- **Drag Momentum**: Physics-based momentum with decay
- **Multi-Axis Support**: X, Y, or both axis dragging
- **Event Handling**: Complete drag lifecycle events

### 🎨 Layout Animations (Phase 2)
- **FLIP Technique**: Smooth layout transitions using FLIP animation
- **Shared Elements**: Seamless element transitions between components
- **LayoutGroup**: Coordinate layout animations across components
- **Automatic Detection**: Layout change detection with MutationObserver

### 📜 Scroll Integration (Phase 3)
- **Scroll Tracking**: Real-time scroll position monitoring
- **Parallax Effects**: Smooth parallax animations
- **Viewport Detection**: Enter/leave animations based on viewport
- **Scroll-Based Triggers**: Animation triggers on scroll events

### 👆 Advanced Gestures (Phase 4)
- **Multi-Touch**: Multi-finger gesture recognition
- **Pinch-to-Zoom**: Scale and rotation gestures
- **Gesture Constraints**: Min/max scale and rotation limits
- **Momentum**: Gesture momentum with natural decay

### 🎼 Orchestration (Phase 5)
- **Stagger Animations**: Sequential element animations
- **Timeline Sequencing**: Complex animation sequences
- **Performance Optimized**: RAF batching and memory management
- **Combined Controls**: Stagger and timeline orchestration

### 🔧 Advanced Features (Phase 6-8)
- **Animation Debugger**: Visual debugging tools for animations
- **Accessibility**: ARIA support and reduced motion preferences
- **Presets**: Pre-built animation presets for common use cases
- **Sequences**: Complex animation sequences with precise timing

### 🎨 Advanced Graphics (Phase 10)
- **Canvas Integration**: HTML5 Canvas 2D and WebGL context support
- **WebGL Support**: WebGL 1.0 and 2.0 rendering with shader compilation
- **Particle System**: Dynamic particle creation with physics simulation
- **3D Animation**: 3D transformation management with matrix operations

## 📦 Installation

```bash
npm install solid-motionone
# or
pnpm add solid-motionone
# or
yarn add solid-motionone
```

## 🚀 Quick Start

```tsx
import { Motion } from "solid-motionone"

function App() {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      drag
      layout
      scroll
      pinchZoom
      stagger={0.1}
    >
      Animated Element
    </Motion.div>
  )
}
```

## 📚 Examples

### Basic Animation
```tsx
<Motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
>
  Fade In
</Motion.div>
```

### Drag System
```tsx
<Motion.div
  drag
  dragConstraints={{ left: -100, right: 100 }}
  dragMomentum
  whileDrag={{ scale: 1.1 }}
  onDragStart={(event, info) => console.log("Drag started")}
  onDrag={(event, info) => console.log("Dragging")}
  onDragEnd={(event, info) => console.log("Drag ended")}
>
  Draggable Element
</Motion.div>
```

### Layout Animations
```tsx
import { LayoutGroup } from "solid-motionone"

<LayoutGroup>
  <Motion.div
    layout
    layoutId="shared-element"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    Shared Layout Element
  </Motion.div>
</LayoutGroup>
```

### Scroll Integration
```tsx
<Motion.div
  scroll
  parallax={0.5}
  onViewEnter={() => console.log("Entered viewport")}
  onViewLeave={() => console.log("Left viewport")}
>
  Scroll Element
</Motion.div>
```

### Advanced Gestures
```tsx
<Motion.div
  pinchZoom
  minScale={0.5}
  maxScale={3.0}
  momentum
  whilePinch={{ scale: 1.05, opacity: 0.8 }}
  onPinchStart={(event, state) => console.log("Pinch started")}
  onPinchMove={(event, state) => console.log("Pinching")}
  onPinchEnd={(event, state) => console.log("Pinch ended")}
>
  Pinch Zoom Element
</Motion.div>
```

### Orchestration
```tsx
<Motion.div
  stagger={0.1}
  staggerDirection="from-center"
  timeline={{
    duration: 2000,
    segments: [
      { at: 0, animation: { opacity: 0 } },
      { at: 500, animation: { opacity: 1 } },
      { at: 1500, animation: { opacity: 0.8 } }
    ],
    repeat: "loop"
  }}
  orchestrate
  onStaggerStart={(state) => console.log("Stagger started")}
  onTimelineUpdate={(progress) => console.log("Timeline:", progress)}
>
  Orchestrated Element
</Motion.div>
```

### Canvas Integration
```tsx
<Motion.div
  canvas
  canvasWidth={300}
  canvasHeight={200}
  canvasContext="2d"
  onCanvasReady={(canvas, context) => {
    console.log('Canvas ready:', canvas);
  }}
  onCanvasRender={(context, deltaTime) => {
    // Custom canvas rendering
    context.fillStyle = 'red';
    context.fillRect(0, 0, 100, 100);
  }}
>
  Canvas Element
</Motion.div>
```

### WebGL Support
```tsx
<Motion.div
  webgl
  webglVersion="2.0"
  webglVertexShader={`
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `}
  webglFragmentShader={`
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `}
  onWebGLReady={(gl, program) => {
    console.log('WebGL ready:', gl, program);
  }}
>
  WebGL Element
</Motion.div>
```

### Particle System
```tsx
<Motion.div
  particles
  particleCount={100}
  particleSize={{ min: 2, max: 8 }}
  particleColor={['#ff6b6b', '#4ecdc4', '#45b7d1']}
  particleEmission="continuous"
  particleVelocity={{ x: 0, y: -2, z: 0 }}
  particleGravity={{ x: 0, y: 0.1, z: 0 }}
  onParticleCreate={(particle) => {
    console.log('Particle created:', particle);
  }}
  onParticleUpdate={(particle, deltaTime) => {
    // Custom particle update logic
  }}
>
  Particle System Element
</Motion.div>
```

### 3D Animation
```tsx
<Motion.div
  threeD
  threeDPerspective={1000}
  threeDRotateX={45}
  threeDRotateY={30}
  threeDTranslateZ={100}
  threeDScaleX={1.2}
  threeDScaleY={0.8}
  onThreeDUpdate={(matrix) => {
    console.log('3D matrix updated:', matrix);
  }}
>
  3D Animated Element
</Motion.div>
```

### Complex Combination
```tsx
<Motion.div
  // Core animations
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  
  // Drag system
  drag
  dragConstraints={{ left: -50, right: 50 }}
  
  // Layout animations
  layout
  layoutId="complex-element"
  
  // Scroll integration
  scroll
  parallax={0.3}
  
  // Advanced gestures
  pinchZoom
  minScale={0.8}
  maxScale={2.0}
  
  // Orchestration
  stagger={0.2}
  orchestrate
  
  // Advanced graphics
  canvas
  particles
  threeD
>
  Complex Animated Element
</Motion.div>
```

## 🎯 API Reference

### Motion Component Props

#### Core Animation
- `initial` - Initial animation state
- `animate` - Target animation state
- `exit` - Exit animation state
- `transition` - Animation configuration
- `variants` - Reusable animation states

#### Drag System
- `drag` - Enable drag (boolean | "x" | "y")
- `dragConstraints` - Drag boundaries
- `dragElastic` - Elastic drag behavior
- `dragMomentum` - Enable momentum
- `whileDrag` - Animation during drag
- `onDragStart` - Drag start callback
- `onDrag` - Drag move callback
- `onDragEnd` - Drag end callback

#### Layout Animations
- `layout` - Enable layout animations
- `layoutId` - Shared element identifier
- `layoutRoot` - Layout root element
- `layoutScroll` - Include scroll in layout

#### Scroll Integration
- `scroll` - Enable scroll tracking
- `scrollContainer` - Scroll container element
- `parallax` - Parallax effect strength
- `onViewEnter` - Enter viewport callback
- `onViewLeave` - Leave viewport callback

#### Advanced Gestures
- `multiTouch` - Enable multi-touch
- `pinchZoom` - Enable pinch-to-zoom
- `minScale` - Minimum scale
- `maxScale` - Maximum scale
- `momentum` - Enable gesture momentum
- `whilePinch` - Animation during pinch
- `onPinchStart` - Pinch start callback
- `onPinchMove` - Pinch move callback
- `onPinchEnd` - Pinch end callback

#### Orchestration
- `stagger` - Stagger delay (number | config)
- `staggerDirection` - Stagger direction
- `timeline` - Timeline configuration
- `orchestrate` - Enable orchestration
- `onStaggerStart` - Stagger start callback
- `onStaggerComplete` - Stagger complete callback
- `onTimelineStart` - Timeline start callback
- `onTimelineUpdate` - Timeline update callback
- `onTimelineComplete` - Timeline complete callback

#### Canvas Integration
- `canvas` - Enable canvas integration
- `canvasWidth` - Canvas width
- `canvasHeight` - Canvas height
- `canvasContext` - Canvas context type ("2d" | "webgl" | "webgl2")
- `onCanvasReady` - Canvas ready callback
- `onCanvasResize` - Canvas resize callback
- `onCanvasRender` - Canvas render callback

#### WebGL Support
- `webgl` - Enable WebGL support
- `webglVersion` - WebGL version ("1.0" | "2.0")
- `webglVertexShader` - Vertex shader source
- `webglFragmentShader` - Fragment shader source
- `webglAttributes` - WebGL attributes configuration
- `webglUniforms` - WebGL uniforms configuration
- `onWebGLReady` - WebGL ready callback
- `onWebGLRender` - WebGL render callback

#### Particle System
- `particles` - Enable particle system
- `particleCount` - Number of particles
- `particleSize` - Particle size (number | { min, max })
- `particleColor` - Particle color (string | string[] | object)
- `particleEmission` - Emission type ("continuous" | "burst" | "explosion")
- `particleVelocity` - Particle velocity configuration
- `particleGravity` - Particle gravity configuration
- `onParticleCreate` - Particle creation callback
- `onParticleUpdate` - Particle update callback
- `onParticleDestroy` - Particle destruction callback

#### 3D Animation
- `threeD` - Enable 3D animation
- `threeDPerspective` - 3D perspective value
- `threeDRotateX` - X-axis rotation
- `threeDRotateY` - Y-axis rotation
- `threeDRotateZ` - Z-axis rotation
- `threeDTranslateX` - X-axis translation
- `threeDTranslateY` - Y-axis translation
- `threeDTranslateZ` - Z-axis translation
- `threeDScaleX` - X-axis scale
- `threeDScaleY` - Y-axis scale
- `threeDScaleZ` - Z-axis scale
- `onThreeDUpdate` - 3D matrix update callback

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📊 Performance

- **Core Bundle**: 54kb gzipped (basic features)
- **Full Bundle**: 189kb gzipped (all features included)
- **Runtime Performance**: Optimized with RAF batching
- **Memory Usage**: Efficient memory management with automatic cleanup
- **TypeScript**: Full type safety with comprehensive interfaces
- **Build Time**: ~1.4 seconds

## 🎨 Advanced Graphics Demo

Check out our comprehensive demo showcasing all Phase 10 features:
- **Canvas 2D Animation**: Interactive canvas animations
- **WebGL Rendering**: WebGL 1.0 and 2.0 demonstrations
- **Particle System**: Dynamic particle effects with controls
- **3D Animation**: 3D transformation examples

[View Demo](demo/phase10-advanced-features-demo.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🎉 Acknowledgments

Built on top of [@motionone/dom](https://motion.dev/) with SolidJS integration.

---

**solid-motionone** - Powerful animations for SolidJS applications! 🚀

*Now with advanced graphics capabilities including Canvas, WebGL, particle systems, and 3D animations!*
