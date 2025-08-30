# Migration Guide

This guide helps you migrate between versions of solid-motionone and from other animation libraries.

## Migrating from Framer Motion (React)

### Component Mapping

```tsx
// Framer Motion (React)
import { motion, AnimatePresence } from 'framer-motion'

function ReactComponent() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        Content
      </motion.div>
    </AnimatePresence>
  )
}

// solid-motionone (SolidJS)
import { Motion, Presence } from 'solid-motionone'

function SolidComponent() {
  return (
    <Presence>
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        Content
      </Motion.div>
    </Presence>
  )
}
```

### State Management Differences

```tsx
// Framer Motion (React)
function ReactExample() {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  
  return (
    <motion.div
      animate={{ 
        scale: isVisible ? 1 : 0,
        backgroundColor: count > 5 ? "#ff0000" : "#0000ff"
      }}
      onClick={() => setCount(c => c + 1)}
    >
      Count: {count}
    </motion.div>
  )
}

// solid-motionone (SolidJS)
function SolidExample() {
  const [count, setCount] = createSignal(0)
  const [isVisible, setIsVisible] = createSignal(true)
  
  return (
    <Motion.div
      animate={{ 
        scale: isVisible() ? 1 : 0,
        backgroundColor: count() > 5 ? "#ff0000" : "#0000ff"
      }}
      onClick={() => setCount(c => c + 1)}
    >
      Count: {count()}
    </Motion.div>
  )
}
```

### Event Handlers

```tsx
// Framer Motion
<motion.div
  onAnimationStart={() => console.log('Started')}
  onAnimationComplete={() => console.log('Completed')}
  onHoverStart={() => console.log('Hover start')}
  onHoverEnd={() => console.log('Hover end')}
/>

// solid-motionone
<Motion.div
  onMotionStart={() => console.log('Started')}
  onMotionComplete={() => console.log('Completed')}
  onHoverStart={() => console.log('Hover start')}
  onHoverEnd={() => console.log('Hover end')}
/>
```

### Variants with Orchestration

```tsx
// Framer Motion
const variants = {
  hidden: {
    opacity: 0,
    transition: {
      staggerChildren: 0.1,
      when: "afterChildren"
    }
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
}

// solid-motionone (Basic - limited orchestration)
const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

// Manual staggering in solid-motionone
function StaggeredList() {
  return (
    <For each={items()}>
      {(item, index) => (
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index() * 0.1 }}
        >
          {item}
        </Motion.div>
      )}
    </For>
  )
}
```

## Missing Features in Current Version

When migrating from Framer Motion, be aware of these currently missing features:

### Drag Gestures

```tsx
// Framer Motion - NOT AVAILABLE in current solid-motionone
<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
  dragElastic={0.2}
  whileDrag={{ scale: 1.2 }}
  onDragEnd={(event, info) => {}}
/>

// Workaround with manual event handling
function DragWorkaround() {
  const [position, setPosition] = createSignal({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = createSignal(false)
  
  // Manual drag implementation
  return (
    <Motion.div
      animate={{ x: position().x, y: position().y }}
      onPointerDown={(e) => {
        setIsDragging(true)
        // Implement drag logic
      }}
    >
      Manual Drag
    </Motion.div>
  )
}
```

### Layout Animations

```tsx
// Framer Motion - NOT AVAILABLE in current solid-motionone
<motion.div layout layoutId="shared-element">
  Content
</motion.div>

// No direct workaround - feature planned for future releases
```

### Advanced Scroll Features

```tsx
// Framer Motion - NOT AVAILABLE in current solid-motionone
const { scrollY } = useScroll()
const y = useTransform(scrollY, [0, 300], [0, -150])

<motion.div style={{ y }} />

// Manual scroll tracking workaround
function ScrollWorkaround() {
  const [scrollY, setScrollY] = createSignal(0)
  
  createEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    onCleanup(() => window.removeEventListener('scroll', handleScroll))
  })
  
  const transformedY = () => (scrollY() / 300) * -150
  
  return (
    <Motion.div
      animate={{ y: transformedY() }}
      transition={{ duration: 0 }}
    />
  )
}
```

## Migrating from CSS Animations

### CSS Keyframes to solid-motionone

```css
/* CSS Animation */
@keyframes slideIn {
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

.slide-in {
  animation: slideIn 0.5s ease-out;
}
```

```tsx
// solid-motionone equivalent
<Motion.div
  initial={{ x: "-100%", opacity: 0 }}
  animate={{ x: "0%", opacity: 1 }}
  transition={{ duration: 0.5, easing: "ease-out" }}
/>
```

### CSS Transitions to solid-motionone

```css
/* CSS Transition */
.box {
  transition: all 0.3s ease-in-out;
}

.box:hover {
  transform: scale(1.1);
  background-color: #ff0000;
}
```

