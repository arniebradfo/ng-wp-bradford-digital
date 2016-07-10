/**
 * addEvent
 * normalizes adding event listeners/handlers
 * @author http://stackoverflow.com/questions/10149963/adding-event-listener-cross-browser
 * @param {Element} element - the element to add the event listener to
 * @param {Event} event - the event to listen for
 * @param {Function} callback - the function called on the event
 */

(function (window) {
	window.addEvent = function (element, event, callback) {
		if (element.addEventListener) {
			element.addEventListener(event, callback, false);
		} else if (element.attachEvent) {
			element.attachEvent('on' + event, function () {
				// set the this pointer same as addEventListener when fn is called
				return (callback.call(element, window.event));
			});
		}
	};
})(window);

/**
 * requestNextAnimationFrame
 * calls callback function on the frame after requestNextAnimationFrame was called
 * @param {function} callback : function to run in the next animation frame
 * @example
	window.requestNextAnimationFrame(function () {
		console.log('this is the next animation frame');
	});
 */

(function (window) {
	window.requestNextAnimationFrame = function (callback) {
		'use strict';
		var self = this;

		// throw error if parameter is not function
		self.parameterError = 'requestNextAnimationFrame() requires a function as its sole parameter';
		if (typeof callback === 'function') self.callback = callback;
		else throw self.parameterError;

		self.queueTime = null;
		self.testAnimationFrame = function () {
			window.requestAnimationFrame(function (timestamp) {
				if (!self.queueTime) self.queueTime = timestamp;

				// if this is called in the same frame as it was queued, try again.
				if (self.queueTime === timestamp) {
					self.testAnimationFrame();
					return;
				}

				self.callback();
			});
		};

		return self.testAnimationFrame();
	};
})(window);

/**
 * serializeForm
 * Convert form elements to query string or JavaScript object.
 * @param {HTMLFormElement} form: the form to be serialized
 * @param {boolean} usePlusSpaces -
	false: spaces encoded as '%20'
	true: spaces encoded as '+'
 * @param {boolean} asObject -
	false: serialization returned as '&' separated string
	true: serialization returned as an object
 */

(function (window) {
	window.serializeForm = function (form, usePlusSpaces, asObject) {
		'use strict';

		var elements;
		var add = function (name, value) {
			value = encodeURIComponent(value);

			// Apparetly this is helpful - @link https://stackoverflow.com/questions/4276226/ajax-xmlhttprequest-post/
			if (usePlusSpaces) value = value.replace(/%20/g, '+');

			if (asObject) elements[name] = value;
			else elements.push(name + '=' + value);
		};

		if (asObject) elements = {};
		else elements = [];

		var i, len;
		for (i = 0, len = form.elements.length; i < len; ++i) {
			var element = form.elements[i];
			if (i in form.elements) {
				switch (element.nodeName) {
				case 'BUTTON': // Omit these elements
					break;
				default:
					switch (element.type) {
					case 'submit': case 'button': // Omit these input types
						break;
					default:
						add(element.name, element.value);
						break;
					}
					break;
				}
			}
		}

		if (asObject) {
			return elements;
		}

		return elements.join('&');
	};
})(window);

/**
 * whichTransitionEvent
 * crossbroswer transitionEnd event - from Modernizr?
 * @author https://davidwalsh.name/css-animation-callback
 * @example
	var transitionEvent = window.whichTransitionEvent();
	transitionEvent && element.addEventListener(transitionEvent, function() {
		console.log('Transition complete!  This is the callback, no library needed!');
	});
 */

