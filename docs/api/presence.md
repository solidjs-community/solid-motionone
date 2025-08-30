# Presence Component API

The `Presence` component enables exit animations for elements that are conditionally rendered using SolidJS's `<Show>` or `<For>` components.

## Basic Usage

```tsx
import { Motion, Presence } from 'solid-motionone'
import { createSignal, Show } from 'solid-js'

function App() {
  const [show, setShow] = createSignal(true)
  
  return (
    <div>
      <button onClick={() => setShow(!show())}>
        Toggle
      </button>
      
      <Presence>
        <Show when={show()}>
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            I can animate out!
          </Motion.div>
        </Show>
      </Presence>
    </div>
  )
}
```

## Props

### `initial`
Controls whether the first animation should run when `Presence` is first rendered.

```tsx
<Presence initial={false}>
  {/* Children won't animate in on first render */}
</Presence>
```

**Type**: `boolean`  
**Default**: `true`

### `exitBeforeEnter`
When `true`, `Presence` will wait for the exiting element to finish animating out before animating in the next one.

```tsx
<Presence exitBeforeEnter>
  <Show when={toggle()}>
    <Motion.div exit={{ opacity: 0 }} />
  </Show>
</Presence>
```

**Type**: `boolean`  
**Default**: `false`

## How It Works

### Exit Animation Lifecycle

1. **Element Removal Detected**: When a child element is removed from the DOM
2. **Exit Animation Triggered**: The `exit` animation defined on the Motion component starts
3. **DOM Cleanup**: After the exit animation completes, the element is removed from the DOM

### Integration with SolidJS

`Presence` integrates with SolidJS's reactivity system using `@solid-primitives/transition-group` to detect when elements are being added or removed.

```tsx
// Works with Show
<Presence>
  <Show when={condition()}>
    <Motion.div exit={{ opacity: 0 }} />
  </Show>
</Presence>

// Works with For
<Presence>
  <For each={items()}>
    {(item) => (
      <Motion.div exit={{ x: -100 }}>
        {item.name}
      </Motion.div>
    )}
  </For>
</Presence>
```

## Exit Transitions

### Custom Exit Transitions
You can specify different transition settings for exit animations:

```tsx
<Motion.div
  animate={{ opacity: 1 }}
  exit={{ 
    opacity: 0,
    transition: { duration: 0.8, easing: "ease-out" }
  }}
/>
```

### Exit-specific Properties
Exit animations can animate any property, including transforms:

```tsx
<Motion.div
  animate={{ x: 0, opacity: 1 }}
  exit={{ 
    x: -300,
    opacity: 0,
    scale: 0.5
  }}
  transition={{ duration: 0.4 }}
/>
```

## Advanced Examples

### Exit Before Enter
Useful for page transitions or when only one element should be visible at a time:

```tsx
function PageTransition() {
  const [currentPage, setCurrentPage] = createSignal("home")
  
  return (
    <Presence exitBeforeEnter>
      <Show when={currentPage() === "home"}>
        <Motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
        >
          Home Page
        </Motion.div>
      </Show>
      <Show when={currentPage() === "about"}>
        <Motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
        >
          About Page
        </Motion.div>
      </Show>
    </Presence>
  )
}
```

### List Animations
Animating items in and out of a list:

```tsx
function TodoList() {
  const [todos, setTodos] = createStore([
    { id: 1, text: "Learn SolidJS" },
    { id: 2, text: "Build animations" }
  ])
  
  const removeTodo = (id) => {
    setTodos(todos => todos.filter(todo => todo.id !== id))
  }
  
  return (
    <Presence>
      <For each={todos}>
        {(todo) => (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ 
              opacity: 0, 
              height: 0,
              transition: { duration: 0.2 }
            }}
            layout
          >
            <span>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)}>
              Remove
            </button>
          </Motion.div>
        )}
      </For>
    </Presence>
  )
}
```

### Staggered Exit Animations
```tsx
function StaggeredList() {
  const [items, setItems] = createSignal([1, 2, 3, 4, 5])
  
  return (
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
                delay: index() * 0.1,
                duration: 0.3 
              }
            }}
          >
            Item {item}
          </Motion.div>
        )}
      </For>
    </Presence>
  )
}
```

## TypeScript Types

### PresenceProps
```typescript
interface PresenceProps {
  initial?: boolean
  exitBeforeEnter?: boolean
  children?: JSX.Element
}
```

### PresenceContext
```typescript
interface PresenceContextState {
  initial: boolean
  mount: Accessor<boolean>
}
```

## Performance Considerations

- **Exit Detection**: Uses efficient transition group detection to minimize performance impact
- **Animation Cleanup**: Automatically cleans up animations and event listeners
- **Memory Management**: Removes elements from memory after exit animations complete
- **Batching**: Multiple exits are handled efficiently without blocking

## Common Patterns

### Modal Animations
```tsx
function Modal() {
  const [isOpen, setIsOpen] = createSignal(false)
  
  return (
    <Portal>
      <Presence>
        <Show when={isOpen()}>
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            class="modal-backdrop"
            onClick={() => setIsOpen(false)}
          >
            <Motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              class="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              Modal Content
            </Motion.div>
          </Motion.div>
        </Show>
      </Presence>
    </Portal>
  )
}
```

### Page Transitions
```tsx
function Router() {
  const [route, setRoute] = createSignal("home")
  
  return (
    <Presence exitBeforeEnter>
      <Switch>
        <Match when={route() === "home"}>
          <Motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
          >
            <HomePage />
          </Motion.div>
        </Match>
        <Match when={route() === "about"}>
          <Motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
          >
            <AboutPage />
          </Motion.div>
        </Match>
      </Switch>
    </Presence>
  )
}
```