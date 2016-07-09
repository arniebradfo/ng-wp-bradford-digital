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

// finds the WP comment entry section and adds a ctrl/cmd + enter lister
function attachCtrlEnterSubmitWPComment () {
	var commentArea = document.getElementById('comment');
	if (commentArea) {
		window.addEvent(commentArea, 'keydown', function (e) {
			if ((e.ctrlKey || e.metaKey) && (e.keyCode === 13 || e.keyCode === 10)) {
				document.getElementById('submit').click();
			}
		});
	}
}

var wpajax_options = { // things that might change
	contentSelector: '#content',
	adminUrlRegEx: '\/wp-',
	ajaxClass: 'added-by-wpajax'
};

(function (document, window, opts) {
	var wpajax = {
		load: function (obj) {
			var xhttp = new window.XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				switch (xhttp.readyState) {
				case 0:
					break; // this is the case when the constructor is called
				case 1:
					if (typeof obj.connected === 'function') {
						obj.connected();
					}
					break;
				case 2:
					if (typeof obj.requested === 'function') {
						obj.requested();
					}
					break;
				case 3:
					if (typeof obj.processing === 'function') {
						obj.processing();
					}
					break;
				case 4:
					if (xhttp.status >= 200 && xhttp.status < 300) {
						if (typeof obj.delivered === 'function') {
							obj.delivered(xhttp.responseText, xhttp.statusText);
						}
					} else {
						if (typeof obj.failed === 'function') {
							obj.failed(obj.href, xhttp.status, xhttp.statusText);
						}
					}
					break;

				}
			};
			xhttp.timeout = typeof obj.timeoutTimer === 'number' ? obj.timeoutTimer : 0; // (in milliseconds) Set the amout of time until the ajax request times out.
			if (typeof obj.started === 'function') {
				window.addEvent(xhttp, 'loadstart', function () {
					obj.started();
				});
			}
			if (typeof obj.aborted === 'function') {
				window.addEvent(xhttp, 'abort', function () {
					obj.aborted(obj.href);
				});
				window.addEvent(xhttp, 'timeout', function () {
					obj.aborted(obj.href, xhttp.timeout);
				});
			}
			if (typeof obj.finished === 'function') {
				window.addEvent(xhttp, 'loadend', function () {
					obj.finished();
				});
			}

			var httpMethod = typeof obj.httpMethod === 'string' ? obj.httpMethod.toUpperCase() : 'GET';
			// console.log('httpMethod: '+httpMethod);
			if (httpMethod === 'GET' ||
				httpMethod === 'POST' ||
				httpMethod === 'PUT') {
				xhttp.open(httpMethod, obj.href, true);
			} else {
				return false;
			}

			if (typeof obj.requestHeaders === 'object') {
				var i, len;
				for (i = 0, len = obj.requestHeaders.length; i < len; ++i) {
					var el = obj.requestHeaders[i];
					xhttp.setRequestHeader(el.header, el.value);
				}
			}

			xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			if (typeof obj.data === 'string') {
				xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xhttp.send(obj.data);
			} else {
				xhttp.send();
			}

			return true;
		},
		replaceNavLinks: function (newPosts, oldPosts) {
			if (!newPosts || !oldPosts) {
				return false;
			}
			var i, len;
			for (i = 0, len = oldPosts.length; i < len; ++i) {
				var el = oldPosts[i];
				el.classList.add(opts.ajaxClass);
				if (newPosts.firstElementChild.href) {
					el.firstElementChild.href = newPosts.firstElementChild.href;
				} else {
					el.firstElementChild.removeAttribute('href');
				}
			}
			return true;
		},
		replaceNavPageLinks: function (newList, oldList) {
			if (!newList || !oldList) {
				return false;
			}
			// TODO: dynamiclly replace each link? - don't know how I would do this?
			var i, len;
			for (i = 0, len = oldList.length; i < len; ++i) {
				var el = oldList[i];
				el.classList.add(opts.ajaxClass);
				el.innerHTML = newList.innerHTML;
			}
			return true;
		},
		updateLinkTag: function (rel, workspace) {
			if (document.head.querySelector('link[rel="' + rel + '"]')) {
				if (workspace.querySelector('link[rel="' + rel + '"]')) {
					// replace link href
					document.head.querySelector('link[rel="' + rel + '"]').href = workspace.querySelector('link[rel="' + rel + '"]').href;
				} else {
					// remove link
					document.head.querySelector('link[rel="' + rel + '"]').remove();
				}
			}
		},
		attachPageLoad: function () { // adds pjax to all internal hyperlink elements (https://rosspenman.com/pushstate-jquery/)
			var self = this;

			// calls loadPage when the browser back button is pressed
			// TODO: test browser implementation inconsistencies of popstate
			window.addEvent(window, 'popstate', function (event) {
				// don't fire on the inital page load
				// TODO: make back button paginates comments??
				if (event.state !== null) {
					var optionsSurrogate = wpajax_GETPage;
					optionsSurrogate.href = window.location.href;
					self.load(optionsSurrogate);
				}
			});

			// transforms all the interal hyperlinks into ajax requests
			window.addEvent(document, 'click', function (event) {
				var e = window.event || event; // http://stackoverflow.com/questions/3493033/what-is-the-meaning-of-this-var-evt-eventwindow-event
				// var e = event != 'undefined' ? event : window.event; // this seems more safe...

				if (e.target.tagName !== 'A' && e.target.tagName !== 'AREA') {
					return false; // if the click event was not on a linked element
				}
				if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
					return false; // if the click was a cmd/ctrl/alt/shift click
				}
				if (!e.target.href) {
					return false; // if the link has no destination
				}

				var href = e.target.href;

				if (href === window.location.href) { // if the page is exactly the same page
					console.log("you're already on that page");
					e.preventDefault();
					return false;
				}

				var currentPageWithParameters = new RegExp(window.location.origin + window.location.pathname + '[^\/]*[&#?]', 'g');
				var adminUrl = new RegExp(opts.adminUrlRegEx, 'g');

				if ((href.indexOf(document.domain) > -1 || href.indexOf(':') === -1) && // if the link goes to the current domain
					!href.match(currentPageWithParameters) && // href isnt a parameterized link of the current page
					// href != window.location.href && // href isn't a link to the current page - we already check for this above
					!href.match(adminUrl) && // href doesn't go to the wp-admin backend
					!href.match(/\/feed/g)) { // is not an rss feed of somekind
					e.preventDefault();
					window.history.pushState({}, '', href);
					// if the link is in the comment-navigation
					var commentNav = document.querySelectorAll('.comment-navigation');
					var isCommentNav = false;
					for (var i = 0, len = commentNav.length; i < len; ++i) {
						if (commentNav[i].contains(e.target)) {
							isCommentNav = true;
						}
					}
					// if the link is in the comment-navigation
					var postNav = document.querySelectorAll('.post-navigation');
					var isPostNav = false;
					for (var j = 0, leng = postNav.length; j < leng; ++j) {
						if (postNav[j].contains(e.target)) {
							isPostNav = true;
						}
					}
					// if (e.target.parentNode.parentNode.className.match(/\bcomment-navigation\b/g)){
					var optionsSurrogate;
					if (isPostNav) {
						optionsSurrogate = wpajax_GETPosts;
						optionsSurrogate.href = href;
						self.load(optionsSurrogate);
					} else if (isCommentNav) {
						optionsSurrogate = wpajax_GETCommentsSection;
						optionsSurrogate.href = href;
						self.load(optionsSurrogate);
					} else {
						optionsSurrogate = wpajax_GETPage;
						optionsSurrogate.href = href;
						self.load(optionsSurrogate);
					}
				}
			});

			return true;
		},
		attachComments: function () {
			// link up with the wp comment form
			var respond = document.getElementById('respond');
			var commentform = document.getElementById('commentform');
			var statusdiv = document.createElement('div');
			var self = this;

			if (commentform && statusdiv) {
				statusdiv.id = 'comment-status';
				statusdiv = respond.insertBefore(statusdiv, commentform);
				window.addEvent(commentform, 'submit', function (e) {
					e.preventDefault();
					self.submitComment(commentform, statusdiv);
				});
			}
		},
		submitComment: function (commentform, statusdiv) {
			// Extract action URL and method from commentform
			var formurl = commentform.action;
			var method = commentform.method ? commentform.method.toUpperCase() : 'POST';

			// Serialize and store form data
			var formdata = window.serialize(commentform, true);
			var parentCommentId = /&comment_parent=(\d+)/.exec(formdata)[1];

			var commentStatus = {
				// TODO: add better error messages
				placeholder: '<p class="ajax-placeholder">Processing...</p>',
				invaid: '<p class="ajax-error" ><strong>ERROR:</strong> You might have left one of the fields blank, or be posting too quickly</p>',
				success: '<p class="ajax-success" ><strong>SUCCESS:</strong> Thanks for your comment. We appreciate your response.</p>',
				aborted: '<p class="ajax-success" ><strong>TIMEOUT:</strong> There was no response from the server. Please refresh the page to see if your comment Posted.</p>',
				error: '<p class="ajax-error" ><strong>ERROR:</strong> Please wait a while before posting your next comment</p>'
			};

			// Post Form with data
			this.load({
				httpMethod: method,
				href: formurl,
				data: formdata,
				timeoutTimer: 5000,
				requestHeaders: [{
					header: 'WP-Request-Type',
					value: 'PostComment'
				}],
				started: function () {
					statusdiv.innerHTML = commentStatus.placeholder;
				},
				failed: function (href, status, statusText) {
					var errorWrapper = document.createElement('div');
					errorWrapper.innerHTML = statusText;

					var wpErrorTitle = errorWrapper.querySelector('title');
					if (wpErrorTitle && wpErrorTitle.innerHTML.toLowerCase().match(/error/)) {
						// in case wordpress sends a formatted error page
						statusdiv.innerHTML = '<p><strong>ERROR ' + status + ': </strong>' + errorWrapper.getElementsByTagName('p')[0].innerHTML + '</p>';
						return true;
					} else {
						statusdiv.innerHTML = '<p><strong>ERROR ' + status + ': </strong>' + statusText + '</p>';
						return false;
					}
				},
				aborted: function (href, timoutTimer) {
					statusdiv.innerHTML = commentStatus.aborted;
				},
				delivered: function (commentLI, textStatus) {
					var wrapperUL = document.createElement('ul');
					wrapperUL.className = 'children';
					wrapperUL.innerHTML = commentLI;
					commentLI = wrapperUL.firstElementChild;

					var wpErrorTitle = wrapperUL.querySelector('title');
					if (wpErrorTitle && wpErrorTitle.innerHTML.toLowerCase().match(/error/)) {
						// in case wordpress sends a formatted error page
						commentStatus.wpError = wrapperUL.getElementsByTagName('p')[0].innerHTML;
						statusdiv.innerHTML = commentStatus.wpError;
						return false;
					} else {
						// if the comment doesn't have a parent, i.e. is it not a reply?
						if (parentCommentId === '0') {
							var commentlist = document.getElementsByClassName('commentlist')[0];
							if (commentlist) {
								commentLI.classList.add(opts.ajaxClass);
								commentlist.insertBefore(commentLI, commentlist.firstElementChild); // prependChild
							} else {
								console.log('there is nowhere to put the comment');
								statusdiv.innerHTML = commentStatus.error;
								return false;
							}
						} else {
							var childrenUL = document.querySelector('#comment-' + parentCommentId + ' > ul.children');
							if (childrenUL !== null) {
								commentLI.classList.add(opts.ajaxClass);
								childrenUL.appendChild(commentLI);
							} else {
								wrapperUL.classList.add(opts.ajaxClass);
								document.getElementById('comment-' + parentCommentId).appendChild(wrapperUL);
							}
						}
						statusdiv.innerHTML = commentStatus.success;
						commentform.querySelector('textarea[name=comment]').value = '';
					}
				}
			});
			return true;
		}
	};

	var wpajax_GETPage = {
		httpMethod: 'GET',
		timeoutTimer: 5000,
		requestHeaders: [{
			header: 'WP-Request-Type',
			value: 'GetPage'
		}],
		main: document.querySelector(opts.contentSelector),
		aborted: function (href, timoutTimer) {
			var timoutText = timoutTimer == null ? '' : 'The request timed out after ' + timoutTimer + ' milliseconds.';
			console.log('ajax load was aborted.\n' + timoutText);
			if (href) {
				document.location.href = href;
				return true;
			}
			return false;
		},
		failed: function (href, status, statusText) {
			var errorStatusText = statusText == null ? '' : 'Error Message: ' + statusText;
			console.log('ajax load failed with an error code: ' + status + '\n' + errorStatusText);
			if (href) {
				document.location.href = href;
				return true;
			}
			return false;
		},
		delivered: function (responseText, statusText) {
			var workspace = document.createElement('div');
			workspace.innerHTML = responseText;

			var headMeta = document.head.getElementsByTagName('meta');
			var newHeadMeta = workspace.querySelector('#ajax-head').getElementsByTagName('meta');
			for (var i = headMeta.length - 1; i > -1; --i) { // remove all meta tags
				headMeta[i].remove();
			}
			for (var j = newHeadMeta.length - 1; j > -1; --j) { // replace meta tags with new ones
				document.head.appendChild(newHeadMeta[j]);
			}

			// update header link tags
			wpajax.updateLinkTag('next', workspace);
			wpajax.updateLinkTag('prev', workspace);
			wpajax.updateLinkTag('shortlink', workspace);
			wpajax.updateLinkTag('canonical', workspace);

			if (workspace.getElementsByTagName('title')) {
				document.title = workspace.getElementsByTagName('title')[0].innerHTML; // update the doc title
			}
			if (this.main && workspace.querySelector(this.main).innerHTML) {
				this.main.classList.add(opts.ajaxClass);
				this.main.innerHTML = workspace.querySelector(this.main).innerHTML; // update the content
			}

			// update the the class list of all menu items
			var menuItems = workspace.querySelector('#wp-all-registered-nav-menus').querySelectorAll('.menu-item');
			for (var k = 0; k < menuItems.length; ++k) {
				var item = menuItems[k];
				document.getElementById(item.id).className = item.className;
			}

			// TODO: Test this
			if (typeof ga === 'function') { // google universial analytics tracking
				ga('send', 'pageview'); // send a pageview connected to anayltics.js loaded in footer.php
			}

			// comments section will be new - need to rebind events to new elements
			wpajax.attachComments();
			attachCtrlEnterSubmitWPComment();
			// console.log('ajax loaded!\n'+statusText);
			return true;
		}
	};

	var wpajax_GETPosts = {
		timeoutTimer: 5000,
		requestHeaders: [{
			header: 'WP-Request-Type',
			value: 'GetPosts'
		}],
		delivered: function (responseText, statusText) {
			var workspace = document.createElement('div');
			workspace.innerHTML = responseText;

			// replace posts section
			document.getElementsByClassName('post-items')[0].classList.add(opts.ajaxClass);
			document.getElementsByClassName('post-items')[0].innerHTML = workspace.querySelector('.post-items').innerHTML;

			// replace posts navigation links
			var newNextPosts = workspace.querySelector('.post-navigation .next-posts');
			var newPrevPosts = workspace.querySelector('.post-navigation .prev-posts');
			var newPostPages = workspace.querySelector('.post-navigation .page-numbers');
			var NextPosts = document.querySelectorAll('.post-navigation .next-posts');
			var PrevPosts = document.querySelectorAll('.post-navigation .prev-posts');
			var PostPages = document.querySelectorAll('.post-navigation .page-numbers');
			wpajax.replaceNavLinks(newNextPosts, NextPosts);
			wpajax.replaceNavLinks(newPrevPosts, PrevPosts);
			wpajax.replaceNavPageLinks(newPostPages, PostPages);

			if (typeof ga === 'function') { // google universial analytics tracking
				ga('send', 'pageview'); // send a pageview connected to anayltics.js loaded in footer.php
			}

			return true;
		}
	};

	var wpajax_GETCommentsSection = {
		httpMethod: 'GET',
		timeoutTimer: 5000,
		requestHeaders: [{
			header: 'WP-Request-Type',
			value: 'GetCommentsSection'
		}],
		delivered: function (responseText, statusText) {
			var workspace = document.createElement('div');
			workspace.innerHTML = responseText;
			console.log(workspace);

			// replace comments section
			document.getElementsByClassName('commentlist')[0].classList.add(opts.ajaxClass);
			document.getElementsByClassName('commentlist')[0].innerHTML = workspace.querySelector('.commentlist').innerHTML;

			// replace response area if nessasary
			if (!document.getElementById('respond')) {
				var commentsSection = document.getElementById('comments-section');
				var newRespond = workspace.querySelector('#respond');
				if (commentsSection && newRespond) {
					commentsSection.appendChild(newRespond);
				}
			}

			// replace comments navigation links
			// TODO: add pagination functionality
			var newNextComments = workspace.querySelector('.comment-navigation .next-comments');
			var newPrevComments = workspace.querySelector('.comment-navigation .prev-comments');
			var newCommentPages = workspace.querySelector('.comment-navigation .page-numbers');
			var NextComments = document.querySelectorAll('.comment-navigation .next-comments');
			var PrevComments = document.querySelectorAll('.comment-navigation .prev-comments');
			var CommentPages = document.querySelectorAll('.comment-navigation .page-numbers');
			wpajax.replaceNavLinks(newNextComments, NextComments);
			wpajax.replaceNavLinks(newPrevComments, PrevComments);
			wpajax.replaceNavPageLinks(newCommentPages, CommentPages);

			if (typeof ga === 'function') { // google universial analytics tracking
				ga('send', 'pageview'); // send a pageview connected to anayltics.js loaded in footer.php
			}

			return true;
		}
	};

	var wpajax_GETExample = {
		httpMethod: 'GET', // the request type
		timeoutTimer: 5000, // how long till aborting the request (in milliseconds)
		requestHeaders: [ // an array of objects
			{
				header: 'WP-Request-Type',
				value: 'GetExample'
			}, {
				header: 'another-header',
				value: 'pass this to wordpress backend'
			}
		],
		started: function () { // After the XMLHttpRequest object has been created, but before the open() method has been called
			console.log('ajax load has not yet been initalized');
			return true;
		},
		connected: function () { // The XMLHttpRequest.open method has been invoked successfully
			console.log('Connection Established');
			return true;
		},
		requested: function () { // The send method has been invoked and the HTTP response headers have been received
			console.log('Request Recieved');
			return true;
		},
		processing: function () { // HTTP response content begins to load
			console.log('Processing Request');
			return true;
		},
		aborted: function (href, timoutTimer) { // called when ajax aborts due to timeout or other causes
			var timoutText = timoutTimer == null ? '' : 'The request timed out after ' + timoutTimer + ' milliseconds.';
			console.log('ajax load was aborted.\n' + timoutText);
			if (href) {
				document.location.href = href; // reroute a regular page load
				return true;
			}
			return false;
		},
		finished: function () { // called when ajax is finished, pass or fail.
			console.log('ajax is done...');
			return true;
		},
		failed: function (href, status, statusText) { // called when the response is recieved with an error
			var errorStatusText = statusText == null ? '' : 'Error Message: ' + statusText;
			console.log('ajax load failed with an error code: ' + status + '\n' + errorStatusText);
			if (href) {
				document.location.href = href; // reroute a regular page load
				return true;
			}
			return false;
		},
		delivered: function (responseText, statusText) { // Do this once the ajax request is returned.
			// put the responseText string in a div so we can manipulate it as part of the DOM
			var workspace = document.createElement('div');
			workspace.innerHTML = responseText;
			console.log('ajax loaded!');

			if (typeof ga === 'function') { // google universial analytics tracking
				ga('send', 'pageview'); // send a pageview connected to anayltics.js loaded in footer.php
			}

			return true;
		}
	};

	// TODO: find a better way to call this?
	attachCtrlEnterSubmitWPComment();
	wpajax.attachPageLoad();
	wpajax.attachComments();
})(document, window, wpajax_options);
