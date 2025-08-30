# Getting Started

Welcome to solid-motionone! This guide will help you get up and running with smooth animations in your SolidJS application.

## Installation

Install solid-motionone using your preferred package manager:

```bash
# npm
npm install solid-motionone

# pnpm
pnpm add solid-motionone

# yarn
yarn add solid-motionone
```

### Prerequisites

- **SolidJS**: ^1.8.0 or later
- **Modern Browser**: Supports Web Animations API (Chrome 36+, Firefox 48+, Safari 13.1+)

## Basic Usage

### Your First Animation

```tsx
import { Motion } from 'solid-motionone'

function App() {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Welcome to solid-motionone!
    </Motion.div>
  )
}
```

This creates a div that fades in and slides up when the component mounts.

### Core Concepts

#### 1. **Motion Components**
Any HTML element can be made animatable by using `Motion.elementName`:

```tsx
<Motion.div>A div</Motion.div>
<Motion.button>A button</Motion.button>
<Motion.h1>A heading</Motion.h1>
<Motion.span>A span</Motion.span>
```

#### 2. **Animation States**
- `initial`: Starting values when component mounts
- `animate`: Target values to animate to
- `exit`: Values to animate to when component unmounts

```tsx
<Motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  exit={{ scale: 0 }}
/>
```

#### 3. **Transitions**
Control timing, easing, and animation behavior:

```tsx
<Motion.div
  animate={{ x: 100 }}
  transition={{
    duration: 0.5,
    easing: "ease-out",
    delay: 0.2
  }}
/>
```

## Common Animation Patterns

### Fade In/Out

```tsx
function FadeExample() {
  const [visible, setVisible] = createSignal(true)
  
  return (
    <div>
      <button onClick={() => setVisible(!visible())}>
        Toggle Visibility
      </button>
      
      <Motion.div
        animate={{ opacity: visible() ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        I fade in and out!
      </Motion.div>
    </div>
  )
}
```

### Slide Animations

```tsx
function SlideExample() {
  return (
    <Motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, easing: "ease-out" }}
    >
      I slide in from the left!
    </Motion.div>
  )
}
```

### Scale Animations

```tsx
function ScaleExample() {
  return (
    <Motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 0.4,
        easing: [0.68, -0.55, 0.265, 1.55] // Custom cubic-bezier
      }}
    >
      I pop in with a bounce!
    </Motion.div>
  )
}
```

## Interactive Animations

### Hover Effects

```tsx
function HoverButton() {
  return (
    <Motion.button
      hover={{ scale: 1.05 }}
      press={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      class="btn"
    >
      Hover and click me!
    </Motion.button>
  )
}
```

### Click Animations

```tsx
function ClickableCard() {
  return (
    <Motion.div
      press={{ scale: 0.98, rotateZ: 1 }}
      hover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      class="card"
    >
      <h3>Interactive Card</h3>
      <p>I respond to hover and clicks!</p>
    </Motion.div>
  )
}
```

## Working with SolidJS Reactivity

### Reactive Animations

```tsx
function ReactiveExample() {
  const [color, setColor] = createSignal("#3b82f6")
  const [position, setPosition] = createSignal(0)
  
  return (
    <div>
      <Motion.div
        animate={{
          backgroundColor: color(),
          x: position(),
          rotate: position() / 2
        }}
        transition={{ duration: 0.3 }}
        style={{
          width: "100px",
          height: "100px",
          border-radius: "8px"
        }}
      />
      
      <div class="controls">
        <button onClick={() => setColor("#ef4444")}>
          Red
        </button>
        <button onClick={() => setColor("#10b981")}>
          Green
        </button>
        <button onClick={() => setPosition(Math.random() * 200)}>
          Random Position
        </button>
      </div>
    </div>
  )
}
```

### Dynamic Variants

