import { createSignal, Show } from "solid-js"
import { Motion } from "../src/index.jsx"

export function ScrollExample() {
	const [showParallax, setShowParallax] = createSignal(false)

	return (
		<div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
			<h1>solid-motionone Scroll Examples</h1>
			
			<div style={{ marginBottom: "40px" }}>
				<h2>Basic Scroll Tracking</h2>
				<Motion.div
					scroll
					data-testid="scroll-element"
					style={{
						width: "100%",
						height: "200px",
						background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
						borderRadius: "8px",
						marginBottom: "20px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
					}}
				>
					Scroll Tracking Element
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Parallax Effects</h2>
				<button onClick={() => setShowParallax(!showParallax())}>
					{showParallax() ? "Hide Parallax" : "Show Parallax"}
				</button>
				
				<Show when={showParallax()}>
					<div style={{ height: "800px", position: "relative", marginTop: "20px" }}>
						<Motion.div
							parallax={0.5}
							style={{
								width: "200px",
								height: "200px",
								background: "linear-gradient(45deg, #a8e6cf, #dcedc1)",
								borderRadius: "8px",
								position: "absolute",
								top: "100px",
								left: "50px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "#333",
								fontWeight: "bold",
							}}
						>
							Parallax 0.5
						</Motion.div>
						
						<Motion.div
							parallax={0.3}
							style={{
								width: "150px",
								height: "150px",
								background: "linear-gradient(45deg, #ffd93d, #ff6b6b)",
								borderRadius: "8px",
								position: "absolute",
								top: "300px",
								right: "50px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "white",
								fontWeight: "bold",
							}}
						>
							Parallax 0.3
						</Motion.div>
						
						<Motion.div
							parallax={0.7}
							style={{
								width: "100px",
								height: "100px",
								background: "linear-gradient(45deg, #6c5ce7, #a29bfe)",
								borderRadius: "8px",
								position: "absolute",
								top: "500px",
								left: "200px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "white",
								fontWeight: "bold",
							}}
						>
							Parallax 0.7
						</Motion.div>
					</div>
				</Show>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Custom Parallax Speed</h2>
				<div style={{ height: "600px", position: "relative" }}>
					<Motion.div
						parallax
						parallaxSpeed={0.2}
						style={{
							width: "180px",
							height: "180px",
							background: "linear-gradient(45deg, #fd79a8, #fdcb6e)",
							borderRadius: "8px",
							position: "absolute",
							top: "50px",
							left: "50px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "white",
							fontWeight: "bold",
						}}
					>
						Speed 0.2
					</Motion.div>
					
					<Motion.div
						parallax
						parallaxSpeed={0.8}
						style={{
							width: "120px",
							height: "120px",
							background: "linear-gradient(45deg, #00b894, #00cec9)",
							borderRadius: "8px",
							position: "absolute",
							top: "200px",
							right: "50px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "white",
							fontWeight: "bold",
						}}
					>
						Speed 0.8
					</Motion.div>
				</div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Parallax with Offset</h2>
				<div style={{ height: "500px", position: "relative" }}>
					<Motion.div
						parallax
						parallaxOffset={100}
						style={{
							width: "160px",
							height: "160px",
							background: "linear-gradient(45deg, #e17055, #d63031)",
							borderRadius: "8px",
							position: "absolute",
							top: "100px",
							left: "100px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "white",
							fontWeight: "bold",
						}}
					>
						Offset 100
					</Motion.div>
					
					<Motion.div
						parallax
						parallaxOffset={-50}
						style={{
							width: "140px",
							height: "140px",
							background: "linear-gradient(45deg, #74b9ff, #0984e3)",
							borderRadius: "8px",
							position: "absolute",
							top: "250px",
							right: "100px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "white",
							fontWeight: "bold",
						}}
					>
						Offset -50
					</Motion.div>
				</div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Scroll Container Example</h2>
				<div style={{ height: "300px", overflow: "auto", border: "2px dashed #ccc", padding: "20px" }}>
					<div style={{ height: "800px" }}>
						<Motion.div
							scroll
							scrollContainer={document.querySelector("div") as Element}
							style={{
								width: "100px",
								height: "100px",
								background: "linear-gradient(45deg, #fdcb6e, #e17055)",
								borderRadius: "8px",
								position: "sticky",
								top: "20px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "white",
								fontWeight: "bold",
							}}
						>
							Container Scroll
						</Motion.div>
					</div>
				</div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Scroll with Animation Props</h2>
				<Motion.div
					scroll
					parallax={0.4}
					initial={{ opacity: 0.5, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					hover={{ scale: 1.1 }}
					style={{
						width: "200px",
						height: "200px",
						background: "linear-gradient(45deg, #a29bfe, #6c5ce7)",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
						margin: "20px 0",
					}}
				>
					Combined Effects
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Scroll with Layout</h2>
				<Motion.div
					scroll
					layout
					parallax={0.3}
					style={{
						width: "150px",
						height: "150px",
						background: "linear-gradient(45deg, #00cec9, #00b894)",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
						margin: "20px 0",
					}}
				>
					Scroll + Layout
				</Motion.div>
			</div>

			<div style={{ marginBottom: "40px" }}>
				<h2>Scroll with Drag</h2>
				<Motion.div
					scroll
					drag
					parallax={0.2}
					style={{
						width: "120px",
						height: "120px",
						background: "linear-gradient(45deg, #fd79a8, #fdcb6e)",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontWeight: "bold",
						margin: "20px 0",
						cursor: "grab",
					}}
				>
					Scroll + Drag
				</Motion.div>
			</div>

			<div style={{ height: "1000px", background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)", padding: "20px" }}>
				<h2>Scroll Down to See Effects</h2>
				<p>This section provides space to test the scroll effects above.</p>
			</div>
		</div>
	)
}
