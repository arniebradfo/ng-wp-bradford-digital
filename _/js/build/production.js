/**
 * Js component boilerplate
 * description
 */

(function (document, window) {
	// explination

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
			title: 'cover__title'
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

			// apply classes / force synchrynous layout.
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
		this.first = function () {
			// collect dimensions of FIRST state
			this.collectRects('rectFirst');
		};
		this.last = function () {
			// collect dimensions of LAST state
			this.mutate();
			this.collectRects('rectLast');
		};
		this.invert = function () {
			// apply INVERT css to mutate node back to its original state
			var transform = 'translateZ(0) ';
			var offsetX = (this.hero.rectFirst.left + (this.hero.rectFirst.width / 2)) - (this.hero.rectLast.left + (this.hero.rectLast.width / 2));
			transform += 'translateX(' + offsetX + 'px) ';
			var offsetY = (this.hero.rectFirst.top + (this.hero.rectFirst.height / 2)) - (this.hero.rectLast.top + (this.hero.rectLast.height / 2));
			transform += 'translateY(' + offsetY + 'px) ';
			var scaleX = this.hero.rectFirst.width / (this.hero.rectLast.width);
			transform += 'scaleX(' + scaleX + ') ';
			var scaleY = this.hero.rectFirst.height / this.hero.rectLast.height;
			transform += 'scaleY(' + scaleY + ') ';
			this.hero.node.style.transform = transform;
			// this.hero.node.style.transformOrigin = '50% 50%'; // just in case
			this.hero.node.style.transition = 'color'; // to break it
		};
		this.play = function () {
			// switch on transitions
			this.hero.node.style.transition = '';
			// remove INVERT css to PLAY the transitions
			this.hero.node.style.transform = '';
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
		window.requestAnimationFrame(function () {
			postExpand.play();
		});

		// console.log(postExpand);
		// var windowBox = {
		// 	height: window.innerHeight,
		// 	width: window.innerWidth
		// };
		// var scaleY = windowBox.height / rect.height;
		// var scaleX = windowBox.width / rect.width;
		// var translateX = (windowBox.width / 2) - (rect.left + rect.width / 2);
		// var translateY = (windowBox.height / 2) - (rect.top + rect.height / 2);
		// this.getElementsByClassName('postItem__heroTranslate')[0].style.transform = 'translate(' + translateX + 'px,' + translateY + 'px) scale(' + scaleX + ',' + scaleY + ')';
		// this.getElementsByClassName('postItem__heroImg--focus')[0].style.opacity = '0';
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
