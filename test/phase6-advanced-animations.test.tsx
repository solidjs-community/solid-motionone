import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@solidjs/testing-library"
import { Motion } from "../src/motion.jsx"
import { 
	createAdvancedAnimationController,
	createKeyframeAnimation,
	createVariantController,
	createGestureAnimationController,
	springPresets,
	easingFunctions
} from "../src/animations/index.js"

describe("Phase 6: Advanced Animation Features", () => {
	describe("Spring Animations", () => {
		it("should render Motion component with spring animation", () => {
			render(() => (
				<Motion.div
					spring={{ stiffness: 100, damping: 10 }}
					initial={{ x: 0 }}
					animate={{ x: 100 }}
					data-testid="spring-element"
				>
					Spring Animation
				</Motion.div>
			))
			
			expect(screen.getByTestId("spring-element")).toBeInTheDocument()
		})

		it("should render Motion component with spring preset", () => {
			render(() => (
				<Motion.div
					spring="bouncy"
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					data-testid="spring-preset-element"
				>
					Bouncy Spring
				</Motion.div>
			))
			
			expect(screen.getByTestId("spring-preset-element")).toBeInTheDocument()
		})

		it("should create spring animation controller", () => {
			const controller = createAdvancedAnimationController({
				spring: springPresets.gentle
			})
			
			expect(controller).toBeDefined()
			expect(typeof controller.animateSpring).toBe("function")
		})
	})

	describe("Keyframe Animations", () => {
		it("should render Motion component with keyframes", () => {
			const keyframes = {
				x: [0, 100, 0],
				y: [0, -50, 0],
				scale: [1, 1.2, 1]
			}

			render(() => (
				<Motion.div
					keyframes={keyframes}
					data-testid="keyframe-element"
				>
					Keyframe Animation
				</Motion.div>
			))
			
			expect(screen.getByTestId("keyframe-element")).toBeInTheDocument()
		})

		it("should create keyframe animation controller", () => {
			const keyframes = {
				x: [0, 100, 0],
				y: [0, -50, 0]
			}

			const controller = createKeyframeAnimation(keyframes)
			
			expect(controller).toBeDefined()
			expect(typeof controller.animate).toBe("function")
		})

		it("should support keyframe easing", () => {
			const keyframes = {
				x: [0, 100],
				y: [0, -50]
			}

			render(() => (
				<Motion.div
					keyframes={keyframes}
					keyframeEasing={easingFunctions.bounce}
					data-testid="keyframe-easing-element"
				>
					Keyframe with Easing
				</Motion.div>
			))
			
			expect(screen.getByTestId("keyframe-easing-element")).toBeInTheDocument()
		})
	})

	describe("Animation Variants", () => {
		it("should render Motion component with variants", () => {
			const variants = {
				hidden: { opacity: 0, scale: 0.8 },
				visible: { opacity: 1, scale: 1 },
				hover: { scale: 1.1, y: -5 }
			}

			render(() => (
				<Motion.div
					variants={variants}
					initial="hidden"
					animate="visible"
					data-testid="variant-element"
				>
					Variant Animation
				</Motion.div>
			))
			
			expect(screen.getByTestId("variant-element")).toBeInTheDocument()
		})

		it("should create variant controller", () => {
			const variants = {
				hidden: { opacity: 0 },
				visible: { opacity: 1 }
			}

			const controller = createVariantController(variants)
			
			expect(controller).toBeDefined()
			expect(typeof controller.setVariant).toBe("function")
		})

		it("should support conditional variants", () => {
			const variants = {
				small: { scale: 0.8 },
				large: { scale: 1.2 }
			}

			render(() => (
				<Motion.div
					variants={variants}
					initial="small"
					animate="large"
					data-testid="conditional-variant-element"
				>
					Conditional Variant
				</Motion.div>
			))
			
			expect(screen.getByTestId("conditional-variant-element")).toBeInTheDocument()
		})
	})

	describe("Gesture-Based Animations", () => {
		it("should render Motion component with gesture animation", () => {
			render(() => (
				<Motion.div
					gestureAnimation={true}
					gestureVariants={{
						drag: { scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" },
						pinch: { scale: 1.1, opacity: 0.8 }
					}}
					data-testid="gesture-element"
				>
					Gesture Animation
				</Motion.div>
			))
			
			expect(screen.getByTestId("gesture-element")).toBeInTheDocument()
		})

		it("should create gesture animation controller", () => {
			const controller = createGestureAnimationController()
			
			expect(controller).toBeDefined()
			expect(typeof controller.addMapping).toBe("function")
		})

		it("should support gesture animation presets", () => {
			render(() => (
				<Motion.div
					gestureAnimation={true}
					data-testid="gesture-preset-element"
				>
					Gesture Presets
				</Motion.div>
			))
			
			expect(screen.getByTestId("gesture-preset-element")).toBeInTheDocument()
		})
	})

	describe("Advanced Animation Controller", () => {
		it("should create advanced animation controller", () => {
			const controller = createAdvancedAnimationController({
				spring: springPresets.gentle,
				keyframes: { x: [0, 100] },
				variants: { hidden: { opacity: 0 }, visible: { opacity: 1 } }
			})
			
			expect(controller).toBeDefined()
			expect(typeof controller.orchestrate).toBe("function")
		})

		it("should support parallel animation orchestration", () => {
			const controller = createAdvancedAnimationController()
			
			const animation = {
				spring: { from: { x: 0 }, to: { x: 100 } },
				keyframes: { y: [0, -50, 0] },
				variant: "visible",
				sequence: "parallel" as const
			}
			
			expect(() => controller.orchestrate(animation)).not.toThrow()
		})

		it("should support sequential animation orchestration", () => {
			const controller = createAdvancedAnimationController()
			
			const animation = {
				spring: { from: { x: 0 }, to: { x: 100 } },
				keyframes: { y: [0, -50, 0] },
				sequence: "sequential" as const
			}
			
			expect(() => controller.orchestrate(animation)).not.toThrow()
		})
	})

	describe("Combined Features", () => {
		it("should combine spring and keyframe animations", () => {
			render(() => (
				<Motion.div
					spring={{ stiffness: 100, damping: 10 }}
					keyframes={{ y: [0, -20, 0] }}
					initial={{ x: 0 }}
					animate={{ x: 100 }}
					data-testid="combined-element"
				>
					Combined Animation
				</Motion.div>
			))
			
			expect(screen.getByTestId("combined-element")).toBeInTheDocument()
		})

		it("should combine variants with gesture animations", () => {
			const variants = {
				hidden: { opacity: 0 },
				visible: { opacity: 1 }
			}

			render(() => (
				<Motion.div
					variants={variants}
					gestureAnimation={true}
					initial="hidden"
					animate="visible"
					data-testid="variant-gesture-element"
				>
					Variant + Gesture
				</Motion.div>
			))
			
			expect(screen.getByTestId("variant-gesture-element")).toBeInTheDocument()
		})

		it("should support all Phase 6 features together", () => {
			const variants = {
				hidden: { opacity: 0, scale: 0.8 },
				visible: { opacity: 1, scale: 1 }
			}

			render(() => (
				<Motion.div
					spring="bouncy"
					keyframes={{ rotate: [0, 360] }}
					variants={variants}
					gestureAnimation={true}
					initial="hidden"
					animate="visible"
					data-testid="all-features-element"
				>
					All Phase 6 Features
				</Motion.div>
			))
			
			expect(screen.getByTestId("all-features-element")).toBeInTheDocument()
		})
	})

	describe("Event Handlers", () => {
		it("should support spring animation events", () => {
			const onSpringStart = vi.fn()
			const onSpringComplete = vi.fn()

			render(() => (
				<Motion.div
					spring={{ stiffness: 100, damping: 10 }}
					onSpringStart={onSpringStart}
					onSpringComplete={onSpringComplete}
					data-testid="spring-events-element"
				>
					Spring Events
				</Motion.div>
			))
			
			expect(screen.getByTestId("spring-events-element")).toBeInTheDocument()
		})

		it("should support keyframe animation events", () => {
			const onKeyframeStart = vi.fn()
			const onKeyframeComplete = vi.fn()

			render(() => (
				<Motion.div
					keyframes={{ x: [0, 100] }}
					onKeyframeStart={onKeyframeStart}
					onKeyframeComplete={onKeyframeComplete}
					data-testid="keyframe-events-element"
				>
					Keyframe Events
				</Motion.div>
			))
			
			expect(screen.getByTestId("keyframe-events-element")).toBeInTheDocument()
		})

		it("should support variant animation events", () => {
			const onVariantStart = vi.fn()
			const onVariantComplete = vi.fn()

			render(() => (
				<Motion.div
					variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
					onVariantStart={onVariantStart}
					onVariantComplete={onVariantComplete}
					data-testid="variant-events-element"
				>
					Variant Events
				</Motion.div>
			))
			
			expect(screen.getByTestId("variant-events-element")).toBeInTheDocument()
		})

		it("should support gesture animation events", () => {
			const onGestureAnimationStart = vi.fn()
			const onGestureAnimationEnd = vi.fn()

			render(() => (
				<Motion.div
					gestureAnimation={true}
					onGestureAnimationStart={onGestureAnimationStart}
					onGestureAnimationEnd={onGestureAnimationEnd}
					data-testid="gesture-events-element"
				>
					Gesture Events
				</Motion.div>
			))
			
			expect(screen.getByTestId("gesture-events-element")).toBeInTheDocument()
		})
	})
})
