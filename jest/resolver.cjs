const fs = require("fs")
const path = require("path")

/*
@solid-primitives/* next-tag prereleases only publish an ESM "import" export
condition (no "require"/"main" fallback), which our CJS-based babel-jest
pipeline can't require() through package.json exports resolution. Walk up
node_modules by hand (mirroring Node's own lookup algorithm) to find the
package directory without going through the exports gate, then point
straight at its "module" (or "main") entry.
*/
function findPackageDir(specifier, fromDir) {
	let dir = fromDir
	for (;;) {
		const candidate = path.join(dir, "node_modules", specifier)
		if (fs.existsSync(candidate)) return candidate
		const parent = path.dirname(dir)
		if (parent === dir) return null
		dir = parent
	}
}

module.exports = function resolver(request, options) {
	if (request.startsWith("@solid-primitives/")) {
		const pkg_dir = findPackageDir(request, options.basedir)
		if (pkg_dir) {
			const pkg_json = JSON.parse(fs.readFileSync(path.join(pkg_dir, "package.json"), "utf8"))
			const entry = pkg_json.module || pkg_json.main
			if (entry) return path.join(pkg_dir, entry)
		}
	}
	return options.defaultResolver(request, options)
}
