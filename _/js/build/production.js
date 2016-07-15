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
		reference: ['class-name', true] // array
	}
 * @param {Node} context - the context to search for the elements in - document by default
 */

(function (document, window) {
	window.AnimateMutate = function (elements, context) {
		'use strict';
		console.dir(this); // for debugging
		var self = this;

		// Placeholders // set these after the constructor is called
		this.mutate = null;       // {Function} - mutate the DOM into its next state
		this.invert = null;       // {Function} - add inverted css and remove transitions
		this.play = null;         // {Function} - remove inverted css and add transitions
		this.cleanUp = null;      // {Function} - what to do after the animation is done
		this.cleanUpAfter = null; // {Element}  - element to attach the transitionEnd listner to

		this.state = 0;
		this.complete = false;

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

		this.collect = function () { // Collect the first and last state of the elements
			var state = this.collect.once ? 'last' : 'first';
			this.collect.once = true;
			for (var key in this.el) {
				var x = this.el[key];
				x[state] = {};
				x[state].rect = x.node.getBoundingClientRect();
				// x[state].compStyle = window.getComputedStyle(x.node);
				if (x.needCompStyle) x[state].compStyle = this.copyComputedStyle(window.getComputedStyle(x.node));
			}
		};

		this.cleanUpWrapper = function (e) {
			self.state++; // 6
			self.complete = true;
			e.target.removeEventListener(e.type, self.cleanUp);
			self.cleanUp();
		};

		this.animate = function () { // execute
			if (!(this.mutate && this.invert && this.play)) return; // throw error
			this.collect(); // FIRST
			this.state++; // 1
			this.mutate();
			this.state++; // 2
			this.collect(); // LAST
			this.state++; // 3
			this.invert(); // INVERT
			this.state++; // 4
			window.requestNextAnimationFrame(function () { // wait for the next frame
				self.play(); // PLAY
				self.state++; // 5
				if (self.cleanUpAfter && self.cleanUp) {
					var transitionEnd = window.whichTransitionEvent();
					self.cleanUpAfter.addEventListener(transitionEnd, self.cleanUpWrapper, false);
				} else {
					self.state++; // 6
					self.complete = true;
				}
			});
		};
	};
})(document, window);

/**
 * progress
 * track the progress of an xhr request
 */

(function (document, window) {
	window.Progress = function () {
		'use strict';
		console.dir(this); // for debugging
		var self = this;

		this.state = 0; // progress between 0 and 1
		this.forward = function (amount) { // update the progress element

		};
		this.update = null; // {Function} - uses state to animate ui feedback
		this.complete = null; // {Function} - call back for when update completes
	};
})(document, window);

/**
 * RequestImg
 * mutate an image from one source to another, and animate
 */

(function (document, window) {
	window.RequestImg = function (img, callback) {
		'use strict';
		console.dir(this); // for debugging
		this.img = img;
		this.callback = callback;

		this.mutateAtts = function () { // edit the img src and attach onload
			this.img.onload = this.callback();
			for (var att in this.img.dataset) {
				this.img.setAttribute(att, this.img.dataset[att]);
				this.img.removeAttribute('data-' + att);
			}
		};
	};
})(document, window);

/**
 * Js component boilerplate
 * description
 */

(function (document, window) {
	'use strict';

	var postExpand = function (e) {
		e.preventDefault();

		// TODO: move this to click binding
		var href;
		var parent = e.target;
		while (true) {
			if (parent.href) {
				href = parent.href;
				break;
			}
			parent = parent.parentElement;
		}

		var postExpandFLIP = new window.AnimateMutate({
			hero: 'cover__hero',
			title: ['cover__titleLink', true],
			imgList: 'cover__heroImg--list',
			imgBlur: 'cover__heroImg--blur'
		}, this);

		var post = postExpandFLIP.el.context;
		var hero = postExpandFLIP.el.hero;
		var title = postExpandFLIP.el.title;
		var imgList = postExpandFLIP.el.imgList;

		var onFinish = function () {
			if (requestFullImg.img.complete && postExpandFLIP.complete) {
				imgList.node.style.transition = postExpandFLIP.el.imgBlur.node.style.transition = 'opacity .5s linear';
				window.requestAnimationFrame(function () {
					imgList.node.style.opacity = postExpandFLIP.el.imgBlur.node.style.opacity = '';
				});
			}
		};

		postExpandFLIP.mutate = function () {
			// mutate node
			var main = document.getElementsByClassName('mainContent')[0];
			var mainClone = main.cloneNode(true);
			var postClone = post.node.cloneNode(true);
			post.node.parentNode.insertBefore(postClone, post.node.nextSibling); // insert after
			// this.postClone.style.visibility = 'hidden';
			mainClone.replaceChild(post.node, mainClone.getElementsByClassName('post')[0]);
			mainClone.classList.remove('mainContent--active');
			post.node.classList.remove('post--list');

			// apply classes and styles
			post.node.classList.add('post--full');
			document.body.appendChild(mainClone);
			document.body.removeChild(main);
			document.getElementById('mainNav--opener').checked = false;
			mainClone.classList.add('mainContent--active');

			// collect rects without transform
			hero.node.style.transform = title.node.style.transform = 'none';
		};
		postExpandFLIP.invert = function () {
			// apply INVERT css to mutate node back to its original state

			// hero.node.style.transformOrigin = title.node.style.transition = '50% 50%'; // just in case
			hero.node.style.transition = title.node.style.transition = 'none'; // to break it

			// HERO
			var hero_transform = 'translateZ(0.0001px) ';
			var hero_translateX = (hero.first.rect.left + (hero.first.rect.width / 2)) - (hero.last.rect.left + (hero.last.rect.width / 2));
			hero_transform += 'translateX(' + hero_translateX + 'px) ';
			var hero_translateY = (hero.first.rect.top + (hero.first.rect.height / 2)) - (hero.last.rect.top + (hero.last.rect.height / 2));
			hero_transform += 'translateY(' + hero_translateY + 'px) ';
			var hero_scaleX = hero.first.rect.width / hero.last.rect.width;
			hero_transform += 'scaleX(' + hero_scaleX + ') ';
			var hero_scaleY = hero.first.rect.height / hero.last.rect.height;
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

			// IMG--BLUR TODO: trim this to a single image?
			this.el.imgList.node.style.opacity = 0;
			this.el.imgBlur.node.style.opacity = 0.6;

			// post.node.style.opacity = 0.5; // for debugging
		};
		postExpandFLIP.play = function () {
			// switch on transitions
			hero.node.style.transition = title.node.style.transition = '';
			// remove INVERT css to PLAY the transitions
			hero.node.style.transform = title.node.style.transform = '';
		};
		postExpandFLIP.cleanUp = function () {
			onFinish();
		};
		postExpandFLIP.cleanUpAfter = hero.node;

		var requestFullImg = new window.RequestImg(imgList.node, onFinish);

		var xhr = new window.XMLHttpRequest();
		xhr.open('GET', href, true);
		console.dir(xhr);
		xhr.timeout = 5000;
		xhr.setRequestHeader('WP-Request-Type', 'GetPage');
		xhr.onload = function () {
			console.log(xhr.responseText);
		};
		xhr.send();

		postExpandFLIP.animate();
		requestFullImg.mutateAtts();
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
