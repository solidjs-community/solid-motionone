<p>
  <img width="100%" src="https://assets.solidjs.com/banner?project=solid-motionone&color=fff312&integration=https%3A%2F%2Fraw.githubusercontent.com%2Fsolidjs-community%2Fsolid-motionone%2Fmain%2Fmotion.svg" alt="solid-motionone">
</p>

# Solid MotionOne

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![npm](https://img.shields.io/npm/v/solid-motionone?style=for-the-badge)](https://www.npmjs.com/package/solid-motionone)
[![downloads](https://img.shields.io/npm/dw/solid-motionone?color=blue&style=for-the-badge)](https://www.npmjs.com/package/solid-motionone)
[![size](https://img.shields.io/bundlephobia/minzip/solid-motionone?style=for-the-badge)](https://bundlephobia.com/package/solid-motionone)

**A tiny, performant animation library for Solid 2.0. Powered by [Motion](https://motion.dev/).**

## Introduction

Motion for Solid is a small animation library for Solid 2.0. It takes advantage of Solid's excellent performance and simple declarative syntax. This package supplies springs, gestures, scroll-triggered animations, variants, and hardware accelerated animations.

## Contents

- [Installation](#installation)
- [Create an animation](#create-an-animation)
- [Props reference](#props-reference)
- [Enter animations](#enter-animations)
- [Exit animations](#exit-animations)
- [`Presence` props](#presence-props)
- [Transition options](#transition-options)
- [Keyframes](#keyframes)
- [Variants](#variants)
- [Gestures: hover and press](#gestures-hover-and-press)
- [Scroll-triggered animations](#scroll-triggered-animations)
- [Event handlers](#event-handlers)
- [Low-level primitives](#low-level-primitives)
- [Scroll-linked animations](#scroll-linked-animations)
- [TypeScript](#typescript)
- [Examples](#examples)

## Installation

Solid Motion can be installed via npm. It requires `solid-js@^2.0.0-rc.0` (Solid 2.0 is currently in beta/RC).

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

But any HTML or SVG element can be rendered, by defining it like this: `<Motion.button>`, `<Motion.svg>`, `<Motion.rect>`, etc.

Or like this: `<Motion tag="button">`

All non-animation props (`id`, `class`, `onClick`, SVG attributes like `viewBox`, event listeners, etc.) pass straight through to the rendered element, same as any other Solid component.

## Props reference

Every animation-related prop below accepts either a direct target object (`{opacity: 1}`) or a string key that's looked up in the [`variants`](#variants) prop.

| Prop | Type | Description |
| --- | --- | --- |
| `initial` | target \| string \| `false` | The style to render *before* any animation runs. Defaults to the element's current computed style. Set to `false` to skip the enter animation entirely — see [Enter animations](#enter-animations). |
| `animate` | target \| string | The style to animate to. Reactive — changing it (e.g. via a signal) re-triggers an animation to the new target. |
| `exit` | target \| string | The style to animate to when the element is removed. Only takes effect inside a [`Presence`](#exit-animations) ancestor; without one, the element unmounts immediately regardless of this prop. |
| `hover` | target \| string | The style to animate to while the pointer is hovering the element. See [Gestures](#gestures-hover-and-press). |
| `press` | target \| string | The style to animate to while the element is being pressed. Layers on top of `hover` if both are active. |
| `inView` | target \| string | The style to animate to when the element scrolls into view. See [Scroll-triggered animations](#scroll-triggered-animations). |
| `inViewOptions` | `{root?, margin?, amount?}` | Options controlling when `inView` triggers — see [Scroll-triggered animations](#scroll-triggered-animations). |
| `variants` | `Record<string, target>` | A map of named targets that `initial`/`animate`/`exit`/`hover`/`press`/`inView` can reference by string key. See [Variants](#variants). |
| `transition` | object | Controls duration, easing, delay, and per-value overrides for the animation. See [Transition options](#transition-options). |
| `tag` | string | Explicitly sets the rendered element tag, as an alternative to `Motion.tag` proxy access. |

A target object accepts any CSS property (camelCase or kebab-case), the shorthand transform values (`x`, `y`, `scale`, `rotate`, etc.), CSS custom properties (`"--my-var"`), and can optionally carry its own `transition` override (see [Transition options](#transition-options)).

## Enter animations

Elements will automatically `animate` to the values defined in `animate` when they're created — animating from whatever `initial` describes (or the element's current/default style, if `initial` isn't set) to the `animate` target.

This can be disabled by setting the `initial` prop to `false`. The styles defined in `animate` will be applied immediately when the element is first created, with no animation.

```tsx
<Motion initial={false} animate={{x: 100}} />
```

If `initial` and `animate` already describe the same values, no animation runs at all.

## Exit animations

When an element is removed with `<Show>` it can be animated out with the `Presence` component and the `exit` prop. `Presence` keeps the element mounted until its exit animation finishes, then removes it:

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

`exit` can be provided a `transition` of its own, that overrides the component's `transition`:

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

If more than one `Motion` element (nested or as siblings) has its own `exit` prop, `Presence` waits for every one of them to finish its own exit animation before removing the subtree.

## `Presence` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `initial` | boolean | `true` | If `false`, disables the enter animation for every child `Motion` element the *first* time `Presence` itself is rendered. Subsequent elements entering later still animate normally. |
| `exitBeforeEnter` | boolean | `false` | If `true`, waits for the outgoing element's exit animation to finish before starting the incoming element's enter animation, instead of running both at once. |

```tsx
<Presence initial={false}>
  <Motion.div animate={{opacity: 1}} />
</Presence>
```

## Transition options

We can change the type of animation used by passing a `transition` prop.

```tsx
<Motion
  animate={{rotate: 90, backgroundColor: "yellow"}}
  transition={{duration: 1, easing: "ease-in-out"}}
/>
```

By default transition options are applied to all values, but we can also override on a per-value basis — any option not specified in the override is inherited from the base transition:

```tsx
<Motion
  animate={{rotate: 90, backgroundColor: "yellow"}}
  transition={{
    duration: 1,
    rotate: {duration: 2},
  }}
/>
```

`transition` also accepts spring physics options (`{type: "spring", stiffness, damping, mass}`), `delay`, and `repeat`/`repeatType` — anything supported by Motion's own `animate()` options at [motion.dev](https://motion.dev/).

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

The result is a button that begins red and upon being pressed transitions to blue. `animate` doesn't accept an accessor function. For reactive properties simply place signals in the object similar to using the `style` prop.

## Keyframes

Values can also be set as arrays, to define a series of keyframes.

```tsx
<Motion animate={{x: [0, 100, 50]}} />
```

By default, keyframes are spaced evenly throughout `duration`, but this can be adjusted by providing progress values (`0` to `1`) to `offset`:

```tsx
<Motion
  animate={{x: [0, 100, 50]}}
  transition={{duration: 2, x: {offset: [0, 0.25, 1]}}}
/>
```

## Variants

Instead of passing target objects directly, you can define a `variants` map and reference entries by name. This is useful for reusing the same named states across `initial`, `animate`, `exit`, `hover`, `press`, and `inView`:

```tsx
<Motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: {opacity: 0, y: -20},
    visible: {opacity: 1, y: 0, transition: {duration: 0.6}},
  }}
/>
```

**Variant key inheritance:** a nested `Motion` element with no `initial` of its own inherits the *key* (e.g. `"hidden"`) from its closest ancestor that has one, and resolves that key against its **own** `variants` map. This lets a parent set `initial="hidden"` once and have descendants each define what "hidden" means for themselves, without repeating `initial` at every level:

```tsx
<Motion.div initial="hidden" animate="visible" variants={{hidden: {opacity: 0}, visible: {opacity: 1}}}>
  <Motion.ul animate="visible" variants={{hidden: {y: 30}, visible: {y: 0}}}>
    <Motion.li animate="visible" variants={{hidden: {scale: 0.8}, visible: {scale: 1}}} />
  </Motion.ul>
</Motion.div>
```

Note that only `initial` is inherited this way — `animate`/`exit`/`hover`/`press`/`inView` must be set on each element that should react to them.

## Gestures: hover and press

`hover` and `press` animate an element in response to pointer interaction, without needing to write your own event handlers:

```tsx
<Motion.div
  animate={{scale: 1}}
  hover={{scale: 1.1}}
  press={{scale: 0.95}}
  transition={{duration: 0.15}}
/>
```

If both are active at once (pressing while already hovering), `press` takes priority over `hover` for any overlapping properties.

## Scroll-triggered animations

`inView` animates an element when it scrolls into (and back out of) the viewport, using an `IntersectionObserver` under the hood:

```tsx
<Motion.div
  initial={{opacity: 0}}
  inView={{opacity: 1}}
  inViewOptions={{amount: 0.5}}
/>
```

`inViewOptions` accepts:

| Option | Type | Description |
| --- | --- | --- |
| `root` | `Element \| Document` | The scrolling container to observe within. Defaults to the browser viewport. |
| `margin` | string | A CSS margin-like string (e.g. `"-100px"`) that grows or shrinks the root's bounding box before intersection is calculated. |
| `amount` | `"some"` \| `"all"` \| number | How much of the element must be visible to trigger — a fraction (`0`–`1`), or `"some"`/`"all"`. |

## Event handlers

Every `Motion` component also accepts these optional event handler props:

| Handler | Fires when | `event.detail` |
| --- | --- | --- |
| `onMotionStart` | An animation (from any of `animate`/`exit`/`hover`/`press`/`inView`) begins | `{target}` — the resolved target being animated to |
| `onMotionComplete` | That animation finishes | `{target}` |
| `onHoverStart` / `onHoverEnd` | Pointer enters / leaves the element | `{originalEvent}` — the underlying `PointerEvent` |
| `onPressStart` / `onPressEnd` | Pointer is pressed / released on the element | `{originalEvent}` |
| `onViewEnter` / `onViewLeave` | Element enters / leaves the viewport (per `inView`/`inViewOptions`) | `{originalEntry}` — the underlying `IntersectionObserverEntry` |

```tsx
<Motion.div
  animate={{opacity: 1}}
  onMotionComplete={({detail}) => console.log("animated to", detail.target)}
/>
```

## Low-level primitives

For cases where you don't want to render a `<Motion>` component — e.g. animating an element you don't otherwise control — two lower-level primitives are also exported:

**`motion`** — a ref factory. Pass its return value to any element's `ref`:

```tsx
import {motion} from "solid-motionone"

<div
  ref={motion(() => ({
    initial: {opacity: 0},
    animate: {opacity: 1},
    transition: {duration: 0.6},
  }))}
/>
```

The options accessor is reactive, the same as a `<Motion>` component's props. It can be composed with other refs using Solid's array-ref syntax: `ref={[otherRef, motion(() => ({...}))]}`.

**`createMotion`** — the imperative form, for when you already have an `Element` reference:

```tsx
import {createMotion} from "solid-motionone"

createMotion(myElement, () => ({animate: {opacity: 1}}))
```

## Scroll-linked animations

While `inView` (see [Scroll-triggered animations](#scroll-triggered-animations)) animates *to* a target once an element crosses into view, `useScroll` instead gives you a continuously-updating scroll progress value to drive your own animations directly from — e.g. a progress bar, or a value passed into `animate`:

```tsx
import {useScroll} from "solid-motionone"

function App() {
  const {scrollY} = useScroll()

  return (
    <div style={{position: "fixed", top: 0, left: 0, height: "4px", background: "royalblue", "transform-origin": "0% 50%", transform: `scaleX(${scrollY().progress})`}} />
  )
}
```

`useScroll(options?)` returns:

| Value | Type | Description |
| --- | --- | --- |
| `time` | `Accessor<number>` | The current scroll-tracking timestamp. |
| `scrollX` / `scrollY` | `Accessor<{current, offset, progress, scrollLength, velocity, targetOffset, targetLength, containerLength}>` | Per-axis scroll info — `progress` (`0`–`1`) is the most commonly used field. |

`options` accepts `container`/`target` (to track a scrollable element instead of the page), `axis`, and `offset` — see Motion's [`scroll` docs](https://motion.dev/docs/scroll) for the full set, which this passes straight through to.

## TypeScript

The following types are exported for typing your own components and helpers:

- `Options` — the full prop shape accepted by `Motion`/`motion`/`createMotion` (everything in the [props reference](#props-reference) except `tag`).
- `Target` — a single style target object (what `animate`, `initial`, etc. accept directly).
- `VariantDefinition` — `Target | string`, what each animation prop actually accepts.
- `MotionEvent`, `CustomPointerEvent`, `ViewEvent` — the `CustomEvent` subtypes passed to the [event handlers](#event-handlers).
- `ViewportOptions` — the shape of `inViewOptions`.
- `MotionComponentProps` — the full props type for the `<Motion>` component, including children and event handlers.

## Examples

Every feature documented above has a live, interactive example in this repo's Storybook. Run it locally with:

```bash
pnpm install
pnpm run storybook
```
