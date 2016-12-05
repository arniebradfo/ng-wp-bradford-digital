/**
 * navigation js class
 * must conform to interface:
 * @param {HTMLelement} context - an html element to look for elements inside of
 * @param {url} href - where are we going to navigate to?
 */

(function (document, window) {
	'use strict';

	window.navigationJS_postExpand = function (context, href, xhr) {
		// console.dir(this); // for debugging

		// SET TYPE
		href = window.addAjaxQueryString(href, 'getpage');

		// FLIP ANIMATION SETUP
		var animateMutate = new window.AnimateMutate({
			hero: 'cover__hero',
			title: ['cover__titleLink', true],
			imgList: 'cover__heroImg--list',
			imgBlur: 'cover__heroImg--blur',
			loadBar: 'button'
		}, context);

		var post = animateMutate.el.context;
		var hero = animateMutate.el.hero;
		var title = animateMutate.el.title;
		var imgList = animateMutate.el.imgList;
		var loadBar = animateMutate.el.loadBar;
		var loader = loadBar.node.getElementsByClassName('button__loadbar')[0];

		animateMutate.mutate = function () {
			// MUTATE NODE
			var main = document.getElementsByClassName('mainContent')[0];
			var mainClone = main.cloneNode(true);
			var postClone = post.node.cloneNode(true);
			post.node.parentNode.insertBefore(postClone, post.node.nextSibling); // insert after
			// this.postClone.style.visibility = 'hidden';
			mainClone.replaceChild(post.node, mainClone.getElementsByClassName('postItem')[0]);
			// mainClone.classList.remove('mainContent--active');
			post.node.classList.remove('post--list');

			// APPLY STYLES // collect rects without transform
			post.node.classList.add('post--full');
			document.body.appendChild(mainClone);
			document.body.removeChild(main);
			window.navigationJS_mainNavToggle();
			// mainClone.classList.add('mainContent--active');
			hero.node.style.transform = title.node.style.transform = loadBar.node.style.transition = 'none';
		};

		animateMutate.invert = function () {
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

		animateMutate.play = function () {
			// switch on transitions
			hero.node.style.transition = title.node.style.transition = loadBar.node.style.transition = '';
			// remove INVERT css to PLAY the transitions
			hero.node.style.transform = title.node.style.transform = loadBar.node.style.transform = '';
		};

		animateMutate.cleanUpAfter = hero.node;
		// animateMutate.cleanUp = function () {};

		// IMAGE LOADING
		var requestImg = new window.RequestImg(imgList.node); // can take a callback

		// AJAX REQUEST
		xhr.onload = function () {
			var workspace = document.createElement('div');
			workspace.innerHTML = xhr.responseText;
			// console.log(workspace); // for debugging
			post.node.getElementsByClassName('excerpt')[0].innerHTML = '';
			post.node.getElementsByClassName('frame')[0].innerHTML = workspace.getElementsByClassName('frame')[0].innerHTML;
		};

		// WHEN EVERYTHING IS DONE
		var onFinish = function () {
			imgList.node.style.transition = animateMutate.el.imgBlur.node.style.transition = 'opacity .5s linear';
			window.requestAnimationFrame(function () {
				imgList.node.style.opacity = animateMutate.el.imgBlur.node.style.opacity = '';
			});
		};

		// PROGRESS ELEMENT
		var xhrReadyState = function () {
			return xhr.readyState;
		};
		var trackedStatesList = [
			[xhrReadyState, 4],
			[requestImg.readyState, requestImg.readyStateMax]
		];
		var progressTracker = new window.ProgressTracker(trackedStatesList, onFinish);
		progressTracker.update = function () {
			loader.style.transform = 'scaleX(' + this.readyState + ')';
		};

		// DO!
		xhr.send();
		animateMutate.animate();
		progressTracker.start();
		requestImg.mutateAtts();
	};
})(document, window);
