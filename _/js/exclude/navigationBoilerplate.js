/**
 * navigation js class
 * must conform to interface:
 * @param {HTMLelement} context - an html element to look for elements inside of
 * @param {url} href - where are we going to navigate to?
 */

(function (document, window) {
	'use strict';

	window.WpRouter_name = function (context, href) {
		console.dir(this); // for debugging

		// SET TYPE
		href = window.addAjaxQueryString(href, 'getpage');

		// FLIP ANIMATION SETUP
		var animateMutate = new window.AnimateMutate({
			// name: 'selector',
		}, context);

		animateMutate.mutate = function () {
			// ... MUTATE elements

			// ... apply styles

			// ... collect rects without transform
			// someElement.style.transform = '';
		};

		animateMutate.invert = function () {
			// ... apply INVERT css to mutate node back to its original state
		};

		animateMutate.play = function () {
			// ... switch on transitions
			// someElement.style.transition = '';
			// ... remove INVERT css to PLAY the transitions
			// someElement.style.transform = '';
		};

		// CLEANUP
		// animateMutate.cleanUpAfter = someElement; // follows the transition end
		animateMutate.cleanUp = function () {
			// ... what to do after all transitions end
		};

		// AJAX REQUEST
		var xhr = new window.XMLHttpRequest();
		xhr.open('GET', href, true);
		xhr.timeout = 5000;
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // ALWAYS set this!
		xhr.setRequestHeader('WP-Request-Type', 'GetPage');
		// console.dir(xhr); // for debugging
		xhr.onload = function () {
			var workspace = document.createElement('div');
			workspace.innerHTML = xhr.responseText;
			// console.log(workspace); // for debugging
			// ... do something with the response
		};
		xhr.onerror = xhr.onabort = xhr.ontimeout = function () {
			console.log('ajax failed');
			window.location = href;
		}

		// WHEN EVERYTHING IS DONE
		var onFinish = function () {
			// ... when all loading and animation has finished
		};

		// PROGRESS ELEMENT
		var xhrReadyState = function () {
			return xhr.readyState;
		};
		var trackedStatesList = [
			[xhrReadyState, 4]
		];
		var progressTracker = new window.ProgressTracker(trackedStatesList, onFinish);
		progressTracker.update = function () {
			// ...update load element with the Progress.readyState
			// someElement.style.transform = 'scaleX(' + this.readyState + ')';
		};

		// GO!
		xhr.send();
		animateMutate.animate();
		progressTracker.start();
	};
})(document, window);
