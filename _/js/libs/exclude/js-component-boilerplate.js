/**
 * Js component boilerplate
 * description
 */

(function (document, window) {
	var initalize = function () {
		// code...
	};

	// if it just needs raw DOM HTML
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initalize, false);
	} else { initalize(); }

	// if it needs other DOM resources
	if (document.readyState === 'loading' || document.readyState === 'interactive') {
		window.addEventListener('load', initalize, false);
	} else { initalize(); }
})(document, window);
