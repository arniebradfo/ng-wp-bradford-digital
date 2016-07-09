/**
 * requestNextAnimationFrame
 * calls callback function on the frame after requestNextAnimationFrame was called
 * @param func : function reference or literal
 */

// usage: //
// window.requestNextAnimationFrame(function () {
// 	animationFunction();
// });

(function (window) {
	window.requestNextAnimationFrame = function (func) {
		var self = this;

		// throw error if parameter is not function
		if (typeof func === 'function') this.func = func;
		else throw 'requestNextAnimationFrame() requires a function as its sole parameter';

		this.queueTime = null;
		this.testAnimationFrame = function () {
			window.requestAnimationFrame(function (timestamp) {
				if (!self.queueTime) self.queueTime = timestamp;

				// if this is called in the same frame as it was queued, try again.
				if (self.queueTime === timestamp) {
					this.testAnimationFrame();
					return;
				}

				self.func();
			});
		};

		return this.testAnimationFrame();
	};
})(window);
