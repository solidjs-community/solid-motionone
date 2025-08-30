# Advanced Animations

This guide covers advanced animation techniques and patterns for creating sophisticated interactions with solid-motionone.

## Complex Keyframe Sequences

### Multi-Property Keyframes

```tsx
function ComplexKeyframes() {
  return (
    <Motion.div
      animate={{
        x: [0, 100, 50, 150, 0],
        y: [0, -50, 50, -25, 0], 
        rotate: [0, 90, 180, 270, 360],
        scale: [1, 1.2, 0.8, 1.1, 1],
        opacity: [0.5, 1, 0.7, 1, 0.9]
      }}
      transition={{
        duration: 2,
        times: [0, 0.2, 0.5, 0.8, 1], // Custom timing for each keyframe
        easing: "easeInOut"
      }}
    >
      Complex Path Animation
    </Motion.div>
  )
}
```

### Per-Property Timing

```tsx
function IndependentProperties() {
  return (
    <Motion.div
      animate={{ 
        x: 200, 
        rotate: 180, 
        backgroundColor: "#ff0000" 
      }}
      transition={{
        x: { 
          duration: 1, 
          easing: "easeOut" 
        },
        rotate: { 
          duration: 2, 
          easing: [0.68, -0.55, 0.265, 1.55] // Custom cubic-bezier
        },
        backgroundColor: { 
          duration: 0.5, 
          delay: 0.5 
        }
      }}
    >
      Independent Timing
    </Motion.div>
  )
}
```

## Advanced Variant Systems

### Nested Variants with Orchestration

```tsx
function OrchestrationExample() {
  const [isOpen, setIsOpen] = createSignal(false)
  
  const containerVariants = {
    closed: {
      opacity: 0,
      scale: 0.8,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.1,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
  
  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 }
  }
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen())}>
        Toggle Menu
      </button>
      
      <Motion.div
        variants={containerVariants}
        animate={isOpen() ? "open" : "closed"}
        class="menu-container"
      >
        <For each={["Home", "About", "Services", "Contact"]}>
          {(item) => (
            <Motion.div
              variants={itemVariants}
              class="menu-item"
            >
              {item}
            </Motion.div>
          )}
        </For>
      </Motion.div>
    </div>
  )
}
```

### Dynamic Variants

```tsx
function DynamicVariants() {
  const [intensity, setIntensity] = createSignal(1)
  
  // Create variants dynamically based on intensity
  const createVariants = (intensity: number) => ({
    idle: { 
      scale: 1, 
      rotate: 0 
    },
    active: { 
      scale: 1 + (intensity * 0.3),
      rotate: intensity * 15,
      transition: {
        duration: 0.3 + (intensity * 0.2)
      }
    }
  })
  
  return (
    <div>
      <input
        type="range"
        min="0"
        max="3"
        step="0.1"
        value={intensity()}
        onInput={(e) => setIntensity(parseFloat(e.target.value))}
      />
      
      <Motion.div
        variants={createVariants(intensity())}
        animate="active"
        class="dynamic-element"
      >
        Intensity: {intensity().toFixed(1)}
      </Motion.div>
    </div>
  )
}
```

## Advanced Interaction Patterns

### Multi-State Interactions

```tsx
function MultiStateButton() {
  const [state, setState] = createSignal<'idle' | 'loading' | 'success' | 'error'>('idle')
  
  const variants = {
    idle: { 
      scale: 1, 
      backgroundColor: "#3b82f6",
      rotate: 0
    },
    loading: { 
      scale: 0.95, 
      backgroundColor: "#6b7280",
      rotate: 360,
      transition: {
        rotate: {
          duration: 1,
          repeat: Infinity,
          easing: "linear"
        }
      }
    },
    success: { 
      scale: 1.05, 
      backgroundColor: "#10b981",
      rotate: 0
    },
    error: { 
      scale: 1,
      backgroundColor: "#ef4444", 
      x: [-5, 5, -5, 5, 0],
      transition: {
        x: { duration: 0.4 }
      }
    }
  }
  
  const handleClick = async () => {
    setState('loading')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setState('success')
      setTimeout(() => setState('idle'), 1500)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 1500)
    }
  }
  
  return (
    <Motion.button
      variants={variants}
      animate={state()}
      onClick={handleClick}
      disabled={state() !== 'idle'}
    >
      {state() === 'idle' && 'Click Me'}
      {state() === 'loading' && 'Loading...'}
      {state() === 'success' && 'Success!'}
      {state() === 'error' && 'Error!'}
    </Motion.button>
  )
}
```

### Gesture-Based Animations

