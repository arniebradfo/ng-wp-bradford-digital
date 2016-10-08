/**
 * progress
 * track the progress of an xhr request
 */

(function (document, window) {
	window.Progress = function () {
		'use strict';
		console.dir(this); // for debugging
		// var self = this;

		this.state = 0; // progress between 0 and 1
		this.forward = function (amount) { // update the progress element

		};
		this.update = null; // {Function} - uses state to animate ui feedback
		this.complete = null; // {Function} - call back for when update completes
	};
})(document, window);
