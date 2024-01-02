/** @type {import('@jest/types').Config.InitialOptions} */
const common_config = {
	/*
	to support NodeNext module imports
	https://stackoverflow.com/questions/73735202/typescript-jest-imports-with-js-extension-cause-error-cannot-find-module
	*/
	globals: {"ts-jest": {useESM: true}},
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
	preset: "solid-jest/preset/browser",
	testMatch: ["<rootDir>/test/**/*.test.(js|ts)?(x)"],
	testPathIgnorePatterns: ["/node_modules/", "ssr"],
	setupFilesAfterEnv: ["<rootDir>/test/waapi-polyfill.js"],
}

/** @type {import('@jest/types').Config.InitialOptions} */
const server_config = {
	...common_config,
	preset: "solid-jest/preset/node",
	testMatch: ["<rootDir>/test/ssr.test.(js|ts)?(x)"],
}

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = process.env["SSR"] ? server_config : client_config
