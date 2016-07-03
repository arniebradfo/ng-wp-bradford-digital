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

(function (document, window) {
	/* From Modernizr */
	window.whichTransitionEvent = function () {
		var t;
		var el = document.createElement('fakeelement');
		var transitions = {
			'transition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'MozTransition': 'transitionend',
			'WebkitTransition': 'webkitTransitionEnd'
		};
		for (t in transitions) {
			if (el.style[t] !== undefined) {
				return transitions[t];
			}
		}
	};
})(document, window);
