/*
jsdom doesn't implement IntersectionObserver. This is a minimal stub so
`inView()` (used for the `inView` prop) can construct and register without
crashing; it never actually fires, so entry-triggering behavior isn't
covered by these tests.
*/
if (typeof globalThis.IntersectionObserver === "undefined") {
	globalThis.IntersectionObserver = class IntersectionObserver {
		observe() {}
		unobserve() {}
		disconnect() {}
		takeRecords() {
			return []
		}
	}
}
