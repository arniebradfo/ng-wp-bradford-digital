/**
 * Js component boilerplate
 * description
 */

(function (document, window) {
	'use strict';

	window.postExpand = function (e, context, href) {
		// e.preventDefault();

		var postExpandFLIP = new window.AnimateMutate({
			hero: 'cover__hero',
			title: ['cover__titleLink', true],
			imgList: 'cover__heroImg--list',
			imgBlur: 'cover__heroImg--blur'
		}, context);

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
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // ALWAYS set this!
		xhr.setRequestHeader('WP-Request-Type', 'GetPage');
		xhr.onload = function () {
			var workspace = document.createElement('div');
			workspace.innerHTML = xhr.responseText;
			console.log(workspace);

			post.node.getElementsByClassName('excerpt')[0].innerHTML = '';
			post.node.getElementsByClassName('frame')[0].innerHTML = workspace.getElementsByClassName('frame')[0].innerHTML;
		};

		// DO!
		xhr.send();
		postExpandFLIP.animate();
		requestFullImg.mutateAtts();
	};
})(document, window);
