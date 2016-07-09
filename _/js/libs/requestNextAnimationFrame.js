/**
 * requestNextAnimationFrame
 * calls callback function on the frame after requestNextAnimationFrame was called
 * @param {function} callback : function to run in the next animation frame
 * @example
	window.requestNextAnimationFrame(function () {
		console.log('this is the next animation frame');
	});
 */

(function (window) {
	window.requestNextAnimationFrame = function (callback) {
		'use strict';
		var self = this;

		// throw error if parameter is not function
		self.parameterError = 'requestNextAnimationFrame() requires a function as its sole parameter';
		if (typeof callback === 'function') self.callback = callback;
		else throw self.parameterError;

		self.queueTime = null;
		self.testAnimationFrame = function () {
			window.requestAnimationFrame(function (timestamp) {
				if (!self.queueTime) self.queueTime = timestamp;

				// if this is called in the same frame as it was queued, try again.
				if (self.queueTime === timestamp) {
					self.testAnimationFrame();
					return;
				}

				self.callback();
			});
		};

		return self.testAnimationFrame();
	};
})(window);
