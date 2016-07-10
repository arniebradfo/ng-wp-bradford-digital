/**
 * wpAjax
 * description
 */

(function (document, window) {
	// inherits from the XMLHttpRequest class
	var WPHttpRequest = function (options) {
		console.dir(this); // for debugging
		var self = this;

		for (var option in options) {
			self[option] = options[option];
		}
		if (!self.href) return false; // throw error

		self.xhr = new window.XMLHttpRequest();

		self.responseFunctions = [
			'onabort',
			'onerror',
			'onprogress',
			'onload',
			'onloadend',
			'onloadstart',
			'onreadystatechange',
			'ontimeout'
		];
		self.responseFunctions.forEach(function (response) {
			if (self.hasOwnProperty(response)) {
				self.xhr[response] = function (e) {
					if (typeof self[response] === 'function') self[response](self);
				};
			}
		});

		self.httpMethod = typeof self.httpMethod === 'string' ? self.httpMethod.toUpperCase() : 'GET';
		if (self.httpMethod === 'GET' ||
			self.httpMethod === 'POST' ||
			self.httpMethod === 'PUT') {
			self.xhr.open(self.httpMethod, self.href, true);
		} else {
			return false; // throw error
		}

		self.requestHeaders = typeof self.requestHeaders === 'object' ? self.requestHeaders : {};
		self.requestHeaders['X-Requested-With'] = 'XMLHttpRequest';
		for (var header in self.requestHeaders) {
			self.xhr.setRequestHeader(header, self.requestHeaders[header]);
		}

		// Set the amout of time (in milliseconds) until the ajax request times out.
		self.xhr.timeout = typeof self.timeoutTimer === 'number' ? self.timeoutTimer : 0;

		if (typeof self.data === 'string') {
			self.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			self.xhr.send(self.data);
		} else {
			self.xhr.send();
		}
	};

	var wpAjax = function () {
		var requestObj = {
			href: 'http://localhost:8888',
			onloadend: function () {
				console.log(this);
			}
		};
		var test = new WPHttpRequest(requestObj);
		test.xhr.onprogress = function (e) {
			console.log(test);
		};
	};

	// if it just needs raw DOM HTML
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', wpAjax, false);
	} else { wpAjax(); }

	// // if it needs other DOM resources
	// if (document.readyState === 'loading' || document.readyState === 'interactive') {
	// 	window.addEventListener('load', wpAjax, false);
	// } else { wpAjax(); }
})(document, window);
