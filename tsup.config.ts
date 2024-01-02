import * as tsup from "tsup"
import * as preset from "tsup-preset-solid"

const preset_options: preset.PresetOptions = {
	entries: {entry: "src/index.tsx"},
	drop_console: true,
	cjs: true,
}

export default tsup.defineConfig(config => {
	const watching = !!config.watch

	const parsed_data = preset.parsePresetOptions(preset_options, watching)

	if (!watching) {
		const package_fields = preset.generatePackageExports(parsed_data)

		// eslint-disable-next-line no-console
		console.log(`package.json: \n\n${JSON.stringify(package_fields, null, 2)}\n\n`)

		/*
        will update ./package.json with the correct export fields
        */
		preset.writePackageJson(package_fields)
	}

	return preset.generateTsupOptions(parsed_data)
})
