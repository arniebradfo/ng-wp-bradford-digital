/**
 * whichTransitionEvent
 * crossbroswer transitionEnd event
 * @link https://davidwalsh.name/css-animation-callback
 */

// usage: //
// var transitionEvent = window.whichTransitionEvent();
// transitionEvent && element.addEventListener(transitionEvent, function() {
// 	console.log('Transition complete!  This is the callback, no library needed!');
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
