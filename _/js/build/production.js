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
			// this.collectComputedStyles('styleFirst');
		};
		this.last = function () {
			// collect dimensions of LAST state
			this.mutate();
			this.collectRects('rectLast');
			// this.collectComputedStyles('styleLast');
		};
		this.invert = function () {
			// apply INVERT css to mutate node back to its original state

			// HERO
			var hero_transform = 'translateZ(0) ';
			var hero_translateX = (this.hero.rectFirst.left + (this.hero.rectFirst.width / 2)) - (this.hero.rectLast.left + (this.hero.rectLast.width / 2));
			hero_transform += 'translateX(' + hero_translateX + 'px) ';
			var hero_translateY = (this.hero.rectFirst.top + (this.hero.rectFirst.height / 2)) - (this.hero.rectLast.top + (this.hero.rectLast.height / 2));
			hero_transform += 'translateY(' + hero_translateY + 'px) ';
			var hero_scaleX = this.hero.rectFirst.width / this.hero.rectLast.width;
			hero_transform += 'scaleX(' + hero_scaleX + ') ';
			var hero_scaleY = this.hero.rectFirst.height / this.hero.rectLast.height;
			hero_transform += 'scaleY(' + hero_scaleY + ') ';
			this.hero.node.style.transform = hero_transform;
			this.hero.node.style.transformOrigin = '50% 50%'; // just in case
			this.hero.node.style.transition = 'none'; // to break it

			// TITLE
			this.title.node.style.transformOrigin = '0 0';
			var title_transform = 'translateZ(0) ';
			var title_translateX = this.title.rectFirst.left - this.title.rectLast.left;
			title_transform += 'translateX(' + title_translateX + 'px) ';
			var title_translateY = this.title.rectFirst.top - this.title.rectLast.top;
			title_transform += 'translateY(' + title_translateY + 'px) ';
			var title_scale = this.title.rectFirst.height / this.title.rectLast.height;
			title_transform += 'scale(' + title_scale + ') ';
			// TODO: count lines
			// var title_lineCountFirst = Math.round(parseFloat(this.title.styleFirst.height) / parseFloat(this.title.styleFirst.lineHeight));
			// var title_lineCountLast = Math.round(parseFloat(this.title.styleLast.height) / parseFloat(this.title.styleLast.lineHeight));
			// console.log(title_lineCountFirst);
			// console.log(title_lineCountLast);
			// if (title_lineCountFirst !== title_lineCountLast) { }
			this.title.node.style.transform = title_transform;
			this.title.node.style.transition = 'none'; // to break it

			// IMG--BLUR TODO: trim this to a single image?
			this.imgList.node.style.opacity = 0;
			this.imgBlur.node.style.opacity = 0.6;

			// this.post.style.opacity = 0.5; // for debugging
		};
		this.playStart = null;
		this.play = function (playStart) {
			// switch on transitions
			this.hero.node.style.transition = '';
			this.title.node.style.transition = '';

			// remove INVERT css to PLAY the transitions
			this.hero.node.style.transform = '';
			this.title.node.style.transform = '';

			var transitionEvent = window.whichTransitionEvent();
			this.hero.node.addEventListener(transitionEvent, this.cleanup, false);
		};
		this.cleanup = function (e) {
			// use self
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
 * whichTransitionEvent
 * crossbroswer transitionEnd event
 * @link https://davidwalsh.name/css-animation-callback
 */

// usage: //
// var transitionEvent = window.whichTransitionEvent();
// transitionEvent && element.addEventListener(transitionEvent, function() {
// 	console.log('Transition complete!  This is the callback, no library needed!');
// });

(function (window) {
	window.requestNextAnimationFrame = function (func) {
		var self = this;

		// throw error if parameter is not function
		if (typeof func === 'function') this.func = func;
		else throw 'requestNextAnimationFrame() requires a function as its sole parameter';

		this.queueTime = null;
		this.testAnimationFrame = function () {
			window.requestAnimationFrame(function (timestamp) {
				if (!self.queueTime) self.queueTime = timestamp;

				// if this is called in the same frame as it was queued, try again.
				if (self.queueTime === timestamp) {
					this.testAnimationFrame();
					return;
				}

				self.func();
			});
		};

		return this.testAnimationFrame();
	};
})(window);

/**
 * whichTransitionEvent
 * crossbroswer transitionEnd event
 * @link https://davidwalsh.name/css-animation-callback
 */

// usage: //
// var transitionEvent = window.whichTransitionEvent();
// transitionEvent && element.addEventListener(transitionEvent, function() {
// 	console.log('Transition complete!  This is the callback, no library needed!');
// });

(function (document, window) {
	/* From Modernizr */
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
