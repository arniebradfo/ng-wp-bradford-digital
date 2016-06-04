module.exports = {
	main: {
		options: {
			updateType: 'prompt',
			reportUpdated: false,   // don't report up-to-date packages
			semver: false,          // true - stay within semver when updating | false - update all regardless
			packages: {
				devDependencies: true, // only check for devDependencies
				dependencies: true
			},
			packageJson: null, // use matchdep default findup to locate package.json
			reportOnlyPkgs: [] // use updateType action on all packages
		}
	}
};
