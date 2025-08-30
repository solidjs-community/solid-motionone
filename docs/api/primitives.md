# Primitives API

The primitives module provides low-level animation utilities for advanced use cases where you need more control than the `Motion` component provides.

## createMotion

Creates a motion state for an element with reactive options.

### Usage

```tsx
import { createMotion } from 'solid-motionone'

function CustomAnimatedComponent() {
  let elementRef!: HTMLDivElement
  
  const motionState = createMotion(
    elementRef,
    () => ({
      animate: { x: 100, opacity: 1 },
      transition: { duration: 0.5 }
    })
  )
  
  return <div ref={elementRef}>Animated Element</div>
}
```

### Signature

```typescript
function createMotion(
  target: Element,
  options: Accessor<Options> | Options,
  presenceState?: PresenceContextState
): MotionState
```

### Parameters

- **target**: The DOM element to animate
- **options**: Animation options (reactive accessor or static object)
- **presenceState**: Optional presence context for exit animations

### Returns

A `MotionState` object from Motion One that provides low-level animation control.

## motion (Directive)

A SolidJS directive for easily adding animations to elements.

### Usage

```tsx
import { motion } from 'solid-motionone'

function App() {
  const [animationOptions, setAnimationOptions] = createSignal({
    animate: { rotate: 180 },
    transition: { duration: 1 }
  })
  
  return (
    <div use:motion={animationOptions}>
      I will rotate!
    </div>
  )
}
```

### Signature

```typescript
function motion(
  el: Element, 
  props: Accessor<Options>
): void
```

### Parameters

- **el**: The element to animate (automatically provided by the directive)
- **props**: Reactive accessor returning animation options

## createAndBindMotionState (Internal)

Internal function that creates and binds a motion state to an element with SolidJS reactivity.

### Signature

```typescript
function createAndBindMotionState(
  el: () => Element,
  options: Accessor<Options>,
  presence_state?: PresenceContextState,
  parent_state?: MotionState,
): [MotionState, ReturnType<typeof createStyles>]
```

### Usage

This function is primarily used internally by the `Motion` component, but can be useful for advanced integrations:

```tsx
function AdvancedComponent() {
  let elementRef!: HTMLDivElement
  
  const [state, styles] = createAndBindMotionState(
    () => elementRef,
    () => ({ animate: { x: 100 } }),
    undefined, // no presence context
    undefined  // no parent state
  )
  
  // Apply styles manually or use with custom rendering
  return <div ref={elementRef} style={styles}>Content</div>
}
```

## Advanced Examples

### Custom Animation Hook

```tsx
function createCustomAnimation(target: () => Element) {
  const [isAnimating, setIsAnimating] = createSignal(false)
  
  const animate = (values: any) => {
    setIsAnimating(true)
    
    const motionState = createMotion(
      target(),
      {
        animate: values,
        transition: { duration: 0.5 }
      }
    )
    
    // Listen for completion
    target().addEventListener('motioncomplete', () => {
      setIsAnimating(false)
    }, { once: true })
    
    return motionState
  }
  
  return { animate, isAnimating }
}

// Usage
function MyComponent() {
  let ref!: HTMLDivElement
  const { animate, isAnimating } = createCustomAnimation(() => ref)
  
  return (
    <div>
      <div ref={ref}>Animated Element</div>
      <button 
        onClick={() => animate({ x: Math.random() * 200 })}
        disabled={isAnimating()}
      >
        Animate to Random Position
      </button>
    </div>
  )
}
```

### Imperative Animation Control