(function (document, window) {
	'use strict';

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

/**
 * Js component boilerplate
 * description
 */

(function (document, window) {
	'use strict';

	/**
     * FLIP!
	 * @link https://aerotwist.com/blog/flip-your-animations/
     */
	function PostExpand_FLIP (e, post) {
		console.dir(this); // for debugging
		this.e = e;
		this.post = post;
		var self = this;

		this.elements = {
			hero: 'cover__hero',
			title: 'cover__titleLink',
			imgList: 'cover__heroImg--list',
			imgBlur: 'cover__heroImg--blur'
		};
		for (var key in this.elements) {
			this[key] = { node: this.post.getElementsByClassName(this.elements[key])[0] };
		}
		this.mutate = function () {
			// mutate node
			this.main = document.getElementsByClassName('mainContent')[0];
			this.mainClone = this.main.cloneNode(true);
			this.postClone = this.post.cloneNode(true);
			this.post.parentNode.insertBefore(this.postClone, this.post.nextSibling); // insert after
			// this.postClone.style.visibility = 'hidden';
			this.mainClone.replaceChild(this.post, this.mainClone.getElementsByClassName('post')[0]);
			this.mainClone.classList.remove('mainContent--active');
			this.post.classList.remove('post--list');

			// apply classes and styles
			this.post.classList.add('post--full');
			document.body.appendChild(this.mainClone);
			document.body.removeChild(this.main);
			document.getElementById('mainNav--opener').checked = false;
			this.mainClone.classList.add('mainContent--active');

			// transform from a blank origin
			this.hero.node.style.transform = this.title.node.style.transform = 'none';

		};
		this.collectRects = function (state) {
			for (var key in this.elements) {
				this[key][state] = this[key].node.getBoundingClientRect();
			}
		};
		this.collectComputedStyles = function (state) {
			for (var key in this.elements) {
				this[key][state] = window.getComputedStyle(this[key].node);
			}
		};
		this.first = function () {
			// collect dimensions of FIRST state
			this.collectRects('rectFirst');
			this.title.lineHeightFirst = window.getComputedStyle(this.title.node).lineHeight;
			// this.collectComputedStyles('styleFirst');
		};
		this.last = function () {
			// collect dimensions of LAST state
			this.mutate();
			this.collectRects('rectLast');
			this.title.lineHeightLast = window.getComputedStyle(this.title.node).lineHeight;
			// this.collectComputedStyles('styleLast');
		};
		this.invert = function () {
			// apply INVERT css to mutate node back to its original state
			// this.hero.node.style.transformOrigin = this.title.node.style.transition = '50% 50%'; // just in case
			this.hero.node.style.transition = this.title.node.style.transition = 'none'; // to break it

			// HERO
			var hero_transform = 'translateZ(0.0001px) ';
			var hero_translateX = (this.hero.rectFirst.left + (this.hero.rectFirst.width / 2)) - (this.hero.rectLast.left + (this.hero.rectLast.width / 2));
			hero_transform += 'translateX(' + hero_translateX + 'px) ';
			var hero_translateY = (this.hero.rectFirst.top + (this.hero.rectFirst.height / 2)) - (this.hero.rectLast.top + (this.hero.rectLast.height / 2));
			hero_transform += 'translateY(' + hero_translateY + 'px) ';
			var hero_scaleX = this.hero.rectFirst.width / this.hero.rectLast.width;
			hero_transform += 'scaleX(' + hero_scaleX + ') ';
			var hero_scaleY = this.hero.rectFirst.height / this.hero.rectLast.height;
			hero_transform += 'scaleY(' + hero_scaleY + ') ';
			this.hero.node.style.transform = hero_transform;

			// TITLE
			var title_width = this.title.rectFirst.width * parseFloat(this.title.lineHeightLast) / parseFloat(this.title.lineHeightFirst);
			// var title_lineCount = Math.round(this.title.rectFirst.height / parseFloat(this.title.lineHeightFirst));
			// var title_heightEstimate = title_lineCount * this.title.rectLast.height;
			var title_transform = 'translateZ(0.0002px) ';
			var title_translateX = (this.title.rectFirst.left + (this.title.rectFirst.width / 2)) - (this.title.rectLast.left + (title_width / 2));
			title_transform += 'translateX(' + title_translateX + 'px) ';
			var title_translateY = this.title.rectFirst.bottom - this.title.rectLast.bottom;
			title_transform += 'translateY(' + title_translateY + 'px) ';
			var title_scale = this.title.rectFirst.width / title_width;
			title_transform += 'scale(' + title_scale + ') ';

			this.title.node.style.width = title_width + 'px';
			this.title.node.style.transform = title_transform;

			// IMG--BLUR TODO: trim this to a single image?
			this.imgList.node.style.opacity = 0;
			this.imgBlur.node.style.opacity = 0.6;

			// this.post.style.opacity = 0.5; // for debugging
		};
		this.playStart = null;
		this.play = function (playStart) {
			// switch on transitions
			this.hero.node.style.transition = this.title.node.style.transition = '';

			// remove INVERT css to PLAY the transitions
			this.hero.node.style.transform = this.title.node.style.transform = '';

			var transitionEvent = window.whichTransitionEvent();
			this.hero.node.addEventListener(transitionEvent, this.cleanup, false);
		};
		this.cleanup = function (e) {
			// use self instead of this
			e.target.removeEventListener(e.type, self.cleanup);
		};
	}

	var postExpand = function (e) {
		e.preventDefault();

		// FLIP animation
		var postExpand = new PostExpand_FLIP(e, this);
		postExpand.first();
		postExpand.last();
		postExpand.invert();
		window.requestNextAnimationFrame(function () {
			postExpand.play();
		});
	};

	var initalize = function () {
		var heroWraps = document.getElementsByClassName('post--postExpandJS');
		for (var i = 0; i < heroWraps.length; i++) {
			var heroWrap = heroWraps[i];
			heroWrap.addEventListener('click', postExpand, true);
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
