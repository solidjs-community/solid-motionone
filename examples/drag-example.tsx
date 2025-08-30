import { createSignal } from "solid-js"
import { Motion } from "../src/index.jsx"

export function DragExample() {
	const [dragCount, setDragCount] = createSignal(0)
	const [dragEndCount, setDragEndCount] = createSignal(0)

	return (
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
			<h1>solid-motionone Drag Examples</h1>
			
			<div style={{ marginBottom: "40px" }}>
				<h2>Basic Drag</h2>
				<Motion.div
					drag
					style={{
						width: "100px",
						height: "100px",
						background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
						borderRadius: "8px",
						cursor: "grab",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
						userSelect: "none",
					}}
				>
					Drag Me
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Constrained Drag (X-axis only)</h2>
				<Motion.div
					drag="x"
					dragConstraints={{ left: 0, right: 300 }}
					style={{
						width: "100px",
						height: "100px",
						background: "linear-gradient(45deg, #a8e6cf, #dcedc1)",
						borderRadius: "8px",
						cursor: "grab",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "#333",
						fontWeight: "bold",
						userSelect: "none",
					}}
				>
					X Only
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Elastic Drag with Callbacks</h2>
				<p>Drag events: {dragCount()} | Drag end events: {dragEndCount()}</p>
				<Motion.div
					drag
					dragElastic={0.2}
					onDrag={() => setDragCount(c => c + 1)}
					onDragEnd={() => setDragEndCount(c => c + 1)}
					style={{
						width: "100px",
						height: "100px",
						background: "linear-gradient(45deg, #ffd93d, #ff6b6b)",
						borderRadius: "8px",
						cursor: "grab",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
						userSelect: "none",
					}}
				>
					Elastic
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Drag with whileDrag Variant</h2>
				<Motion.div
					drag
					whileDrag={{ scale: 1.1, rotate: 5 }}
					style={{
						width: "100px",
						height: "100px",
						background: "linear-gradient(45deg, #6c5ce7, #a29bfe)",
						borderRadius: "8px",
						cursor: "grab",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
						userSelect: "none",
					}}
				>
					Scale & Rotate
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Bounded Drag Area</h2>
				<div
					style={{
						width: "400px",
						height: "200px",
						border: "2px dashed #ccc",
						position: "relative",
						background: "#f8f9fa",
					}}
				>
					<Motion.div
						drag
						dragConstraints={{ left: 0, right: 300, top: 0, bottom: 100 }}
						style={{
							width: "80px",
							height: "80px",
							background: "linear-gradient(45deg, #fd79a8, #fdcb6e)",
							borderRadius: "50%",
							cursor: "grab",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "white",
							fontWeight: "bold",
							userSelect: "none",
							position: "absolute",
							top: "10px",
							left: "10px",
						}}
					>
						Bounded
					</Motion.div>
				</div>
			</div>
		</div>
	)
}
