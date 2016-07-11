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
			self.cleanUp();
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
				if (self.cleanUpAfter && self.cleanUp) {
					var transitionEnd = window.whichTransitionEvent();
					self.cleanUpAfter.addEventListener(transitionEnd, self.cleanUpWrapper, false);
				} else {
					self.state++; // 6
				}
			});
		};
	};
})(document, window);