```tsx
function SwipeCard() {
  const [offset, setOffset] = createSignal(0)
  const [isDragging, setIsDragging] = createSignal(false)
  
  let startX = 0
  let currentX = 0
  
  const handleStart = (e: PointerEvent) => {
    setIsDragging(true)
    startX = e.clientX
    currentX = e.clientX
  }
  
  const handleMove = (e: PointerEvent) => {
    if (!isDragging()) return
    
    currentX = e.clientX
    const diff = currentX - startX
    setOffset(diff)
  }
  
  const handleEnd = () => {
    setIsDragging(false)
    
    // Snap back or dismiss based on distance
    if (Math.abs(offset()) > 100) {
      // Dismiss
      setOffset(offset() > 0 ? 300 : -300)
    } else {
      // Snap back
      setOffset(0)
    }
  }
  
  return (
    <Motion.div
      animate={{
        x: offset(),
        rotate: offset() / 10,
        opacity: 1 - Math.abs(offset()) / 300
      }}
      transition={{
        duration: isDragging() ? 0 : 0.3,
        easing: "easeOut"
      }}
      onPointerDown={handleStart}
      onPointerMove={handleMove}
      onPointerUp={handleEnd}
      class="swipe-card"
    >
      <h3>Swipeable Card</h3>
      <p>Swipe left or right to dismiss</p>
    </Motion.div>
  )
}
```

## Advanced Exit Animations

### Coordinated Group Exits

```tsx
function CoordinatedExits() {
  const [items, setItems] = createSignal([1, 2, 3, 4, 5])
  
  const removeAll = () => {
    // Remove items one by one with delay
    items().forEach((_, index) => {
      setTimeout(() => {
        setItems(prev => prev.slice(1))
      }, index * 100)
    })
  }
  
  return (
    <div>
      <button onClick={removeAll}>Remove All</button>
      <button onClick={() => setItems([1, 2, 3, 4, 5])}>Reset</button>
      
      <Presence>
        <For each={items()}>
          {(item, index) => (
            <Motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ 
                opacity: 0, 
                x: 50,
                transition: { 
                  duration: 0.3,
                  easing: "easeIn"
                }
              }}
              class="coordinated-item"
            >
              Item {item}
            </Motion.div>
          )}
        </For>
      </Presence>
    </div>
  )
}
```

### Modal with Backdrop

```tsx
function AdvancedModal() {
  const [isOpen, setIsOpen] = createSignal(false)
  
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <Presence>
        <Show when={isOpen()}>
          <Portal>
            {/* Backdrop */}
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              class="modal-backdrop"
            >
              {/* Modal Content */}
              <Motion.div
                initial={{ 
                  scale: 0.7, 
                  opacity: 0,
                  y: -50 
                }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: 0 
                }}
                exit={{ 
                  scale: 0.7, 
                  opacity: 0,
                  y: 50,
                  transition: { duration: 0.2 }
                }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                onClick={(e) => e.stopPropagation()}
                class="modal-content"
              >
                <h2>Advanced Modal</h2>
                <p>This modal has sophisticated enter/exit animations.</p>
                <button onClick={() => setIsOpen(false)}>Close</button>
              </Motion.div>
            </Motion.div>
          </Portal>
        </Show>
      </Presence>
    </div>
  )
}
```

## Performance Optimizations

### Lazy Animation Loading

```tsx
function LazyAnimations() {
  const [shouldAnimate, setShouldAnimate] = createSignal(false)
  
  // Only create complex animations when needed
  const complexVariants = createMemo(() => {
    if (!shouldAnimate()) return {}
    
    return {
      idle: { 
        rotate: 0,
        scale: 1 
      },
      active: { 
        rotate: [0, 5, -5, 0],
        scale: [1, 1.05, 0.95, 1],
        transition: {
          duration: 2,
          repeat: Infinity
        }
      }
    }
  })
  
  return (
    <div>
      <label>
        <input 
          type="checkbox"
          checked={shouldAnimate()}
          onChange={(e) => setShouldAnimate(e.target.checked)}
        />
        Enable complex animations
      </label>
      
      <Motion.div
        variants={complexVariants()}
        animate={shouldAnimate() ? "active" : "idle"}
        class="lazy-element"
      >
        Conditional Animation
      </Motion.div>
    </div>
  )
}
```

### Animation Pooling

```tsx
// Reuse animation configurations
const ANIMATION_CONFIGS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.4, easing: "easeOut" }
  },
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.3, easing: [0.68, -0.55, 0.265, 1.55] }
  }
}

function OptimizedComponents() {
  return (
    <div>
      <Motion.div {...ANIMATION_CONFIGS.fadeIn}>
        Fade In Component
      </Motion.div>
      
      <Motion.div {...ANIMATION_CONFIGS.slideUp}>
        Slide Up Component  
      </Motion.div>
      
      <Motion.div {...ANIMATION_CONFIGS.scaleIn}>
        Scale In Component
      </Motion.div>
    </div>
  )
}
```

