import { createSignal, Show } from "solid-js"
import { Motion } from "../src/index.jsx"

export function AdvancedGesturesExample() {
	const [showGestures, setShowGestures] = createSignal(false)
	const [gestureInfo, setGestureInfo] = createSignal("")

	return (
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
			<h1>solid-motionone Advanced Gestures Examples</h1>
			
			<div style={{ marginBottom: "40px" }}>
				<h2>Basic Multi-Touch</h2>
				<Motion.div
					multiTouch
					onMultiTouchStart={(event, state) => {
						setGestureInfo(`Multi-touch started with ${state.touches.length} touches`)
					}}
					onMultiTouchMove={(event, state) => {
						setGestureInfo(`Multi-touch: ${state.touches.length} touches, scale: ${state.scale.toFixed(2)}, rotation: ${state.rotation.toFixed(1)}°`)
					}}
					onMultiTouchEnd={(event, state) => {
						setGestureInfo("Multi-touch ended")
					}}
					style={{
						width: "200px",
						height: "200px",
						background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
						borderRadius: "8px",
						marginBottom: "20px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
						cursor: "pointer",
					}}
				>
					Multi-Touch Element
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Pinch-to-Zoom</h2>
				<button onClick={() => setShowGestures(!showGestures())}>
					{showGestures() ? "Hide Pinch-Zoom" : "Show Pinch-Zoom"}
				</button>
				
				<Show when={showGestures()}>
					<div style={{ marginTop: "20px" }}>
						<Motion.div
							pinchZoom
							initialScale={1}
							minScale={0.5}
							maxScale={3}
							onPinchStart={(event, state) => {
								setGestureInfo(`Pinch started: scale ${state.scale.toFixed(2)}`)
							}}
							onPinchMove={(event, state) => {
								setGestureInfo(`Pinch: scale ${state.scale.toFixed(2)}, rotation ${state.rotation.toFixed(1)}°`)
							}}
							onPinchEnd={(event, state) => {
								setGestureInfo(`Pinch ended: scale ${state.scale.toFixed(2)}`)
							}}
							style={{
								width: "300px",
								height: "300px",
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
							Pinch to Zoom & Rotate
						</Motion.div>
					</div>
				</Show>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Advanced Pinch-Zoom with Momentum</h2>
				<Motion.div
					pinchZoom
					initialScale={1.2}
					initialRotation={15}
					minScale={0.3}
					maxScale={4.0}
					momentum
					momentumDecay={0.9}
					onPinchStart={(event, state) => {
						setGestureInfo(`Advanced pinch started: scale ${state.scale.toFixed(2)}`)
					}}
					onPinchMove={(event, state) => {
						setGestureInfo(`Advanced pinch: scale ${state.scale.toFixed(2)}, rotation ${state.rotation.toFixed(1)}°`)
					}}
					onPinchEnd={(event, state) => {
						setGestureInfo(`Advanced pinch ended with momentum`)
					}}
					style={{
						width: "250px",
						height: "250px",
						background: "linear-gradient(45deg, #ffd93d, #ff6b6b)",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
						border: "2px solid #ffa500",
					}}
				>
					Advanced Pinch-Zoom
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Pinch-Zoom with While Pinch Animation</h2>
				<Motion.div
					pinchZoom
					whilePinch={{ scale: 1.05, opacity: 0.8 }}
					onPinchStart={(event, state) => {
						setGestureInfo("Pinch with animation started")
					}}
					onPinchMove={(event, state) => {
						setGestureInfo(`Pinch with animation: scale ${state.scale.toFixed(2)}`)
					}}
					onPinchEnd={(event, state) => {
						setGestureInfo("Pinch with animation ended")
					}}
					style={{
						width: "200px",
						height: "200px",
						background: "linear-gradient(45deg, #6c5ce7, #a29bfe)",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
						border: "2px solid #5f3dc4",
					}}
				>
					While Pinch Effect
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Touch Limits (2-4 touches)</h2>
				<Motion.div
					multiTouch
					minTouches={2}
					maxTouches={4}
					onMultiTouchStart={(event, state) => {
						setGestureInfo(`Touch limits: ${state.touches.length} touches`)
					}}
					onMultiTouchMove={(event, state) => {
						setGestureInfo(`Touch limits: ${state.touches.length} touches, center: (${state.center.x.toFixed(0)}, ${state.center.y.toFixed(0)})`)
					}}
					onMultiTouchEnd={(event, state) => {
						setGestureInfo("Touch limits ended")
					}}
					style={{
						width: "180px",
						height: "180px",
						background: "linear-gradient(45deg, #fd79a8, #fdcb6e)",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
						border: "2px solid #e84393",
					}}
				>
					Touch Limits
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Combined Gestures</h2>
				<Motion.div
					pinchZoom
					drag
					initial={{ opacity: 0.7 }}
					animate={{ opacity: 1 }}
					hover={{ scale: 1.05 }}
					onPinchStart={(event, state) => {
						setGestureInfo("Combined gestures: pinch started")
					}}
					onPinchMove={(event, state) => {
						setGestureInfo(`Combined gestures: scale ${state.scale.toFixed(2)}`)
					}}
					onPinchEnd={(event, state) => {
						setGestureInfo("Combined gestures: pinch ended")
					}}
					style={{
						width: "220px",
						height: "220px",
						background: "linear-gradient(45deg, #00b894, #00cec9)",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
						border: "2px solid #00a085",
						cursor: "grab",
					}}
				>
					Combined Gestures
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Complex Gesture Combination</h2>
				<Motion.div
					multiTouch
					pinchZoom
					layout
					scroll
					minTouches={2}
					maxTouches={4}
					initialScale={1.1}
					initialRotation={10}
					minScale={0.4}
					maxScale={3.5}
					momentum
					momentumDecay={0.85}
					whilePinch={{ scale: 1.02, opacity: 0.9 }}
					onPinchStart={(event, state) => {
						setGestureInfo("Complex gestures: pinch started")
					}}
					onPinchMove={(event, state) => {
						setGestureInfo(`Complex gestures: scale ${state.scale.toFixed(2)}, rotation ${state.rotation.toFixed(1)}°`)
					}}
					onPinchEnd={(event, state) => {
						setGestureInfo("Complex gestures: pinch ended")
					}}
					style={{
						width: "280px",
						height: "280px",
						background: "linear-gradient(45deg, #e17055, #d63031)",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
						border: "2px solid #c44569",
					}}
				>
					Complex Gestures
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Gesture Information</h2>
				<div style={{
					padding: "15px",
					background: "#f8f9fa",
					border: "1px solid #dee2e6",
					borderRadius: "8px",
					minHeight: "60px",
					fontFamily: "monospace",
					fontSize: "14px"
				}}>
					{gestureInfo() || "Perform gestures on the elements above to see information here..."}
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
					<p><strong>Multi-Touch:</strong> Use multiple fingers to interact with elements</p>
					<p><strong>Pinch-to-Zoom:</strong> Use two fingers to pinch and zoom elements</p>
					<p><strong>Rotation:</strong> Rotate two fingers to rotate elements</p>
					<p><strong>Momentum:</strong> Gestures continue with momentum after release</p>
					<p><strong>Combined:</strong> Elements can have multiple gesture types simultaneously</p>
				</div>
			</div>

			<div style={{ height: "500px", background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)", padding: "20px" }}>
				<h2>Test Area</h2>
				<p>Use this space to test the gesture effects above on different screen sizes.</p>
			</div>
		</div>
	)
}
