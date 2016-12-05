/**
 * navigation js class
 * must conform to interface:
 * @param {HTMLelement} context - an html element to look for elements inside of
 * @param {url} href - where are we going to navigate to?
 */

(function (document, window) {
	'use strict';

	window.WpRouter_mainNavToggle = function (context, href, xhr) {
		// console.dir(this); // for debugging

        var toggle = document.querySelector('.mainNav__toggle') ; 

        // console.log(toggle);
        // console.log(toggle.hash);
        if (window.location.hash !== '#navOpen') {
            // context.hash = '#navOpen';
            document.body.classList.remove('body--mainNavOpen');
            document.body.classList.add('body--mainNavClosed');
        } else {
            // context.hash = '#navClosed';
            document.body.classList.remove('body--mainNavClosed');
            document.body.classList.add('body--mainNavOpen');
        }
	};

})(document, window);
