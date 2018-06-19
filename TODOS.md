# TODOs:
- List Title Nav
	- search - # search results for "term"
	- tags - # search results for "term"
	- categories - all, subcat, subcat
	- author - # posts authored by "name"
	- homelist - custom menu?
- page numbers
	- List Title Nav add page #
	- add selected page numbers to bottom page nav
- active sidebar
	- change routing?
	- root should go to correct state on router event
	
- rename everything more consistently...
	- HomeList - default list view?
	- Post
	- List
	- Menu
- make all private functions/props _name
- remove all public and :void

- clicking a left-post should retun to that post
- src sizes for images

- fix external link routing
- tab issue? search then tab destroys layout?
- password protected UX? 
- scroll events on touch?
- css
	- add focus color
	- make links black
	- touch :active state?
- delete `less-loader` from `package.json`


- content shortcodes
- comments css

- seo
- google analytics
- speed up loading
- sitemap

- transformations / animations
	- post to full post
	- menu
	- search
	- open/close menu
	- main image parallax
	- load post list
	- inital load of anything

- initial css and svg loading


### TODOs: less important
- configure to not require a wpBase environment var
- what to do when network fails?
- imporove network performance with more, smaller requests returning `Observables`
- [oembed?](https://codex.wordpress.org/Embeds)
- routing
  - multi page post pagination
  - child page routing
  - change tag and category base
  - change permalink file
- support options
	- permalink structure ?
	- homepage display
- use date and time formatting from options obj:
	- map [Anuglar date pipe](https://angular.io/api/common/DatePipe) to [php date formatting](https://codex.wordpress.org/Formatting_Date_and_Time)
- [widgets](https://wordpress.org/plugins/wp-rest-api-sidebars/) maybe not...
	- [custom templates](https://wordpress.stackexchange.com/questions/97411/code-for-recent-posts-widget)
