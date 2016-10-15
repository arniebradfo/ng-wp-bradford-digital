#  Documentation Coming soon...

#  Ajax Boilerplate WordPress Theme
what is this? why not angular or react or some other thing

## How it Works
high level concept - uses ajax to load a wordpress page and updates its page contents - ajaxed page and loaded new page should have parity.

## Installation
1. Download the .zip
2. Rename downloaded folder to `wpajax`. That is the theme's real slug. WordPress likes it when the theme folder matches the theme's slug.

## Working With The Theme
ajax call is made
a request header is set by js, read by php into a global
certain sections are skipped or added based on type of request
- speeds up server response time, does less work
returned code is placed in the doc using js

## Helpful Code
- If your developing a wordpress theme, you should use the [Theme Checker theme](https://wordpress.org/themes/theme-check/).
- If your hosting your theme repository on github or bitbucket use the [github updater pluin](https://github.com/afragen/github-updater).
- For SEO [Yoast SEO](https://wordpress.org/themes/wordpress-seo/).
- For google analytics [Google Analytics by Yoast](https://wordpress.org/themes/google-analytics-for-wordpress/).
- [W3 total cache](https://wordpress.org/themes/w3-total-cache/)is complicated but can make your site a lot faster.
- [Save with Keyboard](https://wordpress.org/themes/save-with-keyboard/) is awesome.
- [Use svg](https://wordpress.org/themes/svg-support/).
- Use [vanilla js smooth scroll](https://github.com/cferdinandi/smooth-scroll/) to animate between anchors and other loads.
- MAMP
- [Just looking for pjax?](https://github.com/defunkt/jquery-pjax)

## TODOs:

was just doing...
- progress.js should update based on passing time and the state of things its connected to

- build a full js test case
- get content parts exporting in the right place
	- then connect everything
	- then style


- connect js modules
- add progress button
- wrap every template part in a shortcode compatible function

- add default animate load functions
- no difference between ajax called content and traditionally called content, to satisfy CDNs with static content

- prefix all functions
- concationate all php into a single functions file



- CSS:
	- redo spacing function

- WP:
    + write documentation
- JS:
    + rename file
    + add if() checks for everything in js - fail gracefully
    + PAGINATION:
        * dynamically replace each link? - don't know how I would do this?
    + HISTORY:
        * back button should load just comments if previous post was a comment load, same with posts pagination, or maybe everything?
        * make history-like object/array that stores the type of ajax call and along with the url? Reference this everytime we hit the back button.
        * save a copy of the last ajax response and use that insted of querying the server?
    + COMMENTS:
        * adding a comment and then paganating might produce wierd results
        * delete the last top level comment if returning a new top level comment? - if there is a second page of comments.
        * comment reply was borked
- CSS:
    + add progress bar
- TEST:
    + Test it with google analytics - use ga plugin?
    + feature detect to allow graceful degredation. modernizr?
        * Test browser implementation inconsistencies of popstate.
    + browser test

Keywords: ajax, pjax, pushstate, boilerplate, blank, starter, template, blueprint, framework, scaffolding, wp, js, asynchronous, javascript, xml
+ WP ajax boilerplate theme ??
+ WP Ajax Boilerplate
+ Ajax Boilerplate WordPress Theme
+ Ajax Boilerplate
+ WordPress Ajax Boilerplate
