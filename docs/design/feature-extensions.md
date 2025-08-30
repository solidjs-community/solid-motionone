# Feature Extensions Design

> **Status**: Design Phase  
> **Version**: 1.0  
> **Last Updated**: August 30, 2025

## Executive Summary

This document outlines a comprehensive design for extending solid-motionone to bridge the feature gap with Motion (formerly Framer Motion). The design targets increasing feature coverage from ~35% to ~75% while maintaining solid-motionone's core strengths: performance, simplicity, and SolidJS integration.

## Current State Analysis

### Feature Coverage Comparison

| Feature Category | solid-motionone | Motion | Coverage |
|------------------|-----------------|--------|----------|
| **Core Animations** | ✅ Full | ✅ Full | 100% |
| **Basic Interactions** | ✅ Basic | ✅ Advanced | 60% |
| **Drag & Drop** | ❌ None | ✅ Full | 0% |
| **Layout Animations** | ❌ None | ✅ Full | 0% |
| **Scroll Integration** | ✅ Basic InView | ✅ Full | 25% |
| **Orchestration** | ✅ Basic Variants | ✅ Advanced | 30% |
| **Components** | 2 basic | 8+ advanced | 25% |

**Overall Coverage: ~35%**

## Architecture Design

### Phase 1: Drag System Architecture

#### Core Types
```typescript
interface DragConstraints {
  left?: number
  right?: number  
  top?: number
  bottom?: number
  ref?: Element
}

interface DragOptions {
  drag?: boolean | "x" | "y"
  dragConstraints?: DragConstraints
  dragElastic?: boolean | number
  dragMomentum?: boolean
  dragSnapToOrigin?: boolean
  whileDrag?: VariantDefinition
  onDragStart?: (event: PointerEvent, info: PanInfo) => void
  onDrag?: (event: PointerEvent, info: PanInfo) => void
  onDragEnd?: (event: PointerEvent, info: PanInfo) => void
}
```

#### Implementation Strategy
- Extend existing `OPTION_KEYS` array
- Add drag state management to `createAndBindMotionState`
- Implement pointer capture for cross-browser compatibility
- Use `Transform` for hardware acceleration
- Integrate with existing Motion One animation engine

#### Estimated Bundle Impact: +2.1kb

### Phase 2: Layout Animation Engine

#### Architecture Overview
```typescript
interface LayoutOptions {
  layout?: boolean | "position" | "size"
  layoutId?: string
  layoutRoot?: boolean
  layoutScroll?: boolean
  layoutDependency?: any
}

interface LayoutState {
  element: Element
  id: string | undefined
  snapshot: DOMRect
  isAnimating: boolean
}
```

#### Key Components
- **LayoutGroup Component**: Context provider for shared layouts
- **Layout Detection**: FLIP technique for smooth transitions
- **Shared Elements**: Cross-component layout animations
- **Performance Optimization**: RAF batching and measurement caching

#### Estimated Bundle Impact: +2.8kb

### Phase 3: Scroll Integration Primitives

#### Scroll Hooks
```typescript
// Core scroll primitive for SolidJS
export function createScroll(
  container?: () => Element | null
): ScrollInfo {
  const [scrollX, setScrollX] = createSignal(0)
  const [scrollY, setScrollY] = createSignal(0)
  const [scrollXProgress, setScrollXProgress] = createSignal(0)
  const [scrollYProgress, setScrollYProgress] = createSignal(0)
  
  return { scrollX, scrollY, scrollXProgress, scrollYProgress }
}

export function createTransform<T>(
  input: Accessor<number>,
  transformer: (value: number) => T
): Accessor<T> {
  return createMemo(() => transformer(input()))
}
```

#### Features
- Scroll position tracking with throttling
- Value transformation utilities
- Enhanced InView with progress tracking
- Parallax effects support

#### Estimated Bundle Impact: +1.5kb

### Phase 4: Advanced Gesture System

#### Unified Gesture Architecture
```typescript
interface GestureState {
  isHovering: boolean
  isPressing: boolean
  isDragging: boolean
  isFocused: boolean
  panInfo?: PanInfo
}

interface GestureOptions {
  hover?: VariantDefinition | boolean
  press?: VariantDefinition | boolean  
  focus?: VariantDefinition | boolean
  drag?: boolean | "x" | "y"
  pan?: PanOptions
  whileHover?: VariantDefinition
  whilePress?: VariantDefinition
  whileFocus?: VariantDefinition
  whileDrag?: VariantDefinition
}
```

