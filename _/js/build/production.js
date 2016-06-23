/**
 * Js component boilerplate
 * description
 */

(function (document, window) {

	var transition = function (e) {
		var measureThis = this.getElementsByClassName('postItem__hero')[0];
		var translateThis = this.getElementsByClassName('postItem__heroTranslate')[0];
		var rect = measureThis.getBoundingClientRect();
		var windowBox = {
			height: window.innerHeight,
			width: window.innerWidth
		};
		var scaleY = windowBox.height / rect.height;
		var scaleX = windowBox.width / rect.width;
		var translateX = (windowBox.width / 2) - (rect.left + rect.width / 2);
		var translateY = (windowBox.height / 2) - (rect.top + rect.height / 2);
		translateThis.style.transform = 'translate(' + translateX + 'px,' + translateY + 'px) scale(' + scaleX + ',' + scaleY + ')';
	};

	var initalize = function () {
		var heroWraps = document.getElementsByClassName('postItem');
		for (var i = 0; i < heroWraps.length; i++) {
			var heroWrap = heroWraps[i];
			heroWrap.addEventListener('click', transition, false);
		}
	};

	// // if it just needs raw DOM HTML
	// if (document.readyState === 'loading') {
	// 	document.addEventListener('DOMContentLoaded', initalize, false);
	// } else { initalize(); }

	// if it needs other DOM resources
	if (document.readyState === 'loading' || document.readyState === 'interactive') {
		window.addEventListener('load', initalize, false);
	} else { initalize(); }
})(document, window);
