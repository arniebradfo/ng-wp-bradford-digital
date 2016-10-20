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
 * animateMutate
 * Mutate the DOM and animate the change
 * Animate with FLIP - First, Last, Invert, play
 * @link https://aerotwist.com/blog/flip-your-animations/
 * @param {Object} elements - list of classes to find in the context
 * @param {String} elements.reference - the class-name of an element in the context
 * @param {Array} elements.reference - the class-name of an element in the context, and weather to collect its computed style
 * @param {String} elements.reference[0] - the class-name of an element in the context
 * @param {Boolean} elements.reference[1] - weather to collect its computed style
	elements = {
		reference: 'class-name' // just a string
		referenceTwo: ['class-name', true] // array
	}
 * @param {Node} context - the context to search for the elements in - document by default
 */

(function (document, window) {
	window.AnimateMutate = function (elements, context) {
		'use strict';
		// console.dir(this); // for debugging
		var self = this;

		// Placeholders // set these after the constructor is called
		this.mutate = null;       // {Function} - mutate the DOM into its next state
		this.invert = null;       // {Function} - add inverted css and remove transitions
		this.play = null;         // {Function} - remove inverted css and add transitions
		this.cleanUp = null;      // {Function} - what to do after the animation is done
		this.cleanUpAfter = null; // {Element}  - element to attach the transitionEnd listner to

		this.readyState = 0;
		this.readyStateMax = 6; // how high the readyState increments
		this.complete = function () {
			return this.readyStateMax <= this.readyState;
		};

		this.el = { context: {} }; // TODO: change this.el to this.elements later ?
		this.el.context.node = context || document; // right order?
		for (var key in elements) { // create an object of element nodes
			this.el[key] = {};
			if (typeof elements[key] === 'string') {
				this.el[key].node = this.el.context.node.getElementsByClassName(elements[key])[0];
			} else if (typeof elements[key] === 'object') { // array with needCompStyle
				this.el[key].node = this.el.context.node.getElementsByClassName(elements[key][0])[0];
				this.el[key].needCompStyle = elements[key][1];
			}
		}

		this.copyComputedStyle = function (CSSStyleDeclaration) { // copies the properties of a CSSStyleDeclaration
			var copy = {};
			for (var property in CSSStyleDeclaration) {
				if (!(parseInt(property) || typeof CSSStyleDeclaration[property] === 'function')) copy[property] = CSSStyleDeclaration[property];
			}
			return copy;
		};

		this.collect = function () { // Collect the first and last readyState of the elements
			var _state = this.collect.once ? 'last' : 'first';
			this.collect.once = true;
			for (var key in this.el) {
				var x = this.el[key];
				x[_state] = {};
				x[_state].rect = x.node.getBoundingClientRect();
				// x[_state].compStyle = window.getComputedStyle(x.node);
				if (x.needCompStyle) x[_state].compStyle = this.copyComputedStyle(window.getComputedStyle(x.node));
			}
		};

		this.cleanUpWrapper = function (e) {
			self.readyState++; // 6
			e.target.removeEventListener(e.type, self.cleanUp);
			self.cleanUp();
		};

		this.animate = function () { // execute
			if (!(this.mutate && this.invert && this.play)) return; // throw error
			this.collect(); // FIRST
			this.readyState++; // 1
			this.mutate();
			this.readyState++; // 2
			this.collect(); // LAST
			this.readyState++; // 3
			this.invert(); // INVERT
			this.readyState++; // 4
			window.requestNextAnimationFrame(function () { // wait for the next frame
				self.play(); // PLAY
				self.readyState++; // 5
				if (self.cleanUpAfter && self.cleanUp) {
					var transitionEnd = window.whichTransitionEvent();
					self.cleanUpAfter.addEventListener(transitionEnd, self.cleanUpWrapper, false);
				} else {
					self.readyState++; // 6
				}
			});
		};
	};
})(document, window);

/**
 * progress
 * track the progress of an xhr request
 * @param {Array} trackedStatesList - a [key,value] pair of readyStates to track and their maximum index
 * @param {function} readyState - reference to a function that returns the value of a readyState
 * @param {int} readyStateMax - a maximum index that readyState will get to
	readyStates = [
		[readyState, readyStateMax],
		[readyStateTwo, readyStateTwoMax]
	]
 * @param {function} callback
 */

