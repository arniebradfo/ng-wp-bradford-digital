/**
 * Js component boilerplate
 * description
 */

(function (document, window) {

	var defaultNav = {
		forward: 'navigationJS_default',
		back: 'navigationJS_default'
	};
	// var continueSearching;

	var setState = function () {
		var setStateContexts = document.querySelectorAll('[data-routersetstate]');
		// console.log(setStateContexts);
		setStateContexts.forEach(function (context) {
			// console.log(context);			
			// console.log(context.dataset.routersetstate);
			window[context.dataset.routersetstate](context, context.href);
		});
	};

	var navigate = function (context, href) {
		// continueSearching = false;

		if (!context.dataset.navforward) context.dataset.navforward = defaultNav.forward;
		if (!context.dataset.navback) context.dataset.navback = defaultNav.back;

		console.log('pushState');
		// TODO: save copy of DOM as a string for back navigation?
		window.history.pushState({
			navforward: context.dataset.navforward,
			navback: context.dataset.navback
		}, '', href);
		console.log(window.history.state);

		window[context.dataset.navforward](context, href);
	};

	var findNavigationType = function (context, href) {
		continueSearching = true;
		while (true) {
			if (context.dataset.navforward || context.tagName === 'BODY') {
				navigate(context, href);
				return;
			}
			context = context.parentElement;
		}
	};

	// calls loadPage when the browser back button is pressed
	var ajaxPopState = function (event) {
		console.log(event);		
		console.log(window.history);
		console.log('popState');
		// TODO: test browser implementation inconsistencies of popstate
		if (event.state != null) { // don't fire on the inital page load
			// TODO: get better context.
			window[event.state.navback](document.body, document.location);
		}
	};

	// transforms all the interal hyperlinks into ajax requests
	var attachRoutedClicks = function (event) {
		// console.dir(this); // for debugging

		var e = event || window.event; // http://stackoverflow.com/questions/3493033/what-is-the-meaning-of-this-var-evt-eventwindow-event

		if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return; // if the click was a cmd/ctrl/alt/shift click

		// find the if the click happened in a link element
		var parent = e.target;
		while (true) {
			if (parent.tagName === 'BODY') return; // not a link
			if (parent.tagName === 'A') break;
			parent = parent.parentElement;
		}
		var link = parent;

		if (!link.href) return; // if the link has no destination

		if (link.href === window.location.href // if the page is exactly the same page
			&& !window.location.hash
		) { 
			console.log("you're already on that page");
			e.preventDefault();
			return;
		}

		// var currentPageWithParameters = new RegExp(window.location.origin + window.location.pathname + '[^\/]*[&#?]', 'g');
		var adminUrl = new RegExp('\/wp-', 'g');

		if ((link.href.indexOf(document.domain) > -1 || link.href.indexOf(':') === -1) // if the link goes to the current domain
			// && !link.href.match(currentPageWithParameters)  // href isnt a parameterized link of the current page
			&& !link.href.match(adminUrl)  // href doesn't go to the wp-admin backend
			&& !link.href.match(/\/feed/g) // is not an rss feed of somekind
		) { 
			e.preventDefault();
			findNavigationType(link, link.href);
		}
	};

	var initalize = function () {
		window.addEventListener('popstate', ajaxPopState, false);
		document.addEventListener('click', attachRoutedClicks, true);
		setState();
	};

	// if it just needs raw DOM HTML
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initalize, false);
	else initalize();

	// // if it needs other DOM resources
	// if (document.readyState === 'loading' || document.readyState === 'interactive') {
	// 	window.addEventListener('load', initalize, false);
	// } else { initalize(); }
})(document, window);
