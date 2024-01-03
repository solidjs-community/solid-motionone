const transform_client_path = require.resolve("./transform-client.cjs")
const transform_ssr_path = require.resolve("./transform-ssr.cjs")
const resolver_path = require.resolve("./resolver.cjs")

/** @type {import('@jest/types').Config.InitialOptions} */
const common_config = {
	rootDir: "../",
	globals: {"ts-jest": {useESM: true}},
	transformIgnorePatterns: ["node_modules/(?!solid-js.*|.*(?<=.[tj]sx))$"],
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
	setupFilesAfterEnv: ["<rootDir>/test/waapi-polyfill.js"],
	/* uses a webpack style resolver, the default one has many issues. */
	resolver: resolver_path,
	/* transform ts and tsx files */
	transform: {
		"\\.[jt]sx$": transform_client_path,
		"\\.[jt]s$": transform_client_path,
	},
}

/** @type {import('@jest/types').Config.InitialOptions} */
const server_config = {
	...common_config,
	// avoid loading jsdom.
	testEnvironment: "node",
	testMatch: ["<rootDir>/test/ssr.test.(js|ts)?(x)"],
	/* transform ts and tsx files */
	transform: {
		"\\.[jt]sx$": transform_ssr_path,
		"\\.[jt]s$": transform_ssr_path,
	},
}

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = process.env["SSR"] ? server_config : client_config
