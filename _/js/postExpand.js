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

		this.elements = {
			hero: 'cover__hero',
			title: 'cover__title'
		};
		for (var key in this.elements) {
			this[key] = { node: this.post.getElementsByClassName(this.elements[key])[0] };
		}
		this.mutate = function () {
			// mutate node
			var main = document.getElementsByClassName('mainContent')[0];
			var mainClone = main.cloneNode(true);
			// var postClone = post.cloneNode(true);
			mainClone.replaceChild(this.post, mainClone.getElementsByClassName('post')[0]);
			mainClone.classList.remove('mainContent--active');
			this.post.classList.remove('post--list');

			// apply classes / force synchrynous layout.
			this.post.classList.add('post--full');
			document.body.appendChild(mainClone);
			document.body.removeChild(main);
			document.getElementById('mainNav--opener').checked = false;
			mainClone.classList.add('mainContent--active');
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
			this.collectRects('rectLast');
		};
		this.invert = function () {
			// apply INVERT css to mutate node back to its original state
		};
		this.play = function () {
			// switch on transitions
			// remove INVERT css to PLAY the transitions
		};
	}

	var postExpand = function (e) {
		e.preventDefault();

		var post = this;
		var postExpand = new PostExpand_FLIP(e, post);

		postExpand.first();

		postExpand.mutate();

		postExpand.last();

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
