module.exports = {
	options: {
		prefix: 'svg-',   // This will prefix each <symbol> ID
		svg: {              // will be added as attributes to the resulting SVG
			style: 'position:absolute;left:-9999px;top:-9999px;'
			// style : 'width:0;height:0;visibility:hidden;'
			// style : 'display: none;'
		},
		includedemo: true,
		cleanup: false,      // true - removes all inline styles - ??? - ['fill']
		cleanupdefs: false,
		formatting: {
			indent_size: 4,
			indent_char: '',
			brace_style: 'expand'
		}
	},
	default: {
		files: {
			'_/svg/build/svg-defs.svg': ['_/svg/*.svg']
		}
	}
};