```tsx
function ImperativeExample() {
  let elementRef!: HTMLDivElement
  let motionState: MotionState
  
  onMount(() => {
    motionState = createMotion(elementRef, {
      initial: { x: 0, opacity: 0 }
    })
  })
  
  const animateIn = () => {
    motionState.animate({ x: 0, opacity: 1 })
  }
  
  const animateOut = () => {
    motionState.animate({ x: -100, opacity: 0 })
  }
  
  const reset = () => {
    motionState.animate({ x: 0, opacity: 0.5 })
  }
  
  return (
    <div>
      <div ref={elementRef}>Controlled Element</div>
      <button onClick={animateIn}>Animate In</button>
      <button onClick={animateOut}>Animate Out</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

### Directive with Dynamic Options

```tsx
function DirectiveExample() {
  const [scale, setScale] = createSignal(1)
  const [rotation, setRotation] = createSignal(0)
  
  // Reactive options that update when signals change
  const motionOptions = createMemo(() => ({
    animate: {
      scale: scale(),
      rotate: rotation()
    },
    transition: { duration: 0.3 }
  }))
  
  return (
    <div>
      <div use:motion={motionOptions} class="box">
        Dynamic Animation
      </div>
      
      <div class="controls">
        <input 
          type="range" 
          min="0.5" 
          max="2" 
          step="0.1"
          value={scale()}
          onInput={(e) => setScale(parseFloat(e.target.value))}
        />
        <input 
          type="range" 
          min="0" 
          max="360" 
          step="1"
          value={rotation()}
          onInput={(e) => setRotation(parseInt(e.target.value))}
        />
      </div>
    </div>
  )
}
```

### Custom Presence Integration

```tsx
function CustomPresenceExample() {
  const [items, setItems] = createSignal([1, 2, 3])
  
  const removeItem = (id: number) => {
    // Find the element
    const element = document.querySelector(`[data-id="${id}"]`)
    
    if (element) {
      // Create motion state with exit animation
      const motionState = createMotion(element, {
        animate: { x: -100, opacity: 0 },
        transition: { duration: 0.3 }
      })
      
      // Wait for animation to complete before removing from state
      element.addEventListener('motioncomplete', () => {
        setItems(items => items.filter(item => item !== id))
      }, { once: true })
    }
  }
  
  return (
    <div>
      <For each={items()}>
        {(item) => (
          <div data-id={item} use:motion={() => ({
            initial: { x: 100, opacity: 0 },
            animate: { x: 0, opacity: 1 },
            transition: { duration: 0.3 }
          })}>
            Item {item}
            <button onClick={() => removeItem(item)}>Remove</button>
          </div>
        )}
      </For>
    </div>
  )
}
```

## TypeScript Types

### Options
```typescript
interface Options {
  initial?: VariantDefinition | false
  animate?: VariantDefinition
  exit?: VariantDefinition
  transition?: TransitionDefinition
  variants?: { [key: string]: VariantDefinition }
  hover?: VariantDefinition
  press?: VariantDefinition
  inView?: VariantDefinition
  inViewOptions?: IntersectionObserverInit
}
```

### MotionState
```typescript
// From @motionone/dom
interface MotionState {
  mount(element: Element): () => void
  update(options: Options): void
  setActive(key: string, isActive: boolean): void
  getOptions(): Options
  getTarget(): { [key: string]: any }
  animate(definition: VariantDefinition): void
}
```

### PresenceContextState
```typescript
interface PresenceContextState {
  initial: boolean
  mount: Accessor<boolean>
}
```

## Performance Tips

### Reusing Motion States
```tsx
// ✅ Good - reuse motion state
const motionState = createMotion(element, options)

// ❌ Avoid - creating new states repeatedly
createEffect(() => {
  createMotion(element, { animate: someSignal() })
})
```

### Batching Updates
```tsx
// ✅ Good - batch multiple property updates
batch(() => {
  setX(100)
  setY(200)
  setOpacity(0.5)
})

// ❌ Avoid - separate updates cause multiple animations
setX(100)
setY(200)
setOpacity(0.5)
```

### Memory Management
```tsx
// ✅ Good - clean up on unmount
onCleanup(() => {
  // Motion states clean up automatically, but custom event listeners should be removed
  element.removeEventListener('custom-event', handler)
})
```

## Common Use Cases

- **Custom Components**: When you need animation control but want to handle your own rendering
- **Third-party Integration**: Animating elements from other libraries
- **Imperative Control**: When declarative API isn't sufficient
- **Performance Optimization**: Direct control over when animations run
- **Complex State Management**: Integration with external state management systems