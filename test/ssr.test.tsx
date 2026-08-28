import {renderToString} from "@solidjs/web"
import {Motion, Presence} from "../src/index.jsx"

jest.mock("@solidjs/web", () => ({
	...jest.requireActual("@solidjs/web"),
	template: jest.fn(),
}))

describe("ssr", () => {
	test("Renders", () => {
		const html = renderToString(() => <Motion.div />)
		expect(html).toBe('<div _hk=2010 style=""></div>')
	})

	test("Renders style", () => {
		const html = renderToString(() => <Motion.div style={{opacity: 1}} />)
		expect(html).toBe(`<div _hk=2010 style="opacity:1"></div>`)
	})

	test("Renders initial as style", () => {
		const html = renderToString(() => <Motion.div initial={{scale: 1.2, opacity: 1}} />)
		expect(html).toBe(`<div _hk=2010 style=\"opacity:1;transform:scale(1.2)\"></div>`)
	})

	test("Renders initial and style", () => {
		const html1 = renderToString(() => (
			<Motion.div style={{margin: "24px"}} initial={{scale: 1.2, opacity: 1}} />
		))
		expect(html1).toBe(
			`<div _hk=2010 style=\"margin:24px;opacity:1;transform:scale(1.2)\"></div>`,
		)

		const html2 = renderToString(() => (
			<Motion.div style={`margin: 24px`} initial={{scale: 1.2, opacity: 1}} />
		))
		expect(html2).toBe(
			`<div _hk=2010 style=\"margin:24px;opacity:1;transform:scale(1.2)\"></div>`,
		)
	})

	test("Renders svg with attrs", () => {
		const html = renderToString(() => (
			<Motion.rect initial={{height: 50}} width="50" x="0" y="100" />
		))
		expect(html).toBe(
			`<rect _hk=2010 width=\"50\" x=\"0\" y=\"100\" style=\"height:50px\"></rect>`,
		)
	})

	test("Children render inherited initial", () => {
		const html = renderToString(() => (
			<Motion.div
				initial="hidden"
				variants={{hidden: {opacity: 0, "background-color": "red"}}}
			>
				<Motion.ul variants={{hidden: {y: 100, "background-color": "purple"}}}>
					<Motion.li variants={{hidden: {"background-color": "green"}}} />
				</Motion.ul>
			</Motion.div>
		))
		expect(html).toBe(
			`<div _hk=2010 style=\"opacity:0;background-color:red\"><ul _hk=2013010 style=\"background-color:purple;transform:translateY(100px)\"><li _hk=2013013010 style=\"background-color:green\"></li></ul></div>`,
		)
	})

	test("Renders expected markup from style as keyframes", () => {
		const div = renderToString(() => <Motion.div initial={{opacity: [0, 1]}} />)
		expect(div).toBe(`<div _hk=2010 style=\"opacity:0\"></div>`)
	})

	test("Renders expected CSS variables", () => {
		const div = renderToString(() => (
			<Motion.div
				initial={{"--foo": 0, "--bar": 2}}
				style={{"--bar": 1, "--car": 3} as any}
			/>
		))
		expect(div).toBe(`<div _hk=2010 style=\"--bar:2;--car:3;--foo:0\"></div>`)
	})

	test("Renders expected transform", () => {
		const div = renderToString(() => <Motion.div initial={{x: 100}} />)
		expect(div).toBe(`<div _hk=2010 style=\"transform:translateX(100px)\"></div>`)
	})

	test("Filters out all props", () => {
		const div = renderToString(() => (
			<Motion.div hover={{opacity: 1}} press={{opacity: 1}} variants={{}} />
		))
		expect(div).toBe('<div _hk=2010 style=""></div>')
	})

	test("Renders Presence", () => {
		const html = renderToString(() => (
			<Presence>
				<Motion.div />
			</Presence>
		))
		expect(html).toBe('<div _hk=0002010 style=""></div>')
	})

	test("Renders Presence with initial styles", () => {
		const html = renderToString(() => (
			<Presence>
				<Motion.div initial={{opacity: 1}} />
			</Presence>
		))
		expect(html).toBe('<div _hk=0002010 style="opacity:1"></div>')
	})

	test("Renders Presence without initial styles", () => {
		const html = renderToString(() => (
			<Presence initial={false}>
				<Motion.div initial={{opacity: 1}} />
			</Presence>
		))
		expect(html).toBe('<div _hk=0002010 style=""></div>')
	})
})
