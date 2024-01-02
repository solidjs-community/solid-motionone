import {defineConfig} from "vitest/config"
import solidPlugin from "vite-plugin-solid"

export default defineConfig(({mode}) => {
	// to test in server environment, run with "--mode ssr" or "--mode test:ssr" flag
	// loads only server.test.ts file
	const testSSR = mode === "test:ssr" || mode === "ssr"

	return {
		plugins: [
			solidPlugin({
				hot: false,
				// For testing SSR we need to do a SSR JSX transform
				solid: {generate: testSSR ? "ssr" : "dom", omitNestedClosingTags: false},
			}),
		],
		test: {
			watch: false,
			isolate: !testSSR,
			env: {
				NODE_ENV: testSSR ? "production" : "development",
				DEV: testSSR ? "" : "1",
				SSR: testSSR ? "1" : "",
				PROD: testSSR ? "1" : "",
			},
			environment: testSSR ? "node" : "jsdom",
			transformMode: {web: [/\.[jt]sx$/]},
			...(testSSR
				? {
						include: ["src/ssr.test.{ts,tsx}"],
					}
				: {
						include: ["src/*.test.{ts,tsx}"],
						exclude: ["src/ssr.test.{ts,tsx}"],
					}),
		},
		resolve: {
			conditions: testSSR ? ["node"] : ["browser", "development"],
		},
	}
})
