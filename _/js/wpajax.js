// normalizes adding event listeners/handlers (http://stackoverflow.com/questions/10149963/adding-event-listener-cross-browser)
function addEvent (elem, event, fn) {
	// console.log('addEvent was called on '+elem+' with function '+fn);
	if (elem.addEventListener) {
		elem.addEventListener(event, fn, false);
	} else if (elem.attachEvent) {
		elem.attachEvent('on' + event, function () {
		// set the this pointer same as addEventListener when fn is called
			return (fn.call(elem, window.event));
		});
	}
}

// finds the WP comment entry section and adds a ctrl/cmd + enter lister
function attachCtrlEnterSubmitWPComment () {
	var commentArea = document.getElementById('comment');
	if (commentArea) {
		addEvent(commentArea, 'keydown', function (e) {
			if ((e.ctrlKey || e.metaKey) && (e.keyCode === 13 || e.keyCode === 10)) {
				document.getElementById('submit').click();
			}
		});
	}
}

// Convert form elements to query string or JavaScript object.
HTMLFormElement.prototype.serialize = function (asObject) { // @param asObject: If the serialization should be returned as an object.
	'use strict';
	var form = this;
	var elements;
	var add = function (name, value) {
		value = encodeURIComponent(value);
		if (asObject) {
			elements[name] = value;
		} else {
			elements.push(name + '=' + value);
		}
	};
	if (asObject) {
		elements = {};
	} else {
		elements = [];
	}

	var i, len;
	for (i = 0, len = form.elements.length; i < len; ++i) {
		var element = form.elements[i];
		if (i in form.elements) {
			switch (element.nodeName) {
			case 'BUTTON':
				/* Omit this elements */
				break;
			default:
				switch (element.type) {
				case 'submit':
				case 'button':
					/* Omit this types */
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
				addEvent(xhttp, 'loadstart', function () {
					obj.started();
				});
			}
			if (typeof obj.aborted === 'function') {
				addEvent(xhttp, 'abort', function () {
					obj.aborted(obj.href);
				});
				addEvent(xhttp, 'timeout', function () {
					obj.aborted(obj.href, xhttp.timeout);
				});
			}
			if (typeof obj.finished === 'function') {
				addEvent(xhttp, 'loadend', function () {
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
			addEvent(window, 'popstate', function (event) {
				// don't fire on the inital page load
				// TODO: make back button paginates comments??
				if (event.state !== null) {
					var optionsSurrogate = wpajax_GETPage;
					optionsSurrogate.href = window.location.href;
					self.load(optionsSurrogate);
				}
			});

			// transforms all the interal hyperlinks into ajax requests
			addEvent(document, 'click', function (event) {
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
				addEvent(commentform, 'submit', function (e) {
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
			var formdata = commentform.serialize().replace(/%20/g, '+'); // Apparetly this is helpful - https://stackoverflow.com/questions/4276226/ajax-xmlhttprequest-post/
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
