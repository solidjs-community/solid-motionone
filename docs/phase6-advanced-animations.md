# Phase 6: Advanced Animation Features

## Overview

Phase 6 introduces advanced animation capabilities to `solid-motionone`, providing physics-based spring animations, complex keyframe sequences, reusable animation variants, gesture-based animations, and a unified advanced animation controller.

## Features

### 🎯 Spring Animations

Physics-based spring animations with configurable stiffness, damping, and mass.

```tsx
import { Motion } from "solid-motionone"

// Using spring presets
<Motion.div
  spring="bouncy"
  animate={{ x: 100, scale: 1.2 }}
>
  Bouncy Spring
</Motion.div>

// Custom spring configuration
<Motion.div
  spring={{ stiffness: 200, damping: 15, mass: 1.5 }}
  animate={{ rotate: 360 }}
>
  Custom Spring
</Motion.div>
```

**Available Spring Presets:**
- `gentle` - Smooth, gentle spring
- `bouncy` - Bouncy, playful spring
- `stiff` - Quick, responsive spring
- `wobbly` - Wobbly, elastic spring

### 🎬 Keyframe Animations

Complex keyframe sequences with custom easing functions.

```tsx
import { Motion } from "solid-motionone"

<Motion.div
  keyframes={{
    x: [0, 100, 0],
    y: [0, -20, 0],
    scale: [1, 1.2, 1]
  }}
  keyframeEasing="bounce"
>
  Keyframe Animation
</Motion.div>

// Custom easing function
<Motion.div
  keyframes={{ opacity: [0, 1, 0] }}
  keyframeEasing={(t) => t * t * (3 - 2 * t)}
>
  Custom Easing
</Motion.div>
```

**Available Easing Functions:**
- `linear` - Linear interpolation
- `ease` - Smooth ease
- `easeIn` - Ease in
- `easeOut` - Ease out
- `easeInOut` - Ease in and out
- `bounce` - Bouncy animation
- `elastic` - Elastic animation

### 🎭 Animation Variants

Reusable animation states with conditional logic and orchestration.

```tsx
import { Motion } from "solid-motionone"

<Motion.div
  variants={{
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.1, y: -5 }
  }}
  initial="hidden"
  animate="visible"
  whileHover="hover"
>
  Variant Animation
</Motion.div>

// Conditional variants
<Motion.div
  variants={{
    small: { scale: 0.5, opacity: 0.5 },
    normal: { scale: 1, opacity: 1 },
    large: { scale: 1.5, opacity: 0.8 }
  }}
  animate={isLarge() ? "large" : "normal"}
>
  Conditional Variant
</Motion.div>
```

### 👆 Gesture-Based Animations

Animations triggered by user gestures like drag, pinch, hover, and press.

```tsx
import { Motion } from "solid-motionone"

<Motion.div
  gestureAnimation={true}
  gestureVariants={{
    drag_start: { scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" },
    drag_move: { x: 0, y: 0 },
    drag_end: { scale: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
    hover_start: { scale: 1.05, y: -5 },
    hover_end: { scale: 1, y: 0 }
  }}
>
  Gesture Animation
</Motion.div>
```

**Supported Gestures:**
- `drag_start`, `drag_move`, `drag_end`
- `pinch_start`, `pinch_move`, `pinch_end`
- `hover_start`, `hover_end`
- `press_start`, `press_end`
- `swipe_start`, `swipe_move`, `swipe_end`

### 🎛️ Advanced Animation Controller

Unified controller for orchestrating complex animation sequences.

```tsx
import { createAdvancedAnimationController } from "solid-motionone"

const controller = createAdvancedAnimationController({
  spring: { stiffness: 200, damping: 15 },
  keyframes: { rotate: [0, 360] },
  variants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  gestureAnimations: {
    gestureAnimation: true,
    gestureVariants: {
      hover_start: { scale: 1.1 }
    }
  }
})

// Control animations
controller.play()
controller.pause()
controller.stop()
controller.reset()
```

## API Reference

### Spring Configuration

