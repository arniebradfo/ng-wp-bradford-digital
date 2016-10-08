module.exports = {
	// https://github.com/gruntjs/grunt-contrib-uglify
	options: {
		maxLineLen: 400,
		screwIE8: true // for real!
	},
	js: {
		options: {
			// preserveComments: 'some', // not working? // https://github.com/gruntjs/grunt-contrib-uglify/issues/366
			preserveComments: function (node, comment) { // preserve comments that start with a bang
				return /^!/.test(comment.value);
			}
		},
		src: '_/js/build/production.js',
		dest: '_/js/build/production.min.js'
	}
	// modernizr: {
	// 	options: {
	// 		preserveComments: false
	// 	},
	// 	src: '_/js/build/modernizr-custom.js',
	// 	dest: '_/js/build/modernizr-custom.min.js'
	// }
};
