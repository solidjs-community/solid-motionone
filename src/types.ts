import type {AnimationOptions, DOMKeyframesDefinition} from "motion-dom"
import type {PropertiesHyphen} from "csstype"
import type {ParentProps} from "solid-js"
import type {JSX} from "@solidjs/web"

/** Matches framer-motion/dom's (unexported) `InViewOptions` shape used by `inView()`. */
export interface ViewportOptions {
	root?: Element | Document
	margin?: string
	amount?: "some" | "all" | number
}

declare module "motion-dom" {
	/*
	 Solid style attribute supports only kebab-case properties.
	 While motion-dom supports both camelCase and kebab-case,
	 but provides only camelCase properties in the types.
	*/
	interface CSSStyleDeclarationWithTransform
		extends Omit<PropertiesHyphen, "direction" | "transition"> {}
}

/** A target of style values to animate to/from, with an optional per-target transition override. */
export type Target = DOMKeyframesDefinition & {transition?: AnimationOptions}

/** Either a direct target object, or a string key into the `variants` prop. */
export type VariantDefinition = Target | string

export type {AnimationOptions}

export interface Options {
	initial?: VariantDefinition | false
	animate?: VariantDefinition
	exit?: VariantDefinition
	hover?: VariantDefinition
	press?: VariantDefinition
	inView?: VariantDefinition
	inViewOptions?: ViewportOptions
	variants?: Record<string, Target>
	transition?: AnimationOptions
}

export interface MotionEvent extends CustomEvent {
	detail: {target: Target}
}

export interface CustomPointerEvent extends CustomEvent {
	detail: {originalEvent: PointerEvent}
}

export interface ViewEvent extends CustomEvent {
	detail: {originalEntry: IntersectionObserverEntry}
}

export interface MotionEventHandlers {
	onMotionStart?: (event: MotionEvent) => void
	onMotionComplete?: (event: MotionEvent) => void
	onHoverStart?: (event: CustomPointerEvent) => void
	onHoverEnd?: (event: CustomPointerEvent) => void
	onPressStart?: (event: CustomPointerEvent) => void
	onPressEnd?: (event: CustomPointerEvent) => void
	onViewEnter?: (event: ViewEvent) => void
	onViewLeave?: (event: ViewEvent) => void
}

export type MotionComponentProps = ParentProps<MotionEventHandlers & Options>

export type MotionComponent = {
	// <Motion />
	(props: JSX.IntrinsicElements["div"] & MotionComponentProps): JSX.Element
	// <Motion tag="div" />
	<T extends keyof JSX.IntrinsicElements>(
		props: JSX.IntrinsicElements[T] & MotionComponentProps & {tag: T},
	): JSX.Element
}

export type MotionProxyComponent<T> = (props: T & MotionComponentProps) => JSX.Element

export type MotionProxy = MotionComponent & {
	// <Motion.div />
	[K in keyof JSX.IntrinsicElements]: MotionProxyComponent<JSX.IntrinsicElements[K]>
}

// export only here so the `JSX` import won't be shaken off the tree:
export type E = JSX.Element
