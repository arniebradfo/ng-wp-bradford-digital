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
	window.Progress = function (trackedStateList, callback) {
		'use strict';
		console.dir(this); // for debugging
		var self = this;

		this.trackedStates = {};
		this.trackedStates.list = trackedStateList;
		this.trackedStates.total = (function () {
			var _total = 0;
			for (var i = 0; i < self.trackedStates.list.length; i++) {
				_total += self.trackedStates.list[i][1];
			}
			return _total;
		})();
		this.trackedStates.current = function () {
			var _current = 0;
			for (var i = 0; i < this.list.length; i++) {
				_current += this.list[i][0];
			}
			return _current;
		};
		this.trackedStates.previous = 0;
		this.trackedStates.complete = function () {
			for (var i = 0; i < this.list.length; i++) {
				if (this.list[i][0]() < this.list[i][1]) {
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
			if (self.complete()) {
				self.callback();
				return;
			}
			window.requestAnimationFrame(self.forward);
			// console.log(self.trackedStates.complete());
			if (self.trackedStates.complete()) {
				self.state = self.stateMax;
			} else {
				// increase by a fraction of the remaining reserved
				var _remaining = self.stateMax - self.state;
				if (self.trackedStates.current() > self.trackedStates.previous) {
					var _difference = self.trackedStates.current() - self.trackedStates.previous;
					var _thing = self.trackedStates.total - self.trackedStates.previous;
					self.state += (_difference / _thing) * _remaining;
					self.trackedStates.previous = self.trackedStates.current();
				} else {
					self.state += self.params.coefficient * _remaining;
				}
			}
			self.update();
		};
		this.start = this.forward;
	};
})(document, window);