(function (document, window) {
	window.Progress = function (trackedStatesList, callback) {
		'use strict';
		// console.dir(this); // for debugging
		var self = this;

		this.trackedStates = {};
		this.trackedStates.list = trackedStatesList;
		this.trackedStates.total = (function () {
			var _total = 0;
			for (var i = 0; i < self.trackedStates.list.length; i++) {
				_total += self.trackedStates.list[i][1];
			}
			return _total;
		})();
		this.trackedStates.current = function () {
			var _current = 0;
			for (var i = 0; i < this.list.length; i++) {
				_current += this.list[i][0];
			}
			return _current;
		};
		this.trackedStates.previous = 0;
		this.trackedStates.complete = function () {
			for (var i = 0; i < this.list.length; i++) {
				if (this.list[i][0]() < this.list[i][1]) {
					return false;
				}
			}
			return true;
		};

		this.readyState = 0; // progress between 0 and 1
		this.readyStateMax = 1; // how high the readyState increments
		this.complete = function () {
			return this.readyStateMax <= this.readyState;
		};
		this.params = {
			reserved: this.readyStateMax * 0.1,
			coefficient: (1 / 100)
		};

		this.update = null; // {Function} - uses readyState to animate ui feedback
		this.callback = callback; // {Function} - call back for when update completes

		this.forward = function () { // update the progress element
			if (self.complete()) {
				self.callback();
				return;
			}
			window.requestAnimationFrame(self.forward);
			// console.log(self.trackedStates.complete());
			if (self.trackedStates.complete()) {
				self.readyState = self.readyStateMax;
			} else {
				// increase by a fraction of the remaining reserved
				var _remaining = self.readyStateMax - self.readyState;
				if (self.trackedStates.current() > self.trackedStates.previous) {
					var _difference = self.trackedStates.current() - self.trackedStates.previous;
					var _thing = self.trackedStates.total - self.trackedStates.previous;
					self.readyState += (_difference / _thing) * _remaining;
					self.trackedStates.previous = self.trackedStates.current();
				} else {
					self.readyState += self.params.coefficient * _remaining;
				}
			}
			self.update();
		};
		this.start = this.forward;
	};
})(document, window);

/**
 * RequestImg
 * mutate an image from one src to another, and attach an callback
 * requires the image to have data-<attribute> attributes to be converted
 * works with wpajax_encode_data_atts() .php function
 * @param {HTMLImageElement} img - the image we want to change the attributes of
 * @param {function} callback
 */

(function (document, window) {
	window.RequestImg = function (img, callback) {
		'use strict';
		// console.dir(this); // for debugging
		var self = this;

		this.img = img;
		this.callback = callback;

		this.readyState = function () {
			return (self.img.complete && self.attsMutated) ? 1 : 0;
		};
		this.readyStateMax = 1; // how high the readyState increments
		this.complete = function () {
			return self.readyStateMax <= self.readyState();
		};

		this.attsMutated = false;
		this.mutateAtts = function () { // edit the img src and attach onload
			this.img.onload = this.callback;
			for (var att in this.img.dataset) {
				this.img.setAttribute(att, this.img.dataset[att]);
				this.img.removeAttribute('data-' + att);
			}
			this.attsMutated = true;
		};
	};
})(document, window);

/**
 * Js component boilerplate
 * description
 */

