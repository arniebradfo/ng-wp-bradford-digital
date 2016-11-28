/**
 * Js component boilerplate
 * description
 */

(function (document, window) {
	// a list of animation types and their corrosponding css class identifiers
	var defaultType = 'navigationJS_default';
	var types = [
		defaultType,
		'navigationJS_postExpand'
	];
	var continueSearching;

	var navigate = function (context, href, type) {
		continueSearching = false;
		console.log('navigation type: ' + type);
		window.history.pushState({
			type: type
		}, '', href);
		window[type](context, href);
	};

	var findNavigationType = function (context, href) {
		continueSearching = true;
		var scanContextForType = function (type) {
			if (context.classList.contains(type))
				navigate(context, href, type);
		};
		while (continueSearching) {
			if (context.tagName === 'BODY')
				navigate(context, href, defaultType);
			types.forEach(scanContextForType);
			context = context.parentElement;
		}
	};

	// calls loadPage when the browser back button is pressed
	var ajaxPopState = function (event) {
		// TODO: test browser implementation inconsistencies of popstate
		// TODO: make back button paginate comments??
		// if (event.state !== null) { // don't fire on the inital page load
		// 	var optionsSurrogate = wpajax_GETPage;
		// 	optionsSurrogate.href = window.location.href;
		// 	self.load(optionsSurrogate);
		// }
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

		if (link.href === window.location.href) { // if the page is exactly the same page
			console.log("you're already on that page");
			e.preventDefault();
			return;
		}

		var currentPageWithParameters = new RegExp(window.location.origin + window.location.pathname + '[^\/]*[&#?]', 'g');
		var adminUrl = new RegExp('\/wp-', 'g');

		if ((link.href.indexOf(document.domain) > -1 || link.href.indexOf(':') === -1) && // if the link goes to the current domain
		!link.href.match(currentPageWithParameters) && // href isnt a parameterized link of the current page
		// href != window.location.href && // href isn't a link to the current page - we already check for this above
		!link.href.match(adminUrl) && // href doesn't go to the wp-admin backend
		!link.href.match(/\/feed/g)) { // is not an rss feed of somekind
			e.preventDefault();
			findNavigationType(link, link.href);
		}
	};

	var initalize = function () {
		window.addEventListener('popstate', ajaxPopState, false);
		document.addEventListener('click', attachRoutedClicks, true);
	};

	// if it just needs raw DOM HTML
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initalize, false);
	} else { initalize(); }

	// // if it needs other DOM resources
	// if (document.readyState === 'loading' || document.readyState === 'interactive') {
	// 	window.addEventListener('load', initalize, false);
	// } else { initalize(); }
})(document, window);
