import {createRoot, createSignal, JSX, Show} from "solid-js"
import {screen, render} from "@solidjs/testing-library"
import {Presence, VariantDefinition, motion} from "../src/index.jsx"

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
motion

const duration = 0.001

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

describe("motion directive", () => {
	test("Applies initial as style to DOM node", async () => {
		await render(() => (
			<div
				data-testid="box"
				use:motion={{
					initial: {opacity: 0.5, x: 100},
				}}
			/>
		))
		const component = await screen.findByTestId("box")
		expect(component.style.opacity).toBe("0.5")
		expect(component.style.getPropertyValue("--motion-translateX")).toBe("100px")
		expect(component.style.transform).toBe("translateX(var(--motion-translateX))")
	})

	test("Animation runs on mount if initial and animate differ", async () => {
		let ref!: HTMLDivElement
		render(() => (
			<div
				ref={ref}
				use:motion={{
					initial: {opacity: 0.4},
					animate: {opacity: [0, 0.8]},
					transition: {duration},
				}}
			/>
		))
		await new Promise<void>(resolve => setTimeout(() => resolve(), 60))
		expect(ref.style.opacity).toBe("0.8")
	})

	test("Animation runs when target changes", async () => {
		const [opacity, setOpacity] = createSignal(0.5)

		const element = createRoot(() => (
			<div
				use:motion={{
					initial: {opacity: 0},
					animate: {opacity: opacity()},
					transition: {duration},
				}}
			/>
		)) as HTMLDivElement

		expect(element.style.opacity).toBe("0")

		await sleep(100)

		expect(element.style.opacity).toBe("0.5")

		setOpacity(0.8)

		expect(element.style.opacity).toBe("0.5")

		await sleep(100)

		expect(element.style.opacity).toBe("0.8")
	})

	test("Accepts default transition", async () => {
		const element = await new Promise<HTMLElement>(resolve => {
			let ref!: HTMLDivElement
			render(() => (
				<div
					ref={ref}
					use:motion={{
						initial: {opacity: 0.5},
						animate: {opacity: 0.9},
						transition: {duration: 10},
					}}
				/>
			))
			setTimeout(() => resolve(ref), 500)
		})
		expect(element.style.opacity).not.toEqual("0.9")
	})

	describe("with Presence", () => {
		const TestComponent = (
			props: {
				initial?: boolean
				show?: boolean
				animate?: VariantDefinition
				exit?: VariantDefinition
			} = {},
		): JSX.Element => {
			return (
				<Presence initial={props.initial ?? true}>
					<Show when={props.show ?? true}>
						<div
							data-testid="child"
							use:motion={{
								animate: props.animate,
								exit: props.exit,
							}}
						/>
					</Show>
				</Presence>
			)
		}

		test("Animates element out", () =>
			createRoot(async () => {
				const [show, setShow] = createSignal(true)
				render(() => (
					<TestComponent
						show={show()}
						exit={{opacity: 0, transition: {duration: 0.001}}}
					/>
				))
				const component = await screen.findByTestId("child")
				expect(component.style.opacity).toBe("")
				expect(component.isConnected).toBeTruthy()

				setShow(false)

				expect(component.style.opacity).toBe("")
				expect(component.isConnected).toBeTruthy()

				return new Promise<void>(resolve => {
					setTimeout(() => {
						expect(component.style.opacity).toBe("0")
						expect(component.isConnected).toBeFalsy()
						resolve()
					}, 100)
				})
			}))
	})
})
