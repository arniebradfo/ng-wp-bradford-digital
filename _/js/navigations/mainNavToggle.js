/**
 * navigation js class
 * must conform to interface:
 * @param {HTMLelement} context - an html element to look for elements inside of
 * @param {url} href - where are we going to navigate to?
 */

(function (document, window) {
	'use strict';

	window.navigationJS_mainNavToggle = function (context, href) {
		console.dir(this); // for debugging

        console.log(context);

        if (document.body.classList.contains('body--mainNavOpen')) {
            document.body.classList.remove('body--mainNavOpen');
            document.body.classList.add('body--mainNavClosed');
        } else {
            document.body.classList.remove('body--mainNavClosed');
            document.body.classList.add('body--mainNavOpen');
        }

	};
})(document, window);
