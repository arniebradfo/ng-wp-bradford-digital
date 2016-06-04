module.exports = {
	dist: {
		options: {
			// cssmin will minify later
			style: 'expanded' // nested, compact, compressed, expanded
		},
		files: {
			'_/css/build/global-sass.css': '_/css/--global.scss'
			// syntax is - 'destination':'source',
		}
	}
};
