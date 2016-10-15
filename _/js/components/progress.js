/**
 * progress
 * track the progress of an xhr request
 * @param {Array} states - a [key,value] pair of states to track and their maximum index
	states = [
		[stateOne, stateOneMax]
		[stateTwo, stateTwoMax]
	]
 */

(function (document, window) {
	window.Progress = function (states) {
		'use strict';
		console.dir(this); // for debugging
		var self = this;

		states = [ [0, 2], [0, 5] ]; // hardcode

		this.trackedStates = states;
		this.trackedStatesComplete = false;
		this.trackedStatesTotal = (function () {
			var _total = 0;
			for (var i = 0; i < self.trackedStates.length; i++) {
				_total += self.trackedStates[i][1];
			}
			return _total;
		})();

		this.state = 0; // progress between 0 and 1
		this.forward = function (amount) { // update the progress element
			if (this.state >= 1) {
				this.complete();
				return;
			}
			window.requestAnimationFrame(this.forward);
			this.trackedStatesComplete = true;
			for (var i = 0; i < this.trackedStates.length; i++) {
				if (this.trackedStates[i][0] !== this.trackedStates[i][1]) {
					this.trackedStatesComplete = false;
				}
			}
			if (this.trackedStatesComplete) {
				this.state = 1;
			} else {
				// update the state number based on other states
			}
			this.update();
		};
		this.update = null; // {Function} - uses state to animate ui feedback
		this.complete = null; // {Function} - call back for when update completes
	};
})(document, window);