```tsx
interface SpringConfig {
  stiffness?: number      // Spring stiffness (default: 100)
  damping?: number        // Spring damping (default: 10)
  mass?: number          // Spring mass (default: 1)
  restDelta?: number     // Rest delta threshold (default: 0.01)
  restSpeed?: number     // Rest speed threshold (default: 0.01)
}
```

### Keyframe Configuration

```tsx
interface KeyframeConfig {
  [property: string]: Array<number | string>
}

interface KeyframeOptions {
  keyframeEasing?: (t: number) => number | Array<(t: number) => number>
  keyframeOffset?: number | Array<number>
  duration?: number
  delay?: number
}
```

### Animation Variants

```tsx
interface AnimationVariant {
  [property: string]: number | string
}

interface VariantsOptions {
  variants?: Record<string, AnimationVariant>
  initial?: string | AnimationVariant
  animate?: string | AnimationVariant
  exit?: string | AnimationVariant
  whileHover?: string | AnimationVariant
  whileTap?: string | AnimationVariant
  whileFocus?: string | AnimationVariant
  whileDrag?: string | AnimationVariant
  whilePinch?: string | AnimationVariant
}
```

### Gesture Animation Options

```tsx
interface GestureAnimationOptions {
  gestureAnimation?: boolean
  gestureVariants?: Record<string, AnimationVariant>
}
```

## Event Handlers

Phase 6 introduces comprehensive event handlers for animation lifecycle:

```tsx
<Motion.div
  spring="bouncy"
  keyframes={{ x: [0, 100] }}
  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
  gestureAnimation={true}
  onSpringStart={(config) => console.log('Spring started:', config)}
  onSpringComplete={(config) => console.log('Spring completed:', config)}
  onKeyframeStart={(keyframes) => console.log('Keyframe started:', keyframes)}
  onKeyframeComplete={(keyframes) => console.log('Keyframe completed:', keyframes)}
  onVariantStart={(variant, config) => console.log('Variant started:', variant, config)}
  onVariantComplete={(variant, config) => console.log('Variant completed:', variant, config)}
  onGestureAnimationStart={(gesture) => console.log('Gesture started:', gesture)}
  onGestureAnimationEnd={(gesture) => console.log('Gesture ended:', gesture)}
>
  Advanced Animation
</Motion.div>
```

## Advanced Usage

### Combining Multiple Features

```tsx
<Motion.div
  // Spring animation
  spring="bouncy"
  
  // Keyframe animation
  keyframes={{ 
    rotate: [0, 360, 0],
    scale: [1, 1.2, 1]
  }}
  keyframeEasing="elastic"
  
  // Variants
  variants={{
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.1, y: -10 }
  }}
  
  // Gesture animations
  gestureAnimation={true}
  gestureVariants={{
    drag_start: { scale: 1.05 },
    drag_end: { scale: 1 }
  }}
  
  initial="hidden"
  animate="visible"
  whileHover="hover"
>
  Combined Animation
</Motion.div>
```

### Custom Animation Controllers

```tsx
import { 
  createSpringConfig, 
  createKeyframeAnimation, 
  createVariantController,
  createGestureAnimationController 
} from "solid-motionone"

// Create individual controllers
const springController = createSpringConfig("bouncy")
const keyframeController = createKeyframeAnimation({
  x: [0, 100, 0],
  y: [0, -20, 0]
})
const variantController = createVariantController({
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
})
const gestureController = createGestureAnimationController({
  drag_start: { scale: 1.05 },
  drag_end: { scale: 1 }
})
```

### Animation Orchestration

```tsx
import { createAdvancedAnimationController } from "solid-motionone"

const controller = createAdvancedAnimationController({
  spring: "bouncy",
  keyframes: { rotate: [0, 360] },
  variants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  orchestration: "parallel" // or "sequential"
})

// Play all animations in parallel
controller.play()

// Play animations sequentially
controller.setOrchestration("sequential")
controller.play()
```

## Performance Considerations

### Bundle Size Impact

- **Spring Animations**: +0.2kb
- **Keyframe Animations**: +0.2kb  
- **Animation Variants**: +0.2kb
- **Gesture Animations**: +0.1kb
- **Advanced Controller**: +0.1kb
- **Total Phase 6 Impact**: +0.8kb

