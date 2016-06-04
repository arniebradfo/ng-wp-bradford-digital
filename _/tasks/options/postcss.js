module.exports = {
	options: {
		processors: [
			require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
			require('css-mqpacker')() // combine media queries
			// require('cssnano')() // minify the result - http://cssnano.co/
		]
	},
	global: {
		src: '_/css/build/global-sass.css',
		dest: 'style.css'
	}
};
