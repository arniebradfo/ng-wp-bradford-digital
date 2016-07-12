/**
 * RequestImg
 * mutate an image from one source to another, and animate
 */

(function (document, window) {
	window.RequestImg = function (img, callback) {
		'use strict';
		console.dir(this); // for debugging
		this.img = img;
		this.callback = callback;

		this.mutateAtts = function () { // edit the img src and attach onload
			this.img.onload = this.callback();
			for (var att in this.img.dataset) {
				this.img.setAttribute(att, this.img.dataset[att]);
				this.img.removeAttribute('data-' + att);
			}
		};
	};
})(document, window);
