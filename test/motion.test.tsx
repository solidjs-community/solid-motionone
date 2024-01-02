import "../src/waapi.polyfill.js"
// import {render, screen, fireEvent} from "@solidjs/testing-library"

import {describe, expect, test} from "vitest"
import * as s from "solid-js"
import * as sweb from "solid-js/web"

import {Motion} from "../src/index.js"

const duration = 0.001

function render(jsx: () => s.JSX.Element): () => void {
	const container = document.createElement("div")
	document.body.appendChild(container)
	const dispose = sweb.render(jsx, container)
	return () => {
		dispose()
		document.body.removeChild(container)
	}
}

function makePromise<T>(
	timout = 200,
): [promise: Promise<T>, resolve: (value: T) => void, reject: (error: Error) => void] {
	let resolve!: (value: T) => void
	let reject!: (error: Error) => void
	const promise = new Promise<T>((res, rej) => {
		resolve = res
		reject = rej
		setTimeout(() => rej(new Error("Timout passed")), timout)
	})
	return [promise, resolve, reject]
}

describe("Motion", () => {
	test("Renders element as Div by default to HTML", () => {
		let el!: HTMLDivElement
		const dispose = render(() => <Motion ref={el} class="hello" />)
		expect(el).toBeInstanceOf(HTMLDivElement)
		expect(el.className).toBe("hello")
		dispose()
	})
	test("Renders element as proxy Motion.Tag to HTML", () => {
		let el!: HTMLSpanElement
		const dispose = render(() => <Motion.span ref={el} class="hello" />)
		expect(el).toBeInstanceOf(HTMLSpanElement)
		expect(el.className).toBe("hello")
		dispose()
	})
	test("Renders element as 'tag' prop to HTML", () => {
		let el!: HTMLSpanElement
		const dispose = render(() => <Motion ref={el} tag="span" class="hello" />)
		expect(el).toBeInstanceOf(HTMLSpanElement)
		expect(el.className).toBe("hello")
		dispose()
	})
	test("renders children to HTML", () => {
		let el!: HTMLDivElement
		const dispose = render(() => (
			<Motion.div ref={el} initial={{opacity: 0}} animate={{opacity: 1}}>
				<Motion.a href="foo" />
				<Motion.svg viewBox="0 0 1 1" />
			</Motion.div>
		))

		expect(el.innerHTML).toEqual(`<a href="foo"></a><svg viewBox="0 0 1 1"></svg>`)
		dispose()
	})

	test("Applies initial as style to DOM node", () => {
		let el!: HTMLDivElement
		const dispose = render(() => <Motion.div ref={el} initial={{opacity: 0.5, x: 100}} />)

		expect(el.style.opacity).toBe("0.5")
		expect(el.style.getPropertyValue("--motion-translateX")).toBe("100px")
		expect(el.style.transform).toBe("translateX(var(--motion-translateX))")
		dispose()
	})

	test("Animation runs on mount if initial and animate differ", async () => {
		// const [promise, resolve] = makePromise()

		let el!: HTMLDivElement
		const dispose = render(() => (
			<Motion
				ref={el}
				initial={{opacity: 0.4}}
				animate={{opacity: [0, 0.8]}}
				// onMotionComplete={resolve}
				transition={{duration}}
			/>
		))

		await new Promise(res => setTimeout(res, 500))
		expect(el.style.opacity).toBe("0.8")
		dispose()
	})

	test("Animation doesn't run on mount if initial and animate are the same", async () => {
		let reject: () => void
		const promise = new Promise<void>((res, rej) => {
			reject = rej
			setTimeout(res, 200)
		})

		const animate = {opacity: 0.4}
		const dispose = render(() => (
			<Motion
				initial={animate}
				animate={animate}
				onMotionComplete={() => reject()}
				onMotionStart={() => reject()}
				transition={{duration}}
			/>
		))

		await promise
		dispose()
	})

	test("Animation runs when target changes", async () => {
		const [promise, resolve] = makePromise()
		const [animate, setAnimate] = s.createSignal({opacity: 0.5})

		let el!: HTMLDivElement
		const dispose = render(() => (
			<Motion
				ref={el}
				initial={{opacity: 0}}
				animate={animate()}
				onMotionComplete={({detail}) => {
					if (detail.target.opacity === 0.8) resolve(true)
				}}
				transition={{duration}}
			/>
		))

		setAnimate({opacity: 0.8})
		expect(el.style.opacity).not.toBe("0.8")
		await promise
		expect(el.style.opacity).toBe("0.8")
		dispose()
	})

	test("Accepts default transition", async () => {
		let el!: HTMLDivElement
		const dispose = render(() => (
			<Motion
				ref={el}
				initial={{opacity: 0.5}}
				animate={{opacity: 0.9}}
				transition={{duration: 10}}
			/>
		))

		await new Promise(res => setTimeout(res, 500))

		expect(el.style.opacity).not.toBe("0.5")
		expect(el.style.opacity).not.toBe("0.9")
		dispose()
	})

	test("animate default transition", async () => {
		const element = await new Promise<HTMLElement>(resolve => {
			let ref!: HTMLDivElement
			render(() => (
				<Motion.div
					ref={ref}
					initial={{opacity: 0.5}}
					animate={{opacity: 0.9, transition: {duration: 10}}}
				/>
			))
			setTimeout(() => resolve(ref), 500)
		})
		expect(element.style.opacity).not.toEqual("0.9")
	})

	test("Passes event handlers", async () => {
		const captured: any[] = []
		const element = await new Promise<HTMLElement>(resolve => {
			let ref!: HTMLDivElement
			render(() => (
				<Motion.div ref={ref} hover={{scale: 2}} onHoverStart={() => captured.push(0)} />
			))
			setTimeout(() => resolve(ref), 1)
		})
		const ev = new MouseEvent("mouseenter")
		element.dispatchEvent(ev)
		expect(captured).toEqual([0])
	})
})