### Optimization Tips

1. **Use Presets**: Leverage built-in presets instead of custom configurations
2. **Lazy Loading**: Import specific features only when needed
3. **Animation Limits**: Avoid running too many complex animations simultaneously
4. **Event Handler Optimization**: Use event handlers sparingly to avoid performance overhead

## Migration Guide

### From Previous Versions

Phase 6 features are additive and don't break existing functionality:

```tsx
// Existing code continues to work
<Motion.div animate={{ x: 100 }}>
  Existing Animation
</Motion.div>

// New features can be added incrementally
<Motion.div 
  animate={{ x: 100 }}
  spring="bouncy"  // New feature
>
  Enhanced Animation
</Motion.div>
```

### Progressive Enhancement

```tsx
// Start with basic animation
<Motion.div animate={{ opacity: 1 }}>
  Basic
</Motion.div>

// Add spring physics
<Motion.div 
  animate={{ opacity: 1 }}
  spring="gentle"
>
  With Spring
</Motion.div>

// Add variants
<Motion.div 
  animate={{ opacity: 1 }}
  spring="gentle"
  variants={{
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }}
  initial="hidden"
  animate="visible"
>
  With Variants
</Motion.div>
```

## Examples

### Interactive Card Component

```tsx
function InteractiveCard() {
  return (
    <Motion.div
      spring="bouncy"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
        hover: { y: -10, scale: 1.05 }
      }}
      gestureAnimation={true}
      gestureVariants={{
        press_start: { scale: 0.95 },
        press_end: { scale: 1 }
      }}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      style={{
        padding: "20px",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        cursor: "pointer"
      }}
    >
      Interactive Card
    </Motion.div>
  )
}
```

### Animated List

```tsx
function AnimatedList() {
  const items = ["Item 1", "Item 2", "Item 3", "Item 4"]
  
  return (
    <div>
      <For each={items}>
        {(item, index) => (
          <Motion.div
            spring="gentle"
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 }
            }}
            initial="hidden"
            animate="visible"
            transition={{ delay: index() * 0.1 }}
            style={{
              padding: "10px",
              margin: "5px 0",
              background: "#f0f0f0",
              borderRadius: "4px"
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

### Gesture-Controlled Gallery

```tsx
function GestureGallery() {
  return (
    <Motion.div
      gestureAnimation={true}
      gestureVariants={{
        drag_start: { scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" },
        drag_move: { x: 0, y: 0 },
        drag_end: { scale: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
        pinch_start: { scale: 1, opacity: 0.8 },
        pinch_move: { scale: 1, rotate: 0 },
        pinch_end: { scale: 1, opacity: 1 }
      }}
      style={{
        width: "300px",
        height: "200px",
        background: "linear-gradient(45deg, #667eea, #764ba2)",
        borderRadius: "8px",
        cursor: "grab"
      }}
    >
      Gesture Gallery
    </Motion.div>
  )
}
```

## Troubleshooting

### Common Issues

1. **Spring Animation Not Working**
   - Ensure spring configuration is valid
   - Check that animate values are numbers, not strings

2. **Keyframes Not Playing**
   - Verify keyframe arrays have at least 2 values
   - Check easing function is valid

3. **Variants Not Switching**
   - Ensure variant names match exactly
   - Check that initial/animate props are set correctly

4. **Gesture Animations Not Triggering**
   - Verify gestureAnimation is set to true
   - Check gesture variant names match gesture events

### Debug Mode

Enable debug mode to see animation state:

```tsx
<Motion.div
  spring="bouncy"
  onSpringStart={(config) => console.log('Spring config:', config)}
  onSpringComplete={(config) => console.log('Spring completed:', config)}
>
  Debug Animation
</Motion.div>
```

## Future Enhancements

- **Animation Timeline Editor**: Visual timeline editor for complex animations
- **Performance Profiling**: Built-in performance monitoring
- **Animation Templates**: Pre-built animation templates for common use cases
- **Advanced Easing**: More sophisticated easing functions and curves
- **Animation Export**: Export animations as reusable components

---

For more information, see the [full API documentation](../api.md) and [examples](../examples.md).
