# Local Usage Guide - solid-motionone

This guide shows you how to use the local solid-motionone package in your projects without publishing to npm.

## 📦 Available Artifacts

### 1. **Local Package File** (Recommended)
- **File**: `solid-motionone-1.1.0.tgz`
- **Size**: 43.1 kB
- **Contains**: All built files, types, and documentation

### 2. **Built Distribution Files**
- **Location**: `dist/` directory
- **Files**:
  - `index.js` - ESM bundle (52.83 KB)
  - `index.jsx` - ESM bundle with JSX (54.43 KB)
  - `index.cjs` - CommonJS bundle (53.87 KB)
  - `index.d.ts` - TypeScript definitions (19.57 KB)
  - `index.d.cts` - CommonJS TypeScript definitions (19.57 KB)

## 🚀 Quick Start

### Option 1: Install from .tgz file (Recommended)

```bash
# In your project directory
npm install /path/to/solid-motionone-1.1.0.tgz
```

### Option 2: Use npm link (for development)

```bash
# In solid-motionone directory
npm link

# In your project directory
npm link solid-motionone
```

### Option 3: Direct file reference

```bash
# Copy the dist folder to your project
cp -r /path/to/solid-motionone/dist ./lib/solid-motionone

# Then import directly
import { Motion } from './lib/solid-motionone/index.js'
```

## 📋 Usage Examples

### Basic Import
```tsx
import { Motion } from "solid-motionone"

function App() {
  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      Hello World
    </Motion.div>
  )
}
```

### Drag System
```tsx
import { Motion } from "solid-motionone"

function DragExample() {
  return (
    <Motion.div
      drag
      dragConstraints={{ left: -100, right: 100 }}
      dragMomentum
      whileDrag={{ scale: 1.1 }}
      onDragStart={(event, info) => console.log("Drag started")}
      onDrag={(event, info) => console.log("Dragging")}
      onDragEnd={(event, info) => console.log("Drag ended")}
      style={{
        width: "100px",
        height: "100px",
        background: "red",
        cursor: "grab"
      }}
    >
      Drag Me
    </Motion.div>
  )
}
```

### Layout Animations
```tsx
import { Motion, LayoutGroup } from "solid-motionone"

function LayoutExample() {
  return (
    <LayoutGroup>
      <Motion.div
        layout
        layoutId="shared-element"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        Shared Layout Element
      </Motion.div>
    </LayoutGroup>
  )
}
```

### Scroll Integration
```tsx
import { Motion } from "solid-motionone"

function ScrollExample() {
  return (
    <Motion.div
      scroll
      parallax={0.5}
      onViewEnter={() => console.log("Entered viewport")}
      onViewLeave={() => console.log("Left viewport")}
    >
      Scroll Element
    </Motion.div>
  )
}
```

### Advanced Gestures
```tsx
import { Motion } from "solid-motionone"

function GestureExample() {
  return (
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
  )
}
```

### Orchestration
```tsx
import { Motion } from "solid-motionone"

function OrchestrationExample() {
  return (
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
  )
}
```

## 🎯 Demo Project

We've created a complete demo project in the `demo/` directory that showcases all features:

### Setup Demo
```bash
# Navigate to demo directory
cd demo

# Run setup script
./setup.sh

# Start development server
npm run dev

# Open http://localhost:3000
```

### Demo Features
- **Interactive Navigation**: Switch between different feature sections
- **Real-time Feedback**: See event information as you interact
- **Complete Examples**: All 5 phases with working examples
- **Performance Metrics**: Bundle size and feature summary

## 🔧 Integration with Different Build Tools

### Vite
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  optimizeDeps: {
    include: ['solid-motionone']
  }
})
```

### Webpack
```javascript
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      'solid-motionone': path.resolve(__dirname, 'path/to/solid-motionone/dist/index.js')
    }
  }
}
```

### Rollup
```javascript
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve'

export default {
  plugins: [
    resolve({
      alias: {
        'solid-motionone': 'path/to/solid-motionone/dist/index.js'
      }
    })
  ]
}
```

## 📊 Performance Considerations

### Bundle Size
- **Total Size**: 54.43 KB (gzipped)
- **Tree-shaking**: Supported - only import what you use
- **Lazy Loading**: Can be implemented for specific features

### Tree-shaking Example
```tsx
// Import only what you need
import { Motion } from "solid-motionone"

// Instead of importing everything
// import * as MotionOne from "solid-motionone"
```

### Lazy Loading Example
```tsx
import { lazy } from "solid-js"

// Lazy load gesture features only when needed
const MotionWithGestures = lazy(() => 
  import("solid-motionone").then(module => ({
    default: module.Motion
  }))
)
```

## 🧪 Testing

### Unit Testing
```tsx
import { render } from "@solidjs/testing-library"
import { Motion } from "solid-motionone"

test("Motion component renders", () => {
  const { getByText } = render(() => (
    <Motion.div>Test</Motion.div>
  ))
  
  expect(getByText("Test")).toBeInTheDocument()
})
```

### Integration Testing
```tsx
import { render, fireEvent } from "@solidjs/testing-library"
import { Motion } from "solid-motionone"

test("Drag functionality works", async () => {
  const onDragStart = vi.fn()
  
  const { getByText } = render(() => (
    <Motion.div
      drag
      onDragStart={onDragStart}
    >
      Drag Me
    </Motion.div>
  ))
  
  const element = getByText("Drag Me")
  fireEvent.mouseDown(element)
  
  expect(onDragStart).toHaveBeenCalled()
})
```

## 🔍 Debugging

### Enable Debug Mode
```tsx
// Add debug information to console
import { Motion } from "solid-motionone"

<Motion.div
  drag
  onDragStart={(event, info) => {
    console.log("Drag Info:", info)
  }}
>
  Debug Element
</Motion.div>
```

### Performance Monitoring
```tsx
// Monitor animation performance
import { Motion } from "solid-motionone"

<Motion.div
  onAnimationStart={() => {
    console.time("animation")
  }}
  onAnimationComplete={() => {
    console.timeEnd("animation")
  }}
>
  Performance Test
</Motion.div>
```

## 🚨 Troubleshooting

### Common Issues

1. **TypeScript Errors**
   ```bash
   # Make sure types are properly installed
   npm install /path/to/solid-motionone-1.1.0.tgz
   ```

2. **Build Errors**
   ```bash
   # Check if all dependencies are installed
   npm install solid-js @motionone/dom
   ```

3. **Runtime Errors**
   ```bash
   # Ensure you're using the correct import
   import { Motion } from "solid-motionone"
   # Not: import Motion from "solid-motionone"
   ```

### Getting Help

1. **Check the demo**: Run the demo project to see working examples
2. **Review tests**: Look at the test files for usage patterns
3. **Check documentation**: See the README.md for API reference

## 📈 Next Steps

1. **Test in your project**: Try the local package in your application
2. **Gather feedback**: Note any issues or missing features
3. **Consider publishing**: If everything works well, consider publishing to npm
4. **Contribute**: Submit issues or pull requests for improvements

---

**solid-motionone** - Powerful animations for SolidJS applications! 🚀
