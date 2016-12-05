/**
 * xhrCached
 * similar interface to XMLHttpRequest
 */

(function (document, window) {
	window.xhrCached = function (simulatedResponseText) {
		'use strict';
		// console.dir(this); // for debugging
		// var self = this;

		this.responseText = simulatedResponseText;

		this.readyState = 1;

		this.onreadystatechange;
		this.onload;
		this.onloadend;
		this.progress;

		this.send = function () {
			this.readyState = 4;
			if (typeof this.onreadystatechange === 'function' ) this.onreadystatechange();
			if (typeof this.progress === 'function' ) this.onreadystatechange();
			if (typeof this.onload === 'function' ) this.onreadystatechange();
			if (typeof this.onloadend === 'function' ) this.onreadystatechange();
			this.status = 200;
			this.statusText = '200 This was cached in history.state';
		};

	};
})(document, window);
