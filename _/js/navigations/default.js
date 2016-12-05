/**
 * navigation js class
 * must conform to interface:
 * @param {HTMLelement} context - an html element to look for elements inside of
 * @param {url} href - where are we going to navigate to?
 */

(function (document, window) {
	'use strict';

	window.WpRouter_default = function (context, href, xhr) {
		// console.dir(this); // for debugging

		// SET TYPE
		// href = window.addAjaxQueryString(href, 'getpage');

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
		xhr.onload = function () {
			var workspace = document.createElement('div');
			workspace.innerHTML = xhr.responseText;
			// console.log(workspace); // for debugging
			// ... do something with the response
			document.querySelector('.mainNav').innerHTML = workspace.querySelector('.mainNav').innerHTML;
			document.querySelector('.postListWrapper').innerHTML = workspace.querySelector('.postListWrapper').innerHTML;
			document.querySelector('.mainContent').innerHTML = workspace.querySelector('.mainContent').innerHTML;

		};

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