(function (document, window) {
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

		var parent = e.target;
		while (true) {
			if (parent.tagName === 'BODY') return; // not a link
			if (parent.tagName === 'A' || parent.tagName === 'AREA') break;
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

			var types = {
				// a list of animation types and their corrosponding css class identifiers
				postExpand: 'post--postExpandJS'
			};

			var context = link;
			while (true) {
				if (context.tagName === 'BODY') {
					// window[type](e, parent, link.href);
					return;
				}
				for (var type in types) {
					if (context.classList.contains(types[type])) {
						window.history.pushState({
							type: type
						}, '', link.href);
						window[type](e, context, link.href);
						return;
					}
				}
				context = context.parentElement;
			}
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

/**
 * Js component boilerplate
 * description
 */

(function (document, window) {
	'use strict';

	window.postExpand = function (e, context, href) {
		// console.dir(this); // for debugging

		// SET TYPE
		href = window.addAjaxQueryString(href, 'getpage');

		// FLIP ANIMATION SETUP
		var postExpandFLIP = new window.AnimateMutate({
			hero: 'cover__hero',
			title: ['cover__titleLink', true],
			imgList: 'cover__heroImg--list',
			imgBlur: 'cover__heroImg--blur',
			loadBar: 'button'
		}, context);

		var post = postExpandFLIP.el.context;
		var hero = postExpandFLIP.el.hero;
		var title = postExpandFLIP.el.title;
		var imgList = postExpandFLIP.el.imgList;
		var loadBar = postExpandFLIP.el.loadBar;
		var loader = loadBar.node.getElementsByClassName('button__loadbar')[0];

		postExpandFLIP.mutate = function () {
			// mutate node
			var main = document.getElementsByClassName('mainContent')[0];
			var mainClone = main.cloneNode(true);
			var postClone = post.node.cloneNode(true);
			post.node.parentNode.insertBefore(postClone, post.node.nextSibling); // insert after
			// this.postClone.style.visibility = 'hidden';
			mainClone.replaceChild(post.node, mainClone.getElementsByClassName('postItem')[0]);
			mainClone.classList.remove('mainContent--active');
			post.node.classList.remove('post--list');

			// apply classes and styles
			post.node.classList.add('post--full');
			document.body.appendChild(mainClone);
			document.body.removeChild(main);
			document.getElementById('mainNav--opener').checked = false;
			mainClone.classList.add('mainContent--active');

			// collect rects without transform
			hero.node.style.transform = title.node.style.transform = loadBar.node.style.transition = 'none';
		};

		postExpandFLIP.invert = function () {
			// apply INVERT css to mutate node back to its original state

			// hero.node.style.transformOrigin = title.node.style.transition = loadBar.node.style.transition = '50% 50%'; // just in case
			hero.node.style.transition = title.node.style.transition = loadBar.node.style.transition = 'none'; // to break it

			// HERO
			var hero_translateX = (hero.first.rect.left + (hero.first.rect.width / 2)) - (hero.last.rect.left + (hero.last.rect.width / 2));
			var hero_translateY = (hero.first.rect.top + (hero.first.rect.height / 2)) - (hero.last.rect.top + (hero.last.rect.height / 2));
			var hero_scaleX = hero.first.rect.width / hero.last.rect.width;
			var hero_scaleY = hero.first.rect.height / hero.last.rect.height;
			var hero_transform = 'translateZ(0.0001px) ';
			hero_transform += 'translateX(' + hero_translateX + 'px) ';
			hero_transform += 'translateY(' + hero_translateY + 'px) ';
			hero_transform += 'scaleX(' + hero_scaleX + ') ';
			hero_transform += 'scaleY(' + hero_scaleY + ') ';
			hero.node.style.transform = hero_transform;

			// TITLE
			var title_width = title.first.rect.width * parseFloat(title.last.compStyle.lineHeight) / parseFloat(title.first.compStyle.lineHeight);
			// var title_lineCount = Math.round(title.first.rect.height / parseFloat(title.first.compStyle.lineHeight));
			// var title_heightEstimate = title_lineCount * title.last.rect.height;
			var title_transform = 'translateZ(0.0002px) ';
			var title_translateX = (title.first.rect.left + (title.first.rect.width / 2)) - (title.last.rect.left + (title_width / 2));
			title_transform += 'translateX(' + title_translateX + 'px) ';
			var title_translateY = title.first.rect.bottom - title.last.rect.bottom;
			title_transform += 'translateY(' + title_translateY + 'px) ';
			var title_scale = title.first.rect.width / title_width;
			title_transform += 'scale(' + title_scale + ') ';
			title.node.style.width = title_width + 'px';
			title.node.style.transform = title_transform;

			// LOADBAR
			var loadBar_translateX = loadBar.first.rect.left - loadBar.last.rect.left;
			var loadBar_translateY = loadBar.first.rect.top - loadBar.last.rect.top;
			loadBar.node.style.transform = 'translateZ(0.0001px) translateX(' + loadBar_translateX + 'px) translateY(' + loadBar_translateY + 'px)';

			// IMG--BLUR TODO: trim this to a single image?
			this.el.imgList.node.style.opacity = 0;
			this.el.imgBlur.node.style.opacity = 0.6;

			// post.node.style.opacity = 0.5; // for debugging
		};

		postExpandFLIP.play = function () {
			// switch on transitions
			hero.node.style.transition = title.node.style.transition = loadBar.node.style.transition = '';
			// remove INVERT css to PLAY the transitions
			hero.node.style.transform = title.node.style.transform = loadBar.node.style.transform = '';
		};

		postExpandFLIP.cleanUpAfter = hero.node;
		// postExpandFLIP.cleanUp = function () {};

		// IMAGE LOADING
		var requestFullImg = new window.RequestImg(imgList.node); // can take a callback

		// AJAX REQUEST
		var xhr = new window.XMLHttpRequest();
		xhr.open('GET', href, true);
		// console.dir(xhr); // for debugging
		xhr.timeout = 5000;
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // ALWAYS set this!
		xhr.setRequestHeader('WP-Request-Type', 'GetPage');
		xhr.onload = function () {
			var workspace = document.createElement('div');
			workspace.innerHTML = xhr.responseText;
			console.log(workspace); // for debugging
			post.node.getElementsByClassName('excerpt')[0].innerHTML = '';
			post.node.getElementsByClassName('frame')[0].innerHTML = workspace.getElementsByClassName('frame')[0].innerHTML;
		};

		// WHEN EVERYTHING IS DONE
		var onFinish = function () {
			imgList.node.style.transition = postExpandFLIP.el.imgBlur.node.style.transition = 'opacity .5s linear';
			window.requestAnimationFrame(function () {
				imgList.node.style.opacity = postExpandFLIP.el.imgBlur.node.style.opacity = '';
			});
		};

		// PROGRESS ELEMENT
		var xhrReadyState = function () {
			return xhr.readyState;
		};
		var trackedStatesList = [
			[xhrReadyState, 4],
			[requestFullImg.readyState, requestFullImg.readyStateMax]
		];
		var postExpandLoader = new window.Progress(trackedStatesList, onFinish);
		postExpandLoader.update = function () {
			loader.style.transform = 'scaleX(' + this.readyState + ')';
		};

		// DO!
		xhr.send();
		postExpandFLIP.animate();
		postExpandLoader.start();
		requestFullImg.mutateAtts();
	};
})(document, window);
