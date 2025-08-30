import { createSignal, Show } from "solid-js"
import { Motion, LayoutGroup } from "../src/index.jsx"

export function LayoutExample() {
	const [isExpanded, setIsExpanded] = createSignal(false)
	const [showShared, setShowShared] = createSignal(false)

	return (
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
			<h1>solid-motionone Layout Examples</h1>
			
			<div style={{ marginBottom: "40px" }}>
				<h2>Basic Layout Animation</h2>
				<button onClick={() => setIsExpanded(!isExpanded())}>
					{isExpanded() ? "Collapse" : "Expand"}
				</button>
				<Motion.div
					layout
					style={{
						width: isExpanded() ? "300px" : "100px",
						height: isExpanded() ? "200px" : "100px",
						background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
						borderRadius: "8px",
						marginTop: "10px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
					}}
				>
					{isExpanded() ? "Expanded Layout" : "Compact"}
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Position Layout Animation</h2>
				<Motion.div
					layout="position"
					style={{
						width: "100px",
						height: "100px",
						background: "linear-gradient(45deg, #a8e6cf, #dcedc1)",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "#333",
						fontWeight: "bold",
						transform: isExpanded() ? "translateX(200px)" : "translateX(0px)",
					}}
				>
					Position
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Size Layout Animation</h2>
				<Motion.div
					layout="size"
					style={{
						width: isExpanded() ? "200px" : "100px",
						height: isExpanded() ? "150px" : "100px",
						background: "linear-gradient(45deg, #ffd93d, #ff6b6b)",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
					}}
				>
					Size
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Shared Layout Elements</h2>
				<button onClick={() => setShowShared(!showShared())}>
					{showShared() ? "Hide Shared" : "Show Shared"}
				</button>
				
				<LayoutGroup>
					<div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
						<Show when={!showShared()}>
							<Motion.div
								layout
								layoutId="shared-card"
								style={{
									width: "150px",
									height: "100px",
									background: "linear-gradient(45deg, #6c5ce7, #a29bfe)",
									borderRadius: "8px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "white",
									fontWeight: "bold",
									cursor: "pointer",
								}}
								onClick={() => setShowShared(true)}
							>
								Card View
							</Motion.div>
						</Show>
						
						<Show when={showShared()}>
							<Motion.div
								layout
								layoutId="shared-card"
								style={{
									width: "300px",
									height: "200px",
									background: "linear-gradient(45deg, #6c5ce7, #a29bfe)",
									borderRadius: "8px",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									color: "white",
									fontWeight: "bold",
									cursor: "pointer",
								}}
								onClick={() => setShowShared(false)}
							>
								<div>Expanded Card</div>
								<div style={{ fontSize: "14px", marginTop: "10px" }}>
									Click to collapse
								</div>
							</Motion.div>
						</Show>
					</div>
				</LayoutGroup>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Layout with Existing Animations</h2>
				<Motion.div
					layout
					initial={{ opacity: 0.5 }}
					animate={{ opacity: 1 }}
					hover={{ scale: 1.05 }}
					style={{
						width: isExpanded() ? "250px" : "100px",
						height: "100px",
						background: "linear-gradient(45deg, #fd79a8, #fdcb6e)",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
						cursor: "pointer",
					}}
				>
					Combined
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Layout Root Example</h2>
				<div style={{ border: "2px dashed #ccc", padding: "20px", position: "relative" }}>
					<Motion.div
						layout
						layoutRoot
						style={{
							width: isExpanded() ? "200px" : "100px",
							height: "100px",
							background: "linear-gradient(45deg, #00b894, #00cec9)",
							borderRadius: "8px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "white",
							fontWeight: "bold",
						}}
					>
						Root Layout
					</Motion.div>
				</div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Layout Scroll Example</h2>
				<div style={{ height: "300px", overflow: "auto", border: "2px dashed #ccc" }}>
					<div style={{ height: "600px", padding: "20px" }}>
						<Motion.div
							layout
							layoutScroll
							style={{
								width: "100px",
								height: "100px",
								background: "linear-gradient(45deg, #e17055, #d63031)",
								borderRadius: "8px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "white",
								fontWeight: "bold",
								position: "sticky",
								top: "20px",
							}}
						>
							Scroll Layout
						</Motion.div>
					</div>
				</div>
			</div>
		</div>
	)
}
