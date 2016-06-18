module.exports = function (grunt) {
	// generates scss libs from css reset libs
	grunt.registerTask(
		'csslibs', [
			'concat:normalize',
			'concat:reset',
			'concat:sanitize'
		]
	);
};