```tsx
function VariantExample() {
  const [variant, setVariant] = createSignal("initial")
  
  const variants = {
    initial: { 
      opacity: 0.6, 
      scale: 1,
      rotate: 0 
    },
    expanded: { 
      opacity: 1, 
      scale: 1.2,
      rotate: 5 
    },
    compressed: { 
      opacity: 0.8, 
      scale: 0.8,
      rotate: -5 
    }
  }
  
  return (
    <div>
      <Motion.div
        variants={variants}
        animate={variant()}
        transition={{ duration: 0.4 }}
        class="variant-box"
      />
      
      <div class="variant-controls">
        <button onClick={() => setVariant("initial")}>
          Initial
        </button>
        <button onClick={() => setVariant("expanded")}>
          Expanded
        </button>
        <button onClick={() => setVariant("compressed")}>
          Compressed
        </button>
      </div>
    </div>
  )
}
```

## Exit Animations

Use the `Presence` component for exit animations:

```tsx
import { Motion, Presence } from 'solid-motionone'
import { createSignal, Show } from 'solid-js'

function ExitExample() {
  const [show, setShow] = createSignal(true)
  
  return (
    <div>
      <button onClick={() => setShow(!show())}>
        Toggle
      </button>
      
      <Presence>
        <Show when={show()}>
          <Motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            I animate in and out!
          </Motion.div>
        </Show>
      </Presence>
    </div>
  )
}
```

## Performance Tips

### Use Transform Properties
For best performance, animate transform properties (x, y, scale, rotate) and opacity:

```tsx
// ✅ Good - GPU accelerated
<Motion.div animate={{ x: 100, y: 50, scale: 1.2, opacity: 0.8 }} />

// ❌ Avoid when possible - causes layout recalculation
<Motion.div animate={{ left: "100px", top: "50px", width: "200px" }} />
```

### Batch Signal Updates

```tsx
import { batch } from 'solid-js'

// ✅ Good - batches updates to prevent multiple animations
const updatePosition = () => {
  batch(() => {
    setX(100)
    setY(200)
    setScale(1.5)
  })
}

// ❌ Less efficient - triggers multiple animations
const updatePositionBad = () => {
  setX(100)    // triggers animation
  setY(200)    // triggers animation  
  setScale(1.5) // triggers animation
}
```

## Common Patterns

### Loading Spinner

```tsx
function LoadingSpinner() {
  return (
    <Motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        easing: "linear"
      }}
      class="spinner"
    />
  )
}
```

### Staggered List Animation

```tsx
function StaggeredList() {
  const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]
  
  return (
    <div>
      <For each={items}>
        {(item, index) => (
          <Motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: index() * 0.1,
              duration: 0.5 
            }}
          >
            {item}
          </Motion.div>
        )}
      </For>
    </div>
  )
}
```

### Progressive Enhancement

```tsx
function ProgressiveExample() {
  const [enhance, setEnhance] = createSignal(true)
  
  return (
    <div>
      <label>
        <input 
          type="checkbox" 
          checked={enhance()}
          onChange={(e) => setEnhance(e.target.checked)}
        />
        Enable animations
      </label>
      
      {enhance() ? (
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Enhanced with animations!
        </Motion.div>
      ) : (
        <div>
          Static content (no animations)
        </div>
      )}
    </div>
  )
}
```

## Next Steps

Now that you understand the basics, explore more advanced topics:

- **[Advanced Animations](./advanced-animations.md)** - Complex animation patterns
- **[Performance Guide](./performance.md)** - Optimization techniques
- **[API Reference](../api/)** - Complete API documentation

## Troubleshooting

### Common Issues

**Animations not working?**
- Check that you're using transform properties (x, y, scale, rotate)
- Ensure the element has layout (not display: none)
- Verify Motion One is properly installed

**Performance issues?**
- Avoid animating layout properties (width, height, top, left)
- Use `batch()` for multiple signal updates
- Check for excessive re-renders in DevTools

**Exit animations not triggering?**
- Ensure element is wrapped in `<Presence>`
- Check that conditional rendering is direct child of `<Show>`
- Verify exit animation has `transition` defined