/**
 * navigation js class
 * must conform to interface:
 * @param {HTMLelement} context - an html element to look for elements inside of
 * @param {url} href - where are we going to navigate to?
 */

(function (document, window) {
	'use strict';

	window.navigationJS_mainNavToggle = function (context, href) {
		// console.dir(this); // for debugging

        context = context == null ? document.querySelector('.mainNav__toggle') : context ; 

        if (window.location.hash === '#navOpen') {
            context.hash = '#navClosed';
            document.body.classList.remove('body--mainNavClosed');
            document.body.classList.add('body--mainNavOpen');
        } else {
            context.hash = '#navOpen';
            document.body.classList.remove('body--mainNavOpen');
            document.body.classList.add('body--mainNavClosed');
        }
	};

})(document, window);