#### New Gestures
- **Pan Gestures**: Threshold-based pan detection
- **Focus Gestures**: Keyboard navigation support
- **Enhanced Hover/Press**: Better touch device support

#### Estimated Bundle Impact: +1.2kb

### Phase 5: Orchestration & Stagger Features

#### Enhanced Variants System
```typescript
interface VariantDefinition {
  [key: string]: any
  transition?: TransitionDefinition & OrchestrationOptions
}

interface OrchestrationOptions {
  staggerChildren?: number
  delayChildren?: number
  staggerDirection?: 1 | -1
  when?: "beforeChildren" | "afterChildren"
  type?: "tween" | "spring" | "keyframes"
}
```

#### Features
- Stagger animation controller
- Timeline-based sequencing
- Parent-child coordination
- Advanced transition controls

#### Estimated Bundle Impact: +1.8kb

## Implementation Roadmap

### Timeline: 10 Weeks

#### Phase 1: Foundation (Weeks 1-2)
**Priority: HIGH**
- Enhanced type definitions
- Gesture state management
- Event handling infrastructure  
- Basic drag detection
- Performance measurement setup

#### Phase 2: Core Gestures (Weeks 3-4)
**Priority: HIGH**
- Drag system implementation
- Pan gesture recognition
- Focus gesture support
- Constraint system (boundaries)
- Gesture event handlers

#### Phase 3: Layout System (Weeks 5-6)
**Priority: MEDIUM**
- Layout change detection
- LayoutGroup component
- Shared element transitions
- Layout constraint handling
- Performance optimizations

#### Phase 4: Scroll Integration (Weeks 7-8)
**Priority: MEDIUM**
- Scroll position tracking (createScroll)
- Value transformation (createTransform)
- Enhanced InView capabilities
- Scroll-linked animations
- Parallax effects support

#### Phase 5: Orchestration (Weeks 9-10)
**Priority: LOW-MEDIUM**
- Stagger animation system
- Timeline sequencing
- Enhanced variant orchestration
- Advanced transition controls
- Performance optimizations

### Bundle Size Analysis

| Phase | Feature | Size Impact | Cumulative | Justification |
|-------|---------|-------------|------------|---------------|
| **Current** | Base Implementation | 5.8kb | 5.8kb | Current solid-motionone |
| **Phase 1** | Drag System | +2.1kb | 7.9kb | Essential gesture, high ROI |
| **Phase 2** | Layout Engine | +2.8kb | 10.7kb | Complex but high impact |
| **Phase 3** | Scroll Integration | +1.5kb | 12.2kb | Lightweight primitives |
| **Phase 4** | Advanced Gestures | +1.2kb | 13.4kb | Pan, focus extensions |
| **Phase 5** | Orchestration | +1.8kb | 15.2kb | Stagger, timeline features |

