# Motion Component API

The `Motion` component is the core of solid-motionone, providing a declarative API for creating smooth animations in SolidJS applications.

## Basic Usage

```tsx
import { Motion } from 'solid-motionone'

function App() {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Hello World
    </Motion.div>
  )
}
```

## Component Variants

### Proxy Syntax
```tsx
// Any HTML element
<Motion.div />
<Motion.button />
<Motion.h1 />
<Motion.span />

// SVG elements
<Motion.svg />
<Motion.circle />
<Motion.path />
```

### Tag Prop Syntax
```tsx
<Motion tag="button" />
<Motion tag="section" />
<Motion tag="article" />
```

## Animation Props

### `animate`
Target values to animate to. Accepts all CSS properties and transform values.

```tsx
<Motion.div animate={{ 
  x: 100,
  y: 50,
  opacity: 1,
  scale: 1.2,
  rotate: 45,
  backgroundColor: "#ff0000"
}} />
```

**Type**: `VariantDefinition | string`

### `initial`
Starting values for the animation. If not provided, values from `animate` will be used as the target.

```tsx
<Motion.div 
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
/>
```

**Type**: `VariantDefinition | false`  
**Default**: `undefined` (auto-generated from animate values)

### `exit`
Values to animate to when the component is removed. Requires the component to be wrapped in `<Presence>`.

```tsx
<Presence>
  <Show when={show()}>
    <Motion.div
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  </Show>
</Presence>
```

**Type**: `VariantDefinition`

### `transition`
Configuration for the animation timing and easing.

```tsx
<Motion.div 
  animate={{ x: 100 }}
  transition={{
    duration: 0.8,
    easing: "ease-in-out",
    delay: 0.2
  }}
/>
```

**Type**: `TransitionDefinition`

#### Transition Properties
- `duration`: Animation duration in seconds
- `delay`: Delay before animation starts in seconds
- `easing`: Easing function name or cubic-bezier array
- `type`: Animation type ("tween", "spring", "keyframes")
- `repeat`: Number of times to repeat (-1 for infinite)
- `repeatType`: How to repeat ("loop", "reverse", "mirror")

## Interaction Props

### `hover`
Animation to trigger on hover.

```tsx
<Motion.button hover={{ scale: 1.1 }}>
  Hover me
</Motion.button>
```

**Type**: `VariantDefinition`

### `press`
Animation to trigger on press/click.

```tsx
<Motion.button press={{ scale: 0.95 }}>
  Click me
</Motion.button>
```

**Type**: `VariantDefinition`

### `inView`
Animation to trigger when element enters viewport.

```tsx
<Motion.div inView={{ opacity: 1, y: 0 }}>
  I animate when visible
</Motion.div>
```

**Type**: `VariantDefinition`

### `inViewOptions`
Configuration for the intersection observer.

```tsx
<Motion.div 
  inView={{ opacity: 1 }}
  inViewOptions={{
    threshold: 0.5,
    margin: "100px"
  }}
/>
```

**Type**: `IntersectionObserverInit`

## Variants System

### Basic Variants
Define reusable animation states.

```tsx
const variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
}

<Motion.div 
  variants={variants}
  initial="hidden"
  animate="visible"
/>
```

### Dynamic Variants
Use signals for reactive variant switching.

```tsx
const [currentVariant, setCurrentVariant] = createSignal("hidden")

<Motion.div 
  variants={variants}
  animate={currentVariant()}
/>
```

## Keyframes

### Array-based Keyframes
```tsx
<Motion.div animate={{ 
  x: [0, 100, 50],
  opacity: [0, 1, 0.8]
}} />
```

### Keyframe Timing
```tsx
<Motion.div 
  animate={{ x: [0, 100, 50] }}
  transition={{ 
    x: { 
      times: [0, 0.5, 1],
      duration: 2 
    }
  }}
/>
```

## Event Handlers

### Motion Events
```tsx
<Motion.div 
  onMotionStart={(event) => console.log('Animation started')}
  onMotionComplete={(event) => console.log('Animation completed')}
/>
```

### Interaction Events
```tsx
<Motion.div 
  onHoverStart={(event) => console.log('Hover started')}
  onHoverEnd={(event) => console.log('Hover ended')}
  onPressStart={(event) => console.log('Press started')}
  onPressEnd={(event) => console.log('Press ended')}
/>
```

### Viewport Events
```tsx
<Motion.div 
  onViewEnter={(event) => console.log('Entered viewport')}
  onViewLeave={(event) => console.log('Left viewport')}
/>
```

## TypeScript Types

### MotionComponentProps
```typescript
interface MotionComponentProps {
  initial?: VariantDefinition | false
  animate?: VariantDefinition | string
  exit?: VariantDefinition
  transition?: TransitionDefinition
  variants?: { [key: string]: VariantDefinition }
  hover?: VariantDefinition
  press?: VariantDefinition
  inView?: VariantDefinition
  inViewOptions?: IntersectionObserverInit
  
  // Event handlers
  onMotionStart?: (event: MotionEvent) => void
  onMotionComplete?: (event: MotionEvent) => void
  onHoverStart?: (event: CustomPointerEvent) => void
  onHoverEnd?: (event: CustomPointerEvent) => void
  onPressStart?: (event: CustomPointerEvent) => void
  onPressEnd?: (event: CustomPointerEvent) => void
  onViewEnter?: (event: ViewEvent) => void
  onViewLeave?: (event: ViewEvent) => void
}
```

### VariantDefinition
```typescript
interface VariantDefinition {
  [key: string]: string | number | (string | number)[]
  transition?: TransitionDefinition
}
```

## Performance Considerations

- **Hardware Acceleration**: Transform properties (x, y, scale, rotate) use GPU acceleration
- **Batching**: Multiple property changes are batched for performance
- **Memory**: Components automatically clean up when unmounted
- **Reactive**: Only updates when signal dependencies change

## Examples

### Stagger Animation
```tsx
const items = [1, 2, 3, 4, 5]

<For each={items}>
  {(item, index) => (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index() * 0.1 }}
    >
      Item {item}
    </Motion.div>
  )}
</For>
```

### Reactive Animation
```tsx
const [isLarge, setIsLarge] = createSignal(false)

<Motion.div
  animate={{
    scale: isLarge() ? 1.5 : 1,
    backgroundColor: isLarge() ? "#ff0000" : "#0000ff"
  }}
  transition={{ duration: 0.3 }}
  onClick={() => setIsLarge(!isLarge())}
>
  Click to toggle
</Motion.div>
```

### Complex Transitions
```tsx
<Motion.div
  animate={{ x: 100 }}
  transition={{
    type: "spring",
    stiffness: 100,
    damping: 15,
    x: {
      type: "tween",
      duration: 2,
      easing: [0.25, 0.1, 0.25, 1]
    }
  }}
/>
```