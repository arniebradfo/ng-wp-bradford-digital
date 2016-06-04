#  Documentation Coming soon...

#  Ajax Boilerplate WordPress Theme
what is this? why not angular or react.

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
- WP:
    + write documentation
- JS:
    + rename file
    + add if() checks for everything in js - fail gracefully
    + PAGINATION: 
        * dynamiclly replace each link? - don't know how I would do this?
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



## this should be in a readme.txt file

=== Theme Name ===
Contributors: (this should be a list of wordpress.org userid's)
Donate link: http://example.com/
Tags: comments, spam
Requires at least: 3.0.1
Tested up to: 3.4
Stable tag: 4.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Here is a short description of the theme.  This should be no more than 150 characters.  No markup here.

== Description ==

This is the long description.  No limit, and you can use Markdown (as well as in the following sections).

For backwards compatibility, if this section is missing, the full length of the short description will be used, and
Markdown parsed.

A few notes about the sections above:

*   "Contributors" is a comma separated list of wordpress.org usernames
*   "Tags" is a comma separated list of tags that apply to the theme
*   "Requires at least" is the lowest version that the theme will work on
*   "Tested up to" is the highest version that you've *successfully used to test the theme*. Note that it might work on
higher versions... this is just the highest one you've verified.
*   Stable tag should indicate the Subversion "tag" of the latest stable version, or "trunk," if you use `/trunk/` for
stable.

    Note that the `readme.txt` of the stable tag is the one that is considered the defining one for the theme, so
if the `/trunk/readme.txt` file says that the stable tag is `4.3`, then it is `/tags/4.3/readme.txt` that'll be used
for displaying information about the theme.  In this situation, the only thing considered from the trunk `readme.txt`
is the stable tag pointer.  Thus, if you develop in trunk, you can update the trunk `readme.txt` to reflect changes in
your in-development version, without having that information incorrectly disclosed about the current stable version
that lacks those changes -- as long as the trunk's `readme.txt` points to the correct stable tag.

    If no stable tag is provided, it is assumed that trunk is stable, but you should specify "trunk" if that's where
you put the stable version, in order to eliminate any doubt.

== Installation ==

This section describes how to install the theme and get it working.

e.g.

1. Upload the theme files to the `/wp-content/themes/theme-name` directory, or install the theme through the WordPress themes screen directly.
1. Activate the theme through the 'themes' screen in WordPress
1. Use the Settings->theme Name screen to configure the theme
1. (Make your instructions match the desired user flow for activating and installing your theme. Include any steps that might be needed for explanatory purposes)


== Frequently Asked Questions ==

= A question that someone might have =

An answer to that question.

= What about foo bar? =

Answer to foo bar dilemma.

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets 
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png` 
(or jpg, jpeg, gif).
2. This is the second screen shot

== Changelog ==

= 1.0 =
* A change since the previous version.
* Another change.

= 0.5 =
* List versions from most recent at top to oldest at bottom.

== Upgrade Notice ==

= 1.0 =
Upgrade notices describe the reason a user should upgrade.  No more than 300 characters.

= 0.5 =
This version fixes a security related bug.  Upgrade immediately.

== Arbitrary section ==

You may provide arbitrary sections, in the same format as the ones above.  This may be of use for extremely complicated
themes where more information needs to be conveyed that doesn't fit into the categories of "description" or
"installation."  Arbitrary sections will be shown below the built-in sections outlined above.

== A brief Markdown Example ==

Ordered list:

1. Some feature
1. Another feature
1. Something else about the theme

Unordered list:

* something
* something else
* third thing

Here's a link to [WordPress](http://wordpress.org/ "Your favorite software") and one to [Markdown's Syntax Documentation][markdown syntax].
Titles are optional, naturally.

[markdown syntax]: http://daringfireball.net/projects/markdown/syntax
            "Markdown is what the parser uses to process much of the readme file"

Markdown uses email style notation for blockquotes and I've been told:
> Asterisks for *emphasis*. Double it up  for **strong**.

`<?php code(); // goes in backticks ?>`