**Target: ~15.2kb total (2.6x current, ~50% of Motion's 28kb)**

## Package Structure

### New Directory Organization
```
solid-motionone/
├── src/
│   ├── index.tsx              # Main exports (existing)
│   ├── motion.tsx             # Enhanced Motion component 
│   ├── presence.tsx           # Enhanced Presence component
│   ├── primitives.ts          # Core primitives (existing)
│   ├── types.ts               # Extended type definitions
│   │
│   ├── gestures/              # 🆕 Gesture system
│   │   ├── index.ts           # Gesture exports
│   │   ├── drag.ts            # Drag gesture implementation
│   │   ├── pan.ts             # Pan gesture implementation  
│   │   ├── focus.ts           # Focus gesture implementation
│   │   └── utils.ts           # Gesture utilities
│   │
│   ├── layout/                # 🆕 Layout animation system
│   │   ├── index.ts           # Layout exports
│   │   ├── LayoutGroup.tsx    # Layout group component
│   │   ├── layout-effect.ts   # Layout change detection
│   │   └── shared-layout.ts   # Shared element animations
│   │
│   ├── scroll/                # 🆕 Scroll integration
│   │   ├── index.ts           # Scroll exports
│   │   ├── create-scroll.ts   # Scroll position tracking
│   │   ├── create-transform.ts # Value transformation
│   │   ├── create-in-view.ts  # Enhanced InView
│   │   └── scroll-linked.ts   # Scroll-linked animations
│   │
│   ├── orchestration/         # 🆕 Animation orchestration
│   │   ├── index.ts           # Orchestration exports
│   │   ├── stagger.ts         # Stagger controller
│   │   ├── timeline.ts        # Timeline sequencing
│   │   └── variants.ts        # Enhanced variants
│   │
│   └── utils/                 # 🆕 Shared utilities
│       ├── math.ts            # Math utilities
│       ├── performance.ts     # Performance optimizations
│       └── types.ts           # Shared type utilities
```

## Integration Strategy

### Backward Compatibility
All existing APIs remain unchanged. New features are purely additive:

```typescript
// ✅ Existing API - no changes
<Motion.div 
  animate={{ x: 100 }}
  hover={{ scale: 1.1 }}
  transition={{ duration: 0.3 }}
/>

// ✅ Enhanced API - new capabilities
<Motion.div
  animate={{ x: 100 }}
  hover={{ scale: 1.1 }}
  drag                    // 🆕 New drag capability
  dragConstraints={{ left: 0, right: 300 }}
  layout                  // 🆕 New layout animations
  whileDrag={{ scale: 1.1 }}
/>
```

### Progressive Enhancement
Features can be imported selectively for optimal tree-shaking:

```typescript
import { Motion } from 'solid-motionone'                    // Core (5.8kb)
import { Motion } from 'solid-motionone/with-drag'          // Core + Drag (7.9kb)  
import { Motion } from 'solid-motionone/with-layout'        // Core + Layout (8.6kb)
import { Motion } from 'solid-motionone/full'               // All features (15.2kb)
```

## Performance Considerations

### Optimization Strategies
- **Lazy Loading**: Advanced features only loaded when used
- **Event Delegation**: Single event listener per gesture type
- **Memory Management**: Automatic cleanup on component unmount  
- **RAF Optimization**: Batch DOM updates using requestAnimationFrame
- **Bundle Analysis**: CI integration to monitor size impact

### Performance Targets
- No regression in animation performance
- Memory usage increase <20%
- Bundle size increase <3x current
- Gesture responsiveness <16ms

## Testing Strategy

### Test Coverage Requirements
- **Unit Tests**: All new primitives and utilities
- **Integration Tests**: Component interaction and state management
- **Performance Tests**: Bundle size and runtime performance
- **Accessibility Tests**: Gesture support and keyboard navigation

### Test Structure
```typescript
describe('Drag System', () => {
  test('basic drag functionality')
  test('drag constraints')  
  test('drag callbacks')
  test('drag accessibility')
  test('performance benchmarks')
})

describe('Layout Animations', () => {
  test('layout change detection')
  test('shared element transitions')
  test('layout group coordination')
  test('performance optimizations')
})
```

## Success Metrics

| Metric | Current | Target | Success Criteria |
|--------|---------|--------|------------------|
| **Feature Coverage** | ~35% | ~75% | Cover most common Motion use cases |
| **Bundle Size** | 5.8kb | <16kb | Stay under 3x current size |
| **Performance** | Excellent | Maintained | No regression in animation perf |
| **Adoption** | Current users | +50% | Broader SolidJS ecosystem adoption |
| **API Satisfaction** | Good | Excellent | Match Motion's DX quality |

## Migration Path

### Gradual Adoption Strategy
```typescript
// Phase 1: Add drag to existing animations
<Motion.div
  animate={{ x: 100 }}
  drag="x"              // 🆕 Add drag capability
  dragConstraints={{ left: 0, right: 300 }}
/>

// Phase 2: Add layout animations  
<LayoutGroup>           // 🆕 Enable shared layouts
  <Motion.div layout layoutId="card">
    {/* Automatic layout transitions */}
  </Motion.div>
</LayoutGroup>

// Phase 3: Add scroll effects
const { scrollY } = createScroll()     // 🆕 Track scroll
const y = createTransform(scrollY, [0, 300], [0, -100])

<Motion.div style={{ y }} />
```

## Risk Assessment

### Technical Risks
- **Bundle Size Growth**: Mitigated by modular imports and tree-shaking
- **Performance Regression**: Addressed by comprehensive benchmarking
- **Complexity Increase**: Managed through clear architecture and documentation
- **Breaking Changes**: Prevented by additive-only approach

### Mitigation Strategies
- Incremental development with early feedback
- Continuous performance monitoring
- Comprehensive test coverage
- Community involvement and testing

## Conclusion

This design provides a clear, implementable roadmap for significantly expanding solid-motionone's capabilities while preserving its core strengths. The phased approach ensures manageable development cycles, and the focus on backward compatibility minimizes disruption to existing users.

The end result will be a comprehensive animation library that serves as a true alternative to Motion for SolidJS applications, offering 75% of Motion's features at 50% of the bundle size.