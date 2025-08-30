import { createContext, useContext, createSignal, JSX, ParentProps } from "solid-js"
import { Dynamic } from "solid-js/web"
import type { LayoutState } from "../types.js"

// 🆕 Layout group context interface
export interface LayoutGroupContext {
	registerElement: (element: Element, id: string | undefined) => void
	unregisterElement: (element: Element) => void
	getLayoutState: (id: string) => LayoutState | undefined
	updateLayout: (id: string, snapshot: DOMRect) => void
}

// 🆕 Create layout group context
const LayoutGroupContext = createContext<LayoutGroupContext>()

// 🆕 Layout group component props
interface LayoutGroupProps extends ParentProps {
	id?: string
	as?: keyof JSX.IntrinsicElements
}

// 🆕 Layout group component
export function LayoutGroup(props: LayoutGroupProps): JSX.Element {
	const [layoutMap, setLayoutMap] = createSignal<Map<string, LayoutState>>(new Map())
	const [elementMap, setElementMap] = createSignal<Map<Element, string>>(new Map())

	// 🆕 Register an element with the layout group
	const registerElement = (element: Element, id: string | undefined) => {
		if (!id) return

		setElementMap(prev => {
			const newMap = new Map(prev)
			newMap.set(element, id)
			return newMap
		})

		setLayoutMap(prev => {
			const newMap = new Map(prev)
			newMap.set(id, {
				element,
				id,
				snapshot: element.getBoundingClientRect(),
				isAnimating: false
			})
			return newMap
		})
	}

	// 🆕 Unregister an element from the layout group
	const unregisterElement = (element: Element) => {
		setElementMap(prev => {
			const newMap = new Map(prev)
			const id = newMap.get(element)
			if (id) {
				newMap.delete(element)
			}
			return newMap
		})

		setLayoutMap(prev => {
			const newMap = new Map(prev)
			const id = elementMap().get(element)
			if (id) {
				newMap.delete(id)
			}
			return newMap
		})
	}

	// 🆕 Get layout state for a specific ID
	const getLayoutState = (id: string): LayoutState | undefined => {
		return layoutMap().get(id)
	}

	// 🆕 Update layout state for a specific ID
	const updateLayout = (id: string, snapshot: DOMRect) => {
		setLayoutMap(prev => {
			const newMap = new Map(prev)
			const existing = newMap.get(id)
			if (existing) {
				newMap.set(id, {
					...existing,
					snapshot,
					isAnimating: true
				})
			}
			return newMap
		})
	}

	// 🆕 Context value
	const contextValue: LayoutGroupContext = {
		registerElement,
		unregisterElement,
		getLayoutState,
		updateLayout
	}

	// 🆕 Render the layout group
	const { as, ...restProps } = props
	
	return (
		<LayoutGroupContext.Provider value={contextValue}>
			<Dynamic
				component={props.as || "div"}
				{...restProps}
			>
				{props.children}
			</Dynamic>
		</LayoutGroupContext.Provider>
	)
}

// 🆕 Hook to use layout group context
export function useLayoutGroup(): LayoutGroupContext | undefined {
	return useContext(LayoutGroupContext)
}
