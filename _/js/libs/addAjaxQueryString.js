/**
 * add a query string to the uri
 * description
 */

(function (document, window) {
	window.addAjaxQueryString = function (href, value) {
		value = (value !== undefined) ? value : 'true';
		href += '?ajax=' + value + '';
		return href;
	};
})(document, window);