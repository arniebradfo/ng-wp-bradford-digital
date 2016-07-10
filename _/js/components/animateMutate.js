/**
 * animateMutate
 * Mutate the DOM and animate the change
 * Animate with FLIP - First, Last, Invert, play
 * @link https://aerotwist.com/blog/flip-your-animations/
 * @param {Object} elements - list of classes to find in the context
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

		this.el = { context: {} };
		this.el.context.node = context || document; // right order?
		for (var key in elements) { // create an object of element nodes
			this.el[key] = {};
			this.el[key].node = this.el.context.node.getElementsByClassName(elements[key])[0];
		}

		this.collect = function () { // Collect the first and last state of the elements
			var state = this.collectedFirst ? 'last' : 'first';
			this.collectedFirst = true;
			for (var key in this.el) {
				this.el[key][state] = {};
				this.el[key][state].rect = this.el[key].node.getBoundingClientRect();
				this.el[key][state].compStyle = window.getComputedStyle(this.el[key].node);
			}
		};

		this.cleanUpWrapper = function (e) {
			self.cleanup();
			self.state++; // 6
			e.target.removeEventListener(e.type, self.cleanUp);
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
				if (self.cleanupAfter && self.cleanup) {
					var transitionEnd = window.whichTransitionEvent();
					self.cleanupAfter.addEventListener(transitionEnd, self.cleanUpWrapper, false);
				} else {
					self.state++; // 6
				}
			});
		};
	};
})(document, window);
