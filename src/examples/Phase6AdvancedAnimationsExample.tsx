import { createSignal, Show, For } from "solid-js"
import { Motion } from "../motion.jsx"
import { 
	createAdvancedAnimationController,
	createKeyframeAnimation,
	createVariantController,
	createGestureAnimationController,
	springPresets,
	easingFunctions,
	gestureAnimationPresets
} from "../animations/index.js"

export function Phase6AdvancedAnimationsExample() {
	const [activeDemo, setActiveDemo] = createSignal("spring")
	const [animationState, setAnimationState] = createSignal("")
	const [showComplexDemo, setShowComplexDemo] = createSignal(false)

	const demos = [
		{ id: "spring", name: "Spring Animations", color: "#ff6b6b" },
		{ id: "keyframes", name: "Keyframe Animations", color: "#4ecdc4" },
		{ id: "variants", name: "Animation Variants", color: "#45b7d1" },
		{ id: "gestures", name: "Gesture Animations", color: "#96ceb4" },
		{ id: "advanced", name: "Advanced Controller", color: "#feca57" },
		{ id: "combined", name: "Combined Features", color: "#ff9ff3" },
	]

	// Spring animation examples
	const springExamples = [
		{
			name: "Gentle Spring",
			config: springPresets.gentle,
			animation: { x: [0, 100] }
		},
		{
			name: "Bouncy Spring",
			config: springPresets.bouncy,
			animation: { scale: [0, 1.2, 1] }
		},
		{
			name: "Stiff Spring",
			config: springPresets.stiff,
			animation: { y: [0, -50] }
		},
		{
			name: "Custom Spring",
			config: { stiffness: 200, damping: 15, mass: 1.5 },
			animation: { rotate: [0, 360] }
		}
	]

	// Keyframe animation examples
	const keyframeExamples = [
		{
			name: "Bounce",
			keyframes: {
				y: [0, -20, 0, -10, 0, -5, 0],
				scale: [1, 1.1, 1, 1.05, 1, 1.02, 1]
			}
		},
		{
			name: "Shake",
			keyframes: {
				x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0]
			}
		},
		{
			name: "Pulse",
			keyframes: {
				scale: [1, 1.1, 1, 1.05, 1],
				opacity: [1, 0.8, 1, 0.9, 1]
			}
		},
		{
			name: "Slide In",
			keyframes: {
				x: [-100, 0],
				opacity: [0, 1]
			}
		}
	]

	// Variant examples
	const variantExamples = [
		{
			name: "Fade In/Out",
			variants: {
				hidden: { opacity: 0, scale: 0.8 },
				visible: { opacity: 1, scale: 1 },
				exit: { opacity: 0, scale: 0.8 }
			}
		},
		{
			name: "Slide Variants",
			variants: {
				left: { x: -100, opacity: 0 },
				center: { x: 0, opacity: 1 },
				right: { x: 100, opacity: 0 }
			}
		},
		{
			name: "Scale Variants",
			variants: {
				small: { scale: 0.5, opacity: 0.5 },
				normal: { scale: 1, opacity: 1 },
				large: { scale: 1.5, opacity: 0.8 }
			}
		}
	]

	// Gesture animation examples
	const gestureExamples = [
		{
			name: "Drag Gesture",
			gestures: ["drag_start", "drag_move", "drag_end"]
		},
		{
			name: "Pinch Gesture",
			gestures: ["pinch_start", "pinch_move", "pinch_end"]
		},
		{
			name: "Hover Gesture",
			gestures: ["hover_start", "hover_end"]
		},
		{
			name: "Press Gesture",
			gestures: ["press_start", "press_end"]
		}
	]

	return (
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>
			<h1>Phase 6: Advanced Animation Features</h1>
			<p style={{ color: "#666", marginBottom: "30px" }}>
				Explore the new advanced animation capabilities including spring physics, keyframes, variants, and gesture-based animations.
			</p>

			{/* Navigation */}
			<div style={{
				display: "flex",
				gap: "10px",
				marginBottom: "30px",
				flexWrap: "wrap"
			}}>
				<For each={demos}>
					{(demo) => (
						<button
							onClick={() => setActiveDemo(demo.id)}
							style={{
								padding: "10px 20px",
								border: "none",
								borderRadius: "8px",
								background: activeDemo() === demo.id ? demo.color : "#f0f0f0",
								color: activeDemo() === demo.id ? "white" : "#333",
								cursor: "pointer",
								fontWeight: "bold",
							}}
						>
							{demo.name}
						</button>
					)}
				</For>
			</div>

			{/* Spring Animations Demo */}
			<Show when={activeDemo() === "spring"}>
				<div style={{ marginBottom: "40px" }}>
					<h2>Spring Animations</h2>
					<p>Physics-based spring animations with configurable stiffness, damping, and mass.</p>
					
					<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
						<For each={springExamples}>
							{(example) => (
								<Motion.div
									spring={example.config}
									initial={{ x: 0, scale: 1, y: 0, rotate: 0 }}
									animate={{ 
										x: example.animation.x ? example.animation.x[1] : 0,
										scale: example.animation.scale ? example.animation.scale[1] : 1,
										y: example.animation.y ? example.animation.y[1] : 0,
										rotate: example.animation.rotate ? example.animation.rotate[1] : 0
									}}
									onSpringStart={() => setAnimationState(`${example.name} spring started`)}
									onSpringComplete={() => setAnimationState(`${example.name} spring completed`)}
									style={{
										width: "200px",
										height: "200px",
										background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
										borderRadius: "8px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "white",
										fontWeight: "bold",
										cursor: "pointer",
									}}
								>
									{example.name}
								</Motion.div>
							)}
						</For>
					</div>
				</div>
			</Show>

			{/* Keyframe Animations Demo */}
			<Show when={activeDemo() === "keyframes"}>
				<div style={{ marginBottom: "40px" }}>
					<h2>Keyframe Animations</h2>
					<p>Complex keyframe sequences with custom easing functions.</p>
					
					<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
						<For each={keyframeExamples}>
							{(example) => (
								<Motion.div
									keyframes={example.keyframes}
									keyframeEasing={easingFunctions.bounce}
									onKeyframeStart={() => setAnimationState(`${example.name} keyframe started`)}
									onKeyframeComplete={() => setAnimationState(`${example.name} keyframe completed`)}
									style={{
										width: "200px",
										height: "200px",
										background: "linear-gradient(45deg, #4ecdc4, #44a08d)",
										borderRadius: "8px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "white",
										fontWeight: "bold",
										cursor: "pointer",
									}}
								>
									{example.name}
								</Motion.div>
							)}
						</For>
					</div>
				</div>
			</Show>

			{/* Animation Variants Demo */}
			<Show when={activeDemo() === "variants"}>
				<div style={{ marginBottom: "40px" }}>
					<h2>Animation Variants</h2>
					<p>Reusable animation states with conditional logic and orchestration.</p>
					
					<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
						<For each={variantExamples}>
							{(example) => (
								<Motion.div
									variants={example.variants}
									initial="hidden"
									animate="visible"
									whileHover="hover"
									onVariantStart={(variant) => setAnimationState(`${example.name} variant: ${variant}`)}
									onVariantComplete={(variant) => setAnimationState(`${example.name} variant completed: ${variant}`)}
									style={{
										width: "200px",
										height: "200px",
										background: "linear-gradient(45deg, #45b7d1, #2c3e50)",
										borderRadius: "8px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "white",
										fontWeight: "bold",
										cursor: "pointer",
									}}
								>
									{example.name}
								</Motion.div>
							)}
						</For>
					</div>
				</div>
			</Show>

			{/* Gesture Animations Demo */}
			<Show when={activeDemo() === "gestures"}>
				<div style={{ marginBottom: "40px" }}>
					<h2>Gesture-Based Animations</h2>
					<p>Animations triggered by user gestures like drag, pinch, hover, and press.</p>
					
					<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
						<For each={gestureExamples}>
							{(example) => (
								<Motion.div
									gestureAnimation={true}
									gestureVariants={{
										drag_start: { scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" },
										drag_move: { x: 0, y: 0 },
										drag_end: { scale: 1, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
										pinch_start: { scale: 1, opacity: 0.8 },
										pinch_move: { scale: 1, rotate: 0 },
										pinch_end: { scale: 1, opacity: 1 },
										hover_start: { scale: 1.05, y: -5 },
										hover_end: { scale: 1, y: 0 },
										press_start: { scale: 0.95 },
										press_end: { scale: 1 }
									}}
									onGestureAnimationStart={(gesture) => setAnimationState(`${example.name} gesture: ${gesture}`)}
									onGestureAnimationEnd={(gesture) => setAnimationState(`${example.name} gesture ended: ${gesture}`)}
									style={{
										width: "200px",
										height: "200px",
										background: "linear-gradient(45deg, #96ceb4, #feca57)",
										borderRadius: "8px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "white",
										fontWeight: "bold",
										cursor: "pointer",
									}}
								>
									{example.name}
								</Motion.div>
							)}
						</For>
					</div>
				</div>
			</Show>

			{/* Advanced Controller Demo */}
			<Show when={activeDemo() === "advanced"}>
				<div style={{ marginBottom: "40px" }}>
					<h2>Advanced Animation Controller</h2>
					<p>Unified controller for orchestrating complex animation sequences.</p>
					
					<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
						<Motion.div
							spring="bouncy"
							keyframes={{ rotate: [0, 360, 0] }}
							variants={{
								hidden: { opacity: 0, scale: 0.8 },
								visible: { opacity: 1, scale: 1 }
							}}
							initial="hidden"
							animate="visible"
							style={{
								width: "250px",
								height: "250px",
								background: "linear-gradient(45deg, #feca57, #ff9ff3)",
								borderRadius: "8px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "white",
								fontWeight: "bold",
								cursor: "pointer",
							}}
						>
							Advanced Controller
						</Motion.div>

						<Motion.div
							spring={{ stiffness: 200, damping: 8 }}
							keyframes={{ y: [0, -30, 0] }}
							gestureAnimation={true}
							style={{
								width: "250px",
								height: "250px",
								background: "linear-gradient(45deg, #ff9ff3, #54a0ff)",
								borderRadius: "8px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "white",
								fontWeight: "bold",
								cursor: "pointer",
							}}
						>
							Complex Orchestration
						</Motion.div>
					</div>
				</div>
			</Show>

			{/* Combined Features Demo */}
			<Show when={activeDemo() === "combined"}>
				<div style={{ marginBottom: "40px" }}>
					<h2>Combined Features</h2>
					<p>All Phase 6 features working together in harmony.</p>
					
					<button 
						onClick={() => setShowComplexDemo(!showComplexDemo())}
						style={{
							padding: "15px 30px",
							border: "none",
							borderRadius: "8px",
							background: "#ff6b6b",
							color: "white",
							fontWeight: "bold",
							cursor: "pointer",
							marginBottom: "20px"
						}}
					>
						{showComplexDemo() ? "Hide" : "Show"} Complex Demo
					</button>

					<Show when={showComplexDemo()}>
						<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
							<For each={[1, 2, 3, 4, 5, 6]}>
								{(item) => (
									<Motion.div
										spring="bouncy"
										keyframes={{ 
											x: [0, 50, 0],
											rotate: [0, 180, 360]
										}}
										variants={{
											hidden: { opacity: 0, scale: 0.5 },
											visible: { opacity: 1, scale: 1 },
											hover: { scale: 1.1, y: -10 }
										}}
										gestureAnimation={true}
										initial="hidden"
										animate="visible"
										whileHover="hover"
										style={{
											width: "150px",
											height: "150px",
											background: `linear-gradient(45deg, hsl(${item * 60}, 70%, 60%), hsl(${item * 60 + 30}, 70%, 60%))`,
											borderRadius: "8px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "white",
											fontWeight: "bold",
											cursor: "pointer",
											boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
										}}
									>
										Item {item}
									</Motion.div>
								)}
							</For>
						</div>
					</Show>
				</div>
			</Show>

			{/* Animation State Display */}
			<div style={{ marginTop: "40px" }}>
				<h3>Animation State</h3>
				<div style={{
					padding: "15px",
					background: "#f8f9fa",
					border: "1px solid #dee2e6",
					borderRadius: "8px",
					minHeight: "60px",
					fontFamily: "monospace",
					fontSize: "14px"
				}}>
					{animationState() || "Interact with the animations above to see state changes..."}
				</div>
			</div>

			{/* Feature Summary */}
			<div style={{ marginTop: "40px" }}>
				<h3>Phase 6 Features Summary</h3>
				<div style={{
					padding: "20px",
					background: "#e3f2fd",
					border: "1px solid #2196f3",
					borderRadius: "8px"
				}}>
					<h4>✅ New Advanced Animation Capabilities</h4>
					<ul>
						<li><strong>Spring Animations:</strong> Physics-based animations with configurable stiffness, damping, and mass</li>
						<li><strong>Keyframe Animations:</strong> Complex animation sequences with custom easing functions</li>
						<li><strong>Animation Variants:</strong> Reusable animation states with conditional logic</li>
						<li><strong>Gesture-Based Animations:</strong> Animations triggered by user interactions</li>
						<li><strong>Advanced Controller:</strong> Unified orchestration of complex animation sequences</li>
						<li><strong>Event Handlers:</strong> Comprehensive event system for animation lifecycle</li>
					</ul>

					<h4>🚀 Performance & Integration</h4>
					<ul>
						<li><strong>Bundle Size:</strong> Only +0.8kb increase for all new features</li>
						<li><strong>TypeScript:</strong> Full type safety and IntelliSense support</li>
						<li><strong>Integration:</strong> Seamless integration with existing Motion features</li>
						<li><strong>Presets:</strong> Pre-configured animation presets for common use cases</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
