# Performance Guide

This guide covers performance optimization techniques and best practices for solid-motionone animations.

## Core Performance Principles

### GPU Acceleration

Always prefer properties that can be hardware-accelerated:

```tsx
// ✅ GPU-accelerated properties
<Motion.div animate={{
  x: 100,           // transform: translateX()
  y: 50,            // transform: translateY()
  scale: 1.2,       // transform: scale()
  rotate: 45,       // transform: rotate()
  opacity: 0.8      // opacity
}} />

// ❌ Avoid layout-triggering properties
<Motion.div animate={{
  left: "100px",    // Causes layout recalculation
  top: "50px",      // Causes layout recalculation  
  width: "200px",   // Causes layout recalculation
  height: "150px"   // Causes layout recalculation
}} />
```

### Will-Change Optimization

For elements that animate frequently:

```css
.frequently-animated {
  will-change: transform, opacity;
}

/* Remove when animation is complete */
.animation-complete {
  will-change: auto;
}
```

## Reactive Performance

### Batch Signal Updates

```tsx
import { batch } from 'solid-js'

function OptimizedComponent() {
  const [x, setX] = createSignal(0)
  const [y, setY] = createSignal(0)
  const [scale, setScale] = createSignal(1)
  
  // ✅ Good - batches all updates into single animation
  const updatePositionBatched = () => {
    batch(() => {
      setX(Math.random() * 200)
      setY(Math.random() * 200)
      setScale(1 + Math.random() * 0.5)
    })
  }
  
  // ❌ Bad - causes three separate animations
  const updatePositionUnbatched = () => {
    setX(Math.random() * 200)    // Animation 1
    setY(Math.random() * 200)    // Animation 2  
    setScale(1 + Math.random() * 0.5)  // Animation 3
  }
  
  return (
    <Motion.div
      animate={{ x: x(), y: y(), scale: scale() }}
      transition={{ duration: 0.3 }}
    >
      Optimized Updates
    </Motion.div>
  )
}
```

### Memo for Expensive Calculations

```tsx
function ExpensiveAnimationConfig() {
  const [complexity, setComplexity] = createSignal(5)
  
  // ✅ Memoize expensive animation calculations
  const animationConfig = createMemo(() => {
    const config = { duration: 0.3 }
    
    // Expensive calculation only runs when complexity changes
    for (let i = 0; i < complexity() * 1000; i++) {
      // Complex calculation
    }
    
    return {
      ...config,
      easing: complexity() > 3 ? "easeOut" : "easeIn"
    }
  })
  
  return (
    <Motion.div
      animate={{ rotate: complexity() * 45 }}
      transition={animationConfig()}
    >
      Complex Animation
    </Motion.div>
  )
}
```

## Animation Optimization Techniques

### Reduce Animation Frequency

```tsx
function ThrottledAnimation() {
  const [mousePos, setMousePos] = createSignal({ x: 0, y: 0 })
  let throttleTimer: number | null = null
  
  const handleMouseMove = (e: MouseEvent) => {
    // ✅ Throttle expensive operations
    if (throttleTimer) return
    
    throttleTimer = requestAnimationFrame(() => {
      setMousePos({ x: e.clientX, y: e.clientY })
      throttleTimer = null
    })
  }
  
  return (
    <div onMouseMove={handleMouseMove}>
      <Motion.div
        animate={{ 
          x: mousePos().x / 10, 
          y: mousePos().y / 10 
        }}
        transition={{ duration: 0 }} // Immediate updates
      >
        Mouse Follower
      </Motion.div>
    </div>
  )
}
```

### Animation Pooling

Reuse animation configurations:

```tsx
// ✅ Define reusable animation configurations
const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.4 }
  }
} as const

function EfficientAnimations() {
  return (
    <div>
      <Motion.div {...ANIMATIONS.fadeIn}>
        Fade In Content
      </Motion.div>
      <Motion.div {...ANIMATIONS.slideUp}>
        Slide Up Content
      </Motion.div>
    </div>
  )
}
```

