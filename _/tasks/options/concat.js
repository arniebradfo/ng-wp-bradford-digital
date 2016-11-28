module.exports = {
	// options: {
	//   separator: ';',
	// },
	js: {
		src: [
			'_/js/libs/*.js',
			'_/js/components/*.js',
			'_/js/navigations/*.js',
			'_/js/*.js'
		],
		dest: '_/js/build/production.js'
	},
	// modernizr: {
	// 	src: [
	// 		'_/js/build/modernizr-custom.js',
	// 		'_/js/requires_modernizr/*.js'
	// 	],
	// 	dest: '_/js/build/modernizr-custom.js'
	// },
	normalize: {
		src: [ 'node_modules/normalize.css/normalize.css' ],
		dest: '_/css/libs/normalize.scss'
	},
	reset: {
		src: [ 'node_modules/reset-css/reset.css' ],
		dest: '_/css/libs/reset.scss'
	},
	sanitize: {
		src: [ 'node_modules/sanitize.css/sanitize.css' ],
		dest: '_/css/libs/sanitize.scss'
	}
};
