/**
 * RequestImg
 * mutate an image from one source to another, and animate
 */

(function (document, window) {
	window.RequestImg = function (img, callback) {
		'use strict';
		console.dir(this); // for debugging
		var self = this;

		this.img = img;
		this.callback = callback;

		this.state = function () {
			return (self.img.complete && self.attsMutated) ? 1 : 0;
		};
		this.stateMax = 1; // how high the state increments
		this.complete = function () {
			return self.stateMax <= self.state;
		};

		this.attsMutated = false;
		this.mutateAtts = function () { // edit the img src and attach onload
			this.img.onload = this.callback;
			for (var att in this.img.dataset) {
				this.img.setAttribute(att, this.img.dataset[att]);
				this.img.removeAttribute('data-' + att);
			}
			this.attsMutated = true;
		};
	};
})(document, window);