## Custom Animation Hooks

### useAnimationSequence

```tsx
function createAnimationSequence() {
  const [currentStep, setCurrentStep] = createSignal(0)
  const [isPlaying, setIsPlaying] = createSignal(false)
  
  const sequence = [
    { x: 0, y: 0, scale: 1 },
    { x: 100, y: 0, scale: 1.2 },
    { x: 100, y: 100, scale: 1 },
    { x: 0, y: 100, scale: 0.8 },
    { x: 0, y: 0, scale: 1 }
  ]
  
  const play = () => {
    setIsPlaying(true)
    setCurrentStep(0)
    
    const playNextStep = () => {
      if (currentStep() < sequence.length - 1) {
        setTimeout(() => {
          setCurrentStep(prev => prev + 1)
          playNextStep()
        }, 800)
      } else {
        setIsPlaying(false)
      }
    }
    
    playNextStep()
  }
  
  const currentAnimation = () => sequence[currentStep()]
  
  return { play, isPlaying, currentAnimation, currentStep }
}

function SequenceExample() {
  const { play, isPlaying, currentAnimation } = createAnimationSequence()
  
  return (
    <div>
      <button onClick={play} disabled={isPlaying()}>
        {isPlaying() ? 'Playing...' : 'Play Sequence'}
      </button>
      
      <Motion.div
        animate={currentAnimation()}
        transition={{ duration: 0.8, easing: "easeInOut" }}
        class="sequence-box"
      >
        Animated Sequence
      </Motion.div>
    </div>
  )
}
```

### useIntersectionAnimation

```tsx
function createIntersectionAnimation(threshold = 0.1) {
  const [ref, setRef] = createSignal<Element>()
  const [isVisible, setIsVisible] = createSignal(false)
  const [hasAnimated, setHasAnimated] = createSignal(false)
  
  createEffect(() => {
    const element = ref()
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (!hasAnimated()) {
            setHasAnimated(true)
          }
        } else {
          setIsVisible(false)
        }
      },
      { threshold }
    )
    
    observer.observe(element)
    
    onCleanup(() => observer.disconnect())
  })
  
  return { ref: setRef, isVisible, hasAnimated }
}

function ScrollAnimation() {
  const { ref, isVisible, hasAnimated } = createIntersectionAnimation(0.3)
  
  return (
    <div style={{ height: '200vh', padding: '50px' }}>
      <h2>Scroll down to see the animation</h2>
      
      <div style={{ height: '100vh' }} />
      
      <Motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50, rotateX: -15 }}
        animate={{
          opacity: isVisible() ? 1 : 0,
          y: isVisible() ? 0 : 50,
          rotateX: isVisible() ? 0 : -15
        }}
        transition={{
          duration: 0.8,
          easing: "easeOut",
          delay: hasAnimated() ? 0 : 0.2
        }}
        class="scroll-reveal"
      >
        <h3>I animate when visible!</h3>
        <p>This content appears with a 3D rotation effect.</p>
        <p>Visibility: {isVisible() ? 'Visible' : 'Hidden'}</p>
        <p>Has Animated: {hasAnimated() ? 'Yes' : 'No'}</p>
      </Motion.div>
    </div>
  )
}
```

## Best Practices

### Animation Timing

```tsx
// Use consistent timing scales
const TIMING = {
  fast: 0.15,
  medium: 0.3,
  slow: 0.6,
  verySlow: 1.2
} as const

// Apply timing consistently
<Motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: TIMING.medium }}
/>
```

### Easing Functions

```tsx
// Define reusable easing functions
const EASING = {
  smooth: [0.25, 0.1, 0.25, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  sharp: [0.4, 0, 0.2, 1],
  gentle: [0.25, 0.46, 0.45, 0.94]
} as const

<Motion.div
  animate={{ scale: 1.1 }}
  transition={{ 
    duration: TIMING.medium,
    easing: EASING.bounce 
  }}
/>
```

### Responsive Animations

```tsx
function ResponsiveAnimation() {
  const [isMobile, setIsMobile] = createSignal(window.innerWidth < 768)
  
  createEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    onCleanup(() => window.removeEventListener('resize', handleResize))
  })
  
  return (
    <Motion.div
      animate={{ 
        y: isMobile() ? 10 : 20,
        scale: isMobile() ? 1.05 : 1.1
      }}
      transition={{ 
        duration: isMobile() ? 0.2 : 0.4 
      }}
    >
      Responsive Animation
    </Motion.div>
  )
}
```

These advanced patterns will help you create sophisticated, performant animations that enhance your user interface without sacrificing performance or accessibility.