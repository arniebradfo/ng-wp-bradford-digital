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
	window.Progress = function (trackedStates, callback) {
		'use strict';
		console.dir(this); // for debugging
		var self = this;

		// trackedStates = [ [0, 2], [0, 5] ]; // hardcode

		this.trackedStates = trackedStates;
		this.trackedStatesTotal = (function () {
			var _total = 0;
			for (var i = 0; i < self.trackedStates.length; i++) {
				_total += self.trackedStates[i][1];
			}
			return _total;
		})();
		this.trackedState = function () {
			var _total = 0;
			for (var i = 0; i < self.trackedStates.length; i++) {
				_total += self.trackedStates[i][0];
			}
			return _total;
		};
		this.trakedStatePrevious = 0;
		this.trackedStatesComplete = function () {
			for (var i = 0; i < this.trackedStates.length; i++) {
				console.log(this.trackedStates[i][0]());
				console.log(this.trackedStates[i][1]);
				if (this.trackedStates[i][0]() < this.trackedStates[i][1]) {
					return false;
				}
			}
			return true;
		};

		this.state = 0; // progress between 0 and 1
		this.stateMax = 1; // how high the state increments
		this.complete = function () {
			return this.stateMax <= this.state;
		};
		this.params = {
			reserved: this.stateMax * 0.1,
			coefficient: (1 / 100)
		};

		this.update = null; // {Function} - uses state to animate ui feedback
		this.callback = callback; // {Function} - call back for when update completes

		this.forward = function () { // update the progress element
			console.log(self.trackedStatesComplete());
			if (self.complete()) {
				self.callback();
				return;
			}
			window.requestAnimationFrame(self.forward);
			if (self.trackedStatesComplete()) {
				self.state = self.stateMax;
			} else {
				// increase by a fraction of the remaining reserved
				var _remaining = self.stateMax - self.state;
				if (self.trackedState > self.trakedStatePrevious) {
					var _difference = self.trackedState - self.trakedStatePrevious;
					self.state += (_difference / (self.trackedStatesTotal - self.trakedStatePrevious)) * _remaining;
					// self.state += (_difference / self.trackedStatesTotal) * (self.stateMax - self.params.reserved);
					self.trakedStatePrevious = self.trakedState;
				} else {
					self.state += self.params.coefficient * _remaining;
				}
			}
			self.update();
		};
		this.start = this.forward;
	};
})(document, window);
