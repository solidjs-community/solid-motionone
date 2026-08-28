const transform_client_path = require.resolve("./transform-client.cjs")
const transform_ssr_path = require.resolve("./transform-ssr.cjs")
const resolver_path = require.resolve("./resolver.cjs")

/** @type {import('@jest/types').Config.InitialOptions} */
const common_config = {
	rootDir: "../",
	globals: {"ts-jest": {useESM: true}},
	transformIgnorePatterns: ["node_modules/(?!solid-js.*|.*(?<=.[tj]sx))$"],
	/* handles @solid-primitives/* ESM-only next-tag resolution, see resolver.cjs */
	resolver: resolver_path,
	/*
	to support NodeNext module imports
	https://stackoverflow.com/questions/73735202/typescript-jest-imports-with-js-extension-cause-error-cannot-find-module
	*/
	moduleNameMapper: {
		"(.+)\\.js": "$1",
		"(.+)\\.jsx": "$1",
	},
	extensionsToTreatAsEsm: [".ts", ".tsx"],
}

/** @type {import('@jest/types').Config.InitialOptions} */
const client_config = {
	...common_config,
	testEnvironment: "jsdom",
	testMatch: ["<rootDir>/test/**/*.test.(js|ts)?(x)"],
	testPathIgnorePatterns: ["/node_modules/", "ssr"],
	setupFilesAfterEnv: ["<rootDir>/test/setup.js"],
	/* picks the "browser" exports condition so @solidjs/web resolves its DOM build */
	testEnvironmentOptions: {
		customExportConditions: ["browser"],
	},
	/* transform ts, tsx, and esm .mjs files */
	transform: {
		"\\.[jt]sx$": transform_client_path,
		"\\.[jt]s$": transform_client_path,
		"\\.mjs$": transform_client_path,
	},
}

/** @type {import('@jest/types').Config.InitialOptions} */
const server_config = {
	...common_config,
	// avoid loading jsdom.
	testEnvironment: "node",
	testMatch: ["<rootDir>/test/ssr.test.(js|ts)?(x)"],
	/* transform ts, tsx, and esm .mjs files */
	transform: {
		"\\.[jt]sx$": transform_ssr_path,
		"\\.[jt]s$": transform_ssr_path,
		"\\.mjs$": transform_ssr_path,
	},
}

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = process.env["SSR"] ? server_config : client_config
