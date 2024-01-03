const babelJest = require("babel-jest")

module.exports = babelJest.default.createTransformer({
	presets: [
		"@babel/preset-env",
		"babel-preset-solid",
		["@babel/preset-typescript", {onlyRemoveTypeImports: true}],
	],
})
