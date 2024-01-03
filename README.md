<p>
  <img width="100%" src="https://assets.solidjs.com/banner?background=tiles&project=solid-motionone" alt="solid-motionone">
</p>

# Solid MotionOne

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![npm](https://img.shields.io/npm/v/solid-motionone?style=for-the-badge)](https://www.npmjs.com/package/solid-motionone)
[![downloads](https://img.shields.io/npm/dw/solid-motionone?color=blue&style=for-the-badge)](https://www.npmjs.com/package/solid-motionone)

**A tiny, performant animation library for SolidJS. Powered by [Motion One](https://motion.dev/).**

## Introduction

Motion One for Solid is a 5.8kb animation library for SolidJS. It takes advantage of Solid's excellent performance and simple declarative syntax. This package supplies springs, independent transforms, and hardware accelerated animations.

## Installation

Motion One for Solid can be installed via npm:

```bash
npm install solid-motionone
# or
pnpm add solid-motionone
# or
yarn add solid-motionone
```

## Create an animation

Import the `Motion` component and use it anywhere in your Solid components:

```tsx
import {Motion} from "solid-motionone"

function MyComponent() {
  return <Motion>Hello world</Motion>
}
```

The `Motion` component can be used to create an animatable HTML or SVG element. By default, it will render a `div` element:

```tsx
import {Motion} from "solid-motionone"

function App() {
  return (
    <Motion.div
      animate={{opacity: [0, 1]}}
      transition={{duration: 1, easing: "ease-in-out"}}
    />
  )
}
```

But any HTML or SVG element can be rendered, by defining it like this: `<Motion.button>`

Or like this: `<Motion tag="button">`

## Transition options

We can change the type of animation used by passing a `transition` prop.

```tsx
<Motion
  animate={{rotate: 90, backgroundColor: "yellow"}}
  transition={{duration: 1, easing: "ease-in-out"}}
/>
```

By default transition options are applied to all values, but we can also override on a per-value basis:

```tsx
<Motion
  animate={{rotate: 90, backgroundColor: "yellow"}}
  transition={{
    duration: 1,
    rotate: {duration: 2},
  }}
/>
```

Taking advantage of Solid's reactivity is just as easy. Simply provide any of the Motion properties as accessors to have them change reactively:

```tsx
const [bg, setBg] = createSignal("red")

return (
  <Motion.button
    onClick={() => setBg("blue")}
    animate={{backgroundColor: bg()}}
    transition={{duration: 3}}
  >
    Click Me
  </Motion.button>
)
```

The result is a button that begins red and upon being pressed transitions to blue. `animate` doesn't accept an accessor function. For reactive properties simply place signals in the object similar to using style prop.

## Keyframes

Values can also be set as arrays, to define a series of keyframes.

```tsx
<Motion animate={{x: [0, 100, 50]}} />
```

By default, keyframes are spaced evenly throughout `duration`, but this can be adjusted by providing progress values to `offset`:

```tsx
<Motion animate={{x: [0, 100, 50]}} transition={{x: {offset: [0, 0.25, 1]}}} />
```

## Enter animations

Elements will automatically `animate` to the values defined in animate when they're created.

This can be disabled by setting the `initial` prop to `false`. The styles defined in `animate` will be applied immediately when the element is first created.

```tsx
<Motion initial={false} animate={{x: 100}} />
```

## Exit animations

When an element is removed with `<Show>` it can be animated out with the `Presence` component and the `exit` prop:

```tsx
import {createSignal, Show} from "solid-js"
import {Motion, Presence} from "solid-motionone"

function App() {
  const [isShown, setShow] = createSignal(true)

  return (
    <div>
      <Presence exitBeforeEnter>
        <Show when={isShown()}>
          <Motion
            initial={{opacity: 0, scale: 0.6}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.6}}
            transition={{duration: 0.3}}
          />
        </Show>
      </Presence>
      <button onClick={() => setShow(p => !p)}>Toggle</button>
    </div>
  )
}
```

`exit` can be provided a `transition` of its own, that override the component's `transition`:

```tsx
<Presence>
  <Show when={isShown()}>
    <Motion
      animate={{opacity: 1}}
      exit={{opacity: 0, transition: {duration: 0.8}}}
    />
  </Show>
</Presence>
```