### Lazy Animation Loading

Only create complex animations when needed:

```tsx
function ConditionalAnimations() {
  const [enableAdvanced, setEnableAdvanced] = createSignal(false)
  
  const basicAnimation = { opacity: 1 }
  
  const advancedAnimation = createMemo(() => {
    if (!enableAdvanced()) return basicAnimation
    
    return {
      x: [0, 50, -50, 0],
      y: [0, -25, 25, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.1, 0.9, 1]
    }
  })
  
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={enableAdvanced()}
          onChange={(e) => setEnableAdvanced(e.target.checked)}
        />
        Enable advanced animations
      </label>
      
      <Motion.div
        animate={advancedAnimation()}
        transition={{ duration: enableAdvanced() ? 2 : 0.3 }}
      >
        Conditional Animation
      </Motion.div>
    </div>
  )
}
```

## Memory Management

### Proper Cleanup

```tsx
function ProperCleanup() {
  let animationController: AbortController
  
  onMount(() => {
    animationController = new AbortController()
  })
  
  onCleanup(() => {
    // ✅ Clean up ongoing animations
    animationController?.abort()
  })
  
  const startComplexAnimation = () => {
    const signal = animationController.signal
    
    // Animation with cleanup awareness
    if (signal.aborted) return
    
    // Start animation...
  }
  
  return <Motion.div>Properly Cleaned Up</Motion.div>
}
```

### Avoid Memory Leaks

```tsx
function MemoryEfficientComponent() {
  const [elements] = createSignal(new Set<Element>())
  
  // ✅ Clean up references to DOM elements
  onCleanup(() => {
    elements().clear()
  })
  
  const registerElement = (el: Element) => {
    elements().add(el)
    
    // Clean up when element is removed
    return () => elements().delete(el)
  }
  
  return (
    <Motion.div ref={registerElement}>
      Memory Efficient
    </Motion.div>
  )
}
```

## Scroll Performance

### Passive Event Listeners

```tsx
function EfficientScrollAnimations() {
  const [scrollY, setScrollY] = createSignal(0)
  
  createEffect(() => {
    // ✅ Use passive listeners for scroll events
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    onCleanup(() => {
      window.removeEventListener('scroll', handleScroll)
    })
  })
  
  // Use transform instead of changing position
  const parallaxOffset = () => scrollY() * -0.5
  
  return (
    <Motion.div
      animate={{ y: parallaxOffset() }}
      transition={{ duration: 0 }} // No transition for scroll-linked
    >
      Parallax Content
    </Motion.div>
  )
}
```

### Intersection Observer for Visibility

```tsx
function VisibilityOptimizedAnimations() {
  const [isVisible, setIsVisible] = createSignal(false)
  const [ref, setRef] = createSignal<Element>()
  
  createEffect(() => {
    const element = ref()
    if (!element) return
    
    // ✅ Only animate when element is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading before element is visible
      }
    )
    
    observer.observe(element)
    
    onCleanup(() => observer.disconnect())
  })
  
  return (
    <Motion.div
      ref={setRef}
      animate={{ 
        opacity: isVisible() ? 1 : 0.3,
        scale: isVisible() ? 1 : 0.8
      }}
      transition={{ duration: 0.3 }}
    >
      Visibility Optimized
    </Motion.div>
  )
}
```

## Bundle Size Optimization

### Tree Shaking

```tsx
// ✅ Import only what you need
import { Motion, Presence } from 'solid-motionone'

// ❌ Don't import everything
// import * as SolidMotion from 'solid-motionone'
```

### Conditional Loading

```tsx
// Lazy load heavy animation features
const LazyAdvancedAnimations = lazy(() => import('./AdvancedAnimations'))

function App() {
  const [showAdvanced, setShowAdvanced] = createSignal(false)
  
  return (
    <div>
      <Show 
        when={showAdvanced()}
        fallback={<SimpleAnimations />}
      >
        <Suspense fallback={<div>Loading advanced animations...</div>}>
          <LazyAdvancedAnimations />
        </Suspense>
      </Show>
    </div>
  )
}
```

## Performance Monitoring

### Animation Performance Metrics

```tsx
function PerformanceMonitoredAnimation() {
  const [performanceData, setPerformanceData] = createSignal<{
    fps: number
    animationDuration: number
  }>()
  
  const measurePerformance = () => {
    const startTime = performance.now()
    let frameCount = 0
    
    const measureFrame = () => {
      frameCount++
      const currentTime = performance.now()
      const duration = currentTime - startTime
      
      if (duration >= 1000) {
        const fps = Math.round((frameCount * 1000) / duration)
        setPerformanceData({
          fps,
          animationDuration: duration
        })
        return
      }
      
      requestAnimationFrame(measureFrame)
    }
    
    requestAnimationFrame(measureFrame)
  }
  
  return (
    <div>
      <Motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          easing: "linear"
        }}
        onMotionStart={measurePerformance}
      >
        Performance Monitored
      </Motion.div>
      
      <Show when={performanceData()}>
        <div>
          FPS: {performanceData()?.fps}
          Duration: {performanceData()?.animationDuration.toFixed(2)}ms
        </div>
      </Show>
    </div>
  )
}
```

### Development Performance Tools

```tsx
// Development-only performance warnings
function DevPerformanceWarnings() {
  const [animationCount, setAnimationCount] = createSignal(0)
  
  createEffect(() => {
    if (import.meta.env.DEV && animationCount() > 10) {
      console.warn(
        `High animation count detected: ${animationCount()}. ` +
        'Consider optimizing or virtualizing animations.'
      )
    }
  })
  
  return (
    <div>
      {/* Your animated components */}
      <Motion.div 
        onMotionStart={() => setAnimationCount(prev => prev + 1)}
        onMotionComplete={() => setAnimationCount(prev => prev - 1)}
      >
        Monitored Animation
      </Motion.div>
    </div>
  )
}
```

## Performance Checklist

### ✅ Do's

- Use `transform` and `opacity` properties
- Batch signal updates with `batch()`
- Use `createMemo()` for expensive calculations
- Implement proper cleanup in `onCleanup()`
- Use Intersection Observer for visibility-based animations
- Add `will-change` for frequently animated elements
- Throttle high-frequency events (mouse move, scroll)
- Use passive event listeners for scroll events
- Profile animations in development

### ❌ Don'ts

- Animate layout properties (width, height, top, left)
- Create animations in render loops
- Ignore cleanup in `onCleanup()`
- Update signals unnecessarily in tight loops
- Use complex calculations in animation frames
- Animate too many elements simultaneously
- Ignore browser performance warnings
- Skip performance testing on low-end devices

## Browser-Specific Optimizations

### Safari Optimizations

```tsx
// Safari has different performance characteristics
function SafariOptimizedAnimation() {
  const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  
  return (
    <Motion.div
      animate={{ scale: 1.1 }}
      transition={{
        // Safari benefits from longer durations
        duration: isSafari() ? 0.4 : 0.3,
        // Safari prefers ease-out for perceived smoothness
        easing: isSafari() ? "easeOut" : "easeInOut"
      }}
    >
      Safari Optimized
    </Motion.div>
  )
}
```

### Mobile Optimizations

```tsx
function MobileOptimizedAnimation() {
  const [isMobile, setIsMobile] = createSignal(
    window.innerWidth < 768 || 'ontouchstart' in window
  )
  
  return (
    <Motion.div
      animate={{ y: isMobile() ? 5 : 10 }}
      transition={{
        // Shorter durations on mobile for perceived responsiveness
        duration: isMobile() ? 0.2 : 0.3,
        // Simpler easing on mobile to reduce CPU usage
        easing: isMobile() ? "easeOut" : [0.25, 0.1, 0.25, 1]
      }}
    >
      Mobile Optimized
    </Motion.div>
  )
}
```

Following these performance guidelines will ensure your animations run smoothly across all devices and browsers while maintaining an excellent user experience.