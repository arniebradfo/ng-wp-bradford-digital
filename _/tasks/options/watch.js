module.exports = {
	// https://github.com/gruntjs/grunt-contrib-watch
	options: {
		livereload: true
		// must add a special <script> to the .html page
		// https://github.com/gruntjs/grunt-contrib-watch#optionslivereload
	},
	js: {
		files: [
			'_/js/libs/*.js',
			'_/js/components/*.js',
			// '_/js/requires_modernizr/*.js',
			'_/js/*.js'
		],
		tasks: [
			'jshint',
			'concat:js',
			// 'concat:modernizr',
			'uglify'
			// 'modernizr'
		],
		options: {
			spawn: false
		}
	},
	css: {
		files: ['_/css/**/*.scss'],
		tasks: ['sass', 'postcss'],
		options: {
			spawn: false
		}
	},
	svg: {
		files: ['_/svg/*.svg'],
		tasks: ['svgstore'],
		options: {
			spawn: false
		}
	},
	php: {
		files: ['*.php', '_/php/*.php'],
		tasks: [],
		options: {
			spawn: false
		}
	},
	configFiles: {
		files: ['Gruntfile.js', '_/tasks/*.js', '_/tasks/options/*.js'],
		options: {
			reload: true
		}
	}
};