```tsx
// solid-motionone equivalent
<Motion.div
  hover={{ scale: 1.1, backgroundColor: "#ff0000" }}
  transition={{ duration: 0.3, easing: "ease-in-out" }}
  class="box"
/>
```

## Migrating from Solid Transition Group

### Basic Transitions

```tsx
// Solid Transition Group
import { Transition } from "solid-transition-group"

function TransitionGroupExample() {
  return (
    <Transition name="slide-fade">
      <Show when={show()}>
        <div>Content</div>
      </Show>
    </Transition>
  )
}

// solid-motionone equivalent
import { Motion, Presence } from 'solid-motionone'

function SolidMotionExample() {
  return (
    <Presence>
      <Show when={show()}>
        <Motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 20, opacity: 0 }}
        >
          Content
        </Motion.div>
      </Show>
    </Presence>
  )
}
```

## Version Migration Guide

### From v1.0.x to v1.1.x (Future)

When new versions are released, this section will contain migration instructions.

```tsx
// Example of potential breaking changes (hypothetical)

// v1.0.x (Current)
<Motion.div
  inViewOptions={{ threshold: 0.5 }}
  inView={{ opacity: 1 }}
/>

// v1.1.x (Future) - Might change API
<Motion.div
  viewport={{ threshold: 0.5 }}
  whileInView={{ opacity: 1 }}
/>
```

## Performance Migration Tips

### Optimizing Existing Animations

```tsx
// Before: Animating layout properties
<Motion.div
  animate={{
    left: "100px",      // Causes layout
    top: "50px",        // Causes layout
    width: "200px",     // Causes layout
  }}
/>

// After: Using transforms
<Motion.div
  animate={{
    x: 100,             // transform: translateX()
    y: 50,              // transform: translateY()
    scaleX: 2,          // transform: scaleX() (if doubling width)
  }}
/>
```

### Batching Updates

```tsx
// Before: Multiple separate updates
const updateAnimation = () => {
  setX(100)      // Triggers animation
  setY(50)       // Triggers animation
  setScale(1.2)  // Triggers animation
}

// After: Batched updates
import { batch } from 'solid-js'

const updateAnimation = () => {
  batch(() => {
    setX(100)
    setY(50)
    setScale(1.2)
  })
}
```

## Common Migration Issues

### Issue 1: Reactive Dependencies

```tsx
// Problem: Animation doesn't update when signal changes
const [position, setPosition] = createSignal(0)

// Wrong
<Motion.div animate={{ x: position }} />

// Correct
<Motion.div animate={{ x: position() }} />
```

### Issue 2: Event Handler Differences

```tsx
// Problem: Event handler names different from Framer Motion

// Framer Motion
<motion.div onAnimationStart={handler} />

// solid-motionone
<Motion.div onMotionStart={handler} />
```

### Issue 3: Presence Component Wrapping

```tsx
// Problem: Exit animations not working

// Wrong
<Show when={visible()}>
  <Motion.div exit={{ opacity: 0 }}>
    Content
  </Motion.div>
</Show>

// Correct
<Presence>
  <Show when={visible()}>
    <Motion.div exit={{ opacity: 0 }}>
      Content
    </Motion.div>
  </Show>
</Presence>
```

### Issue 4: TypeScript Type Differences

```tsx
// Problem: Type errors when migrating

// Before (Framer Motion types)
const variants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

// After (solid-motionone types)
const variants: Record<string, VariantDefinition> = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}
```

## Migration Checklist

### Pre-Migration

- [ ] Audit current animations and identify dependencies
- [ ] Check which features are available in solid-motionone
- [ ] Plan workarounds for missing features
- [ ] Set up testing environment
- [ ] Create performance benchmarks

### During Migration

- [ ] Update imports and component names
- [ ] Convert state management to SolidJS patterns
- [ ] Update event handler names
- [ ] Add Presence components for exit animations
- [ ] Test animations across different browsers
- [ ] Verify performance meets expectations

### Post-Migration

- [ ] Remove old animation library dependencies
- [ ] Update documentation and examples
- [ ] Monitor for any regression in user experience
- [ ] Plan for future feature adoption
- [ ] Consider contributing back to the community

## Future-Proofing

### Preparing for Upcoming Features

```tsx
// Current implementation with manual drag
function CurrentDragImplementation() {
  // Manual implementation
}

// Future: When drag is added, migration will be simple
function FutureDragImplementation() {
  return (
    <Motion.div
      drag
      dragConstraints={{ left: 0, right: 300 }}
    />
  )
}
```

### Staying Updated

- Follow the [GitHub repository](https://github.com/solidjs-community/solid-motionone) for updates
- Check the [design roadmap](../design/feature-extensions.md) for upcoming features
- Participate in community discussions
- Test pre-release versions when available

This migration guide will be updated as new versions are released and new migration patterns are discovered.