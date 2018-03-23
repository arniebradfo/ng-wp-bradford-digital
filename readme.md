# __NG-WP__ Angular WordPress Theme

A minimal, boilerplate WordPress theme that runs off of an Angular 5 app and the [WordPress REST API](https://developer.wordpress.org/rest-api/). 

## Why not use php?

Thats a good question...

What make WordPress great is its modularity and plugin ecosystem, mostly writen in php. By using an Anuglar frontend for a WordPress site, we are throwing out and re-impelementing almost all of WordPress's basic functionality. Becasue the theme does not use php templating, many plugins will never work. However, Angular provides us with amazing features that would be very difficult to implement in php templating. Its a trade-off. Be aware of the costs and benefits.

## Features

#### What it does now...
- __Routing__ to posts and post lists, filtered by tags, categories, or author
- __Menus__ via the [WP API Menus](https://wordpress.org/plugins/wp-api-menus/) plugin
- __Shortcodes__ that support angular components in your post content.
- __Comments__ post, display, reply
- __Search__ creates a list of pages/posts matching a string query
- __Pagination__ for posts and comments
- __Password protected posts__ 

#### What it doesn't do, but could...
- __Site maps__ 
- __Widgets__ via the [WP REST API Sidebars](https://wordpress.org/plugins/wp-rest-api-sidebars/) plugin
- __Translation__ 
- __Routing__ to child, or grandchild pages
- __Pagination__ for posts split into multiple pages
- __Support most WP Settings__
- __Media or Author pages__

#### What it might never do...
- __integrate with may WP plugins__ the ones that effect the frontend templating

## Setup
This project uses the [Angular CLI](https://github.com/angular/angular-cli).
1. run `npm install`.
2. In wp-admin > Settings > Permalinks, select _"PostName."_ This is required for the routing to work.
3. In src > app > environments, configure wpBase to whatever you dev and live sites are.
4. If you want test content, import the [Theme Unit Test](https://codex.wordpress.org/Theme_Unit_Test)
5. to debug: run `ng serve`
6. to build: run `ng build --prod --deploy-url="/wp-content/themes/{THEME_DIRECTORY_NAME}/dist/"`

## How it works
The basic strategy is to dump the whole WP data base onto the Angular frontend at load time using the [WP REST API](https://developer.wordpress.org/rest-api/). This could have some performance downsides for sites with large numbers of posts or images and could/shold be changed later. After the site loads all its data, it runs lightning fast becasue it does not need to make network requests for post content. Comments and password protected posts are loaded on demand.

## Supported Routing
- ROUTES TO POST/PAGE
    - `/{post-or-page-slug}/` 👍
    - `/{post-slug}/comment-page-{number}/#comments` 👎 this doesn't work because we can't match partial route params in a string
        - `/{post-slug}/comment-page/{comment-page-number}` 👍 this works, however
    - `/{page-slug}/{child-page-slug}/{grandchild-page-slug}/{ect...}` not implemented
    - `/{post-slug}/page/{page-number}/` not implemented
- ROUTES TO LIST
    - `/` 👍
    - `/page/{page-number}/` 👍
    - `/category|tag|author/{category-slug|tag-slug|author-slug}/` 👍
    - `/category|tag|author/{category-slug|tag-slug|author-slug}/page/{page-number}/` 👍
    - `/?s={search-term}` 👍
    - `/page/{page-number}/?s={search-term}` 👍 
- BACKEND
    - `/wp-admin/*` 👍

## Shortcodes
You can use angular "Embedded" components in post content just like shortcodes. There are some limitations to what those components can do, but it works with AOT compiler so you don't need the Angular JIT complier. Its done the same way the [angular.io](https://angular.io/) documentation is. Here's a [video](https://www.youtube.com/watch?v=__H65AsA_bE&feature=youtu.be&t=2h14m13s) about it and an [example repository](https://github.com/wardbell/ng-dynamic-app).


## Contributions
Please help if you'd like. 
Pull requests always welcome. 
Please do not use any css.
<!-- Theres a list feature requests in the [Issues](#).  -->

## Credit
Originally built for the tutorial http://doppiaeast.com/article/angular-2-wordpress-theme-setup/.

## Links
- [WP REST API](https://developer.wordpress.org/rest-api/)
- [Menus for WP REST API](https://wordpress.org/plugins/wp-api-menus/)
- ["Embeddable" Angular Components](https://github.com/wardbell/ng-dynamic-app) [video](https://www.youtube.com/watch?v=__H65AsA_bE&feature=youtu.be&t=2h14m13s)
- WP example content: [Theme Unit Test](https://codex.wordpress.org/Theme_Unit_Test)
- If your hosting your theme repository on github or bitbucket use the [github updater pluin](https://github.com/afragen/github-updater).
- [Save with Keyboard](https://wordpress.org/themes/save-with-keyboard/) is awesome.
- [Use svg](https://wordpress.org/themes/svg-support/).
- Use [vanilla js smooth scroll](https://github.com/cferdinandi/smooth-scroll/) to animate between anchors and other loads.
- [new angular animation features](https://www.yearofmoo.com/2017/06/new-wave-of-animation-features.html)


<!-- #### Usage

First, run `npm install`.

Inside the environments folder, you will find two files -- one for production and one for development. Open each up and set wpBase to whatever you dev and live sites are. 

For development, simply run `ng serve`, in the terminal inside the project folder, and the CLI will do the rest. The content of the site is managed from the WordPress admin panel.  

To push the project to the server, run `ng build --prod --deploy-url="/wp-content/themes/{THEME_DIRECTORY_NAME}/dist/"` from your command line. This will output a `dist` folder. Upload index.php, styles.css, functions.php, and the dist folder to your theme directory on your server. You should be good to go!

This project will play nice with the Angular CLI. -->
