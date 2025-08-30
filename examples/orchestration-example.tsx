import { createSignal, Show, For } from "solid-js"
import { Motion } from "../src/index.jsx"

export function OrchestrationExample() {
	const [showStagger, setShowStagger] = createSignal(false)
	const [showTimeline, setShowTimeline] = createSignal(false)
	const [showOrchestration, setShowOrchestration] = createSignal(false)
	const [orchestrationInfo, setOrchestrationInfo] = createSignal("")

	const items = [
		{ id: 1, text: "Item 1", color: "#ff6b6b" },
		{ id: 2, text: "Item 2", color: "#4ecdc4" },
		{ id: 3, text: "Item 3", color: "#45b7d1" },
		{ id: 4, text: "Item 4", color: "#96ceb4" },
		{ id: 5, text: "Item 5", color: "#feca57" },
	]

	return (
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
			<h1>solid-motionone Orchestration Examples</h1>
			
			<div style={{ marginBottom: "40px" }}>
				<h2>Basic Stagger Animation</h2>
				<button onClick={() => setShowStagger(!showStagger())}>
					{showStagger() ? "Hide Stagger" : "Show Stagger"}
				</button>
				
				<Show when={showStagger()}>
					<div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
						<For each={items}>
							{(item) => (
								<Motion.div
									stagger={0.1}
									initial={{ opacity: 0, scale: 0.8, y: 20 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									style={{
										width: "100px",
										height: "100px",
										background: item.color,
										borderRadius: "8px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "white",
										fontWeight: "bold",
									}}
								>
									{item.text}
								</Motion.div>
							)}
						</For>
					</div>
				</Show>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Stagger with Different Directions</h2>
				<div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
					<div>
						<h3>Forward</h3>
						<div style={{ display: "flex", gap: "5px" }}>
							<For each={items.slice(0, 3)}>
								{(item) => (
									<Motion.div
										stagger={{ delay: 0.2, direction: "forward" }}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										style={{
											width: "60px",
											height: "60px",
											background: item.color,
											borderRadius: "4px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "white",
											fontSize: "12px",
										}}
									>
										{item.text}
									</Motion.div>
								)}
							</For>
						</div>
					</div>
					
					<div>
						<h3>Reverse</h3>
						<div style={{ display: "flex", gap: "5px" }}>
							<For each={items.slice(0, 3)}>
								{(item) => (
									<Motion.div
										stagger={{ delay: 0.2, direction: "reverse" }}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										style={{
											width: "60px",
											height: "60px",
											background: item.color,
											borderRadius: "4px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "white",
											fontSize: "12px",
										}}
									>
										{item.text}
									</Motion.div>
								)}
							</For>
						</div>
					</div>
					
					<div>
						<h3>From Center</h3>
						<div style={{ display: "flex", gap: "5px" }}>
							<For each={items.slice(0, 3)}>
								{(item) => (
									<Motion.div
										stagger={{ delay: 0.2, direction: "from-center" }}
										initial={{ opacity: 0, scale: 0.5 }}
										animate={{ opacity: 1, scale: 1 }}
										style={{
											width: "60px",
											height: "60px",
											background: item.color,
											borderRadius: "4px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "white",
											fontSize: "12px",
										}}
									>
										{item.text}
									</Motion.div>
								)}
							</For>
						</div>
					</div>
				</div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Timeline Animation</h2>
				<button onClick={() => setShowTimeline(!showTimeline())}>
					{showTimeline() ? "Hide Timeline" : "Show Timeline"}
				</button>
				
				<Show when={showTimeline()}>
					<div style={{ marginTop: "20px" }}>
						<Motion.div
							timeline={{
								duration: 3000,
								segments: [
									{ at: 0, animation: { opacity: 0, scale: 0.5 } },
									{ at: 1000, animation: { opacity: 1, scale: 1.2 } },
									{ at: 2000, animation: { opacity: 0.8, scale: 1 } },
									{ at: 3000, animation: { opacity: 1, scale: 1 } }
								],
								repeat: "loop"
							}}
							onTimelineStart={(progress) => {
								setOrchestrationInfo(`Timeline started: ${progress}`)
							}}
							onTimelineUpdate={(progress) => {
								setOrchestrationInfo(`Timeline progress: ${(progress * 100).toFixed(1)}%`)
							}}
							onTimelineComplete={(progress) => {
								setOrchestrationInfo(`Timeline completed: ${progress}`)
							}}
							style={{
								width: "200px",
								height: "200px",
								background: "linear-gradient(45deg, #a8e6cf, #dcedc1)",
								borderRadius: "8px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "#333",
								fontWeight: "bold",
								border: "2px solid #ccc",
							}}
						>
							Timeline Animation
						</Motion.div>
					</div>
				</Show>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Orchestrated Sequence</h2>
				<button onClick={() => setShowOrchestration(!showOrchestration())}>
					{showOrchestration() ? "Hide Orchestration" : "Show Orchestration"}
				</button>
				
				<Show when={showOrchestration()}>
					<div style={{ marginTop: "20px" }}>
						<Motion.div
							orchestrate
							orchestrateDelay={500}
							onStaggerStart={(state) => {
								setOrchestrationInfo(`Orchestration started: ${state.totalElements} elements`)
							}}
							onStaggerComplete={(state) => {
								setOrchestrationInfo(`Orchestration completed: ${state.progress * 100}%`)
							}}
							style={{
								width: "300px",
								height: "300px",
								background: "linear-gradient(45deg, #ffd93d, #ff6b6b)",
								borderRadius: "8px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "white",
								fontWeight: "bold",
								border: "2px solid #ffa500",
								position: "relative",
							}}
						>
							<div style={{ textAlign: "center" }}>
								<div>Orchestrated</div>
								<div style={{ fontSize: "14px", marginTop: "10px" }}>
									Stagger + Timeline
								</div>
							</div>
							
							{/* Animated elements around the center */}
							<For each={Array.from({ length: 6 }, (_, i) => i)}>
								{(index) => (
									<Motion.div
										stagger={{ delay: 0.1, direction: "from-center" }}
										initial={{ opacity: 0, scale: 0 }}
										animate={{ opacity: 1, scale: 1 }}
										style={{
											position: "absolute",
											width: "20px",
											height: "20px",
											background: `hsl(${index * 60}, 70%, 60%)`,
											borderRadius: "50%",
											top: "50%",
											left: "50%",
											transform: `translate(-50%, -50%) rotate(${index * 60}deg) translateY(-80px)`,
										}}
									/>
								)}
							</For>
						</Motion.div>
					</div>
				</Show>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Complex Orchestration</h2>
				<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "20px" }}>
					<For each={items}>
						{(item, index) => (
							<Motion.div
								stagger={{ delay: 0.15, direction: "forward" }}
								timeline={{
									duration: 2000,
									segments: [
										{ at: 0, animation: { opacity: 0, y: 50 } },
										{ at: 500, animation: { opacity: 1, y: 0 } },
										{ at: 1500, animation: { opacity: 0.8, y: -10 } },
										{ at: 2000, animation: { opacity: 1, y: 0 } }
									],
									repeat: "loop"
								}}
								orchestrate
								orchestrateDelay={index() * 200}
								layout
								hover={{ scale: 1.05, rotate: 5 }}
								style={{
									width: "150px",
									height: "150px",
									background: item.color,
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
								{item.text}
							</Motion.div>
						)}
					</For>
				</div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Stagger Children</h2>
				<Motion.div
					staggerChildren={0.1}
					staggerDelayChildren={0.2}
					style={{
						display: "flex",
						gap: "10px",
						padding: "20px",
						background: "#f8f9fa",
						borderRadius: "8px",
					}}
				>
					<For each={items.slice(0, 4)}>
						{(item) => (
							<Motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								style={{
									width: "80px",
									height: "80px",
									background: item.color,
									borderRadius: "4px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "white",
									fontSize: "12px",
								}}
							>
								{item.text}
							</Motion.div>
						)}
					</For>
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Orchestration Information</h2>
				<div style={{
					padding: "15px",
					background: "#f8f9fa",
					border: "1px solid #dee2e6",
					borderRadius: "8px",
					minHeight: "60px",
					fontFamily: "monospace",
					fontSize: "14px"
				}}>
					{orchestrationInfo() || "Perform orchestration actions above to see information here..."}
				</div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Instructions</h2>
				<div style={{
					padding: "15px",
					background: "#e3f2fd",
					border: "1px solid #2196f3",
					borderRadius: "8px"
				}}>
					<p><strong>Stagger:</strong> Elements animate in sequence with configurable delays and directions</p>
					<p><strong>Timeline:</strong> Complex animation sequences with precise timing control</p>
					<p><strong>Orchestration:</strong> Combines stagger and timeline for complex animation patterns</p>
					<p><strong>Directions:</strong> forward, reverse, from-center, from-start, from-end</p>
					<p><strong>Integration:</strong> Works seamlessly with all other Motion features</p>
				</div>
			</div>

			<div style={{ height: "300px", background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)", padding: "20px" }}>
				<h2>Test Area</h2>
				<p>Use this space to test the orchestration effects above on different screen sizes.</p>
			</div>
		</div>
	)
}
