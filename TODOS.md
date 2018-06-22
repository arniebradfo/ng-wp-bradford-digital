# TODOs:
- css issues
	- header images
		- make image height correct
		- doesn't change on mobile height change... 
		- src sizes="" for img tags
		- header img border - imageless 
	- layout css for search/tag/author header text
	- align post and post-list content columns the same...
	- footer menu
		- add menu
		- add css
	- home alignment css logo with post list header
	- add focus color back in
	- no disabled hover - outline is dissappearing
	- make links black
	- touch :active state?
- hide comments
- tab issue? search then tab destroys layout?
	- trap tabbing?
- fix external link routing
- scroll events on touch?
	- try css, give up with iOS
- Img row... shortcode or what?
	- php plugin maybe?
- contact form?
- browser test
	- firefox
	- safari
	- edge
	- chrome
	- android chrome 
	- i0S - emulator?

### Deployment
- delete `less-loader` from `package.json`
- create versioning system
	- github updater
- create/document release process
	- npm run automation?
- put site online

### SEO
- seo
- google analytics
- speed up loading, gzip etc
- sitemap



- content shortcodes


### ANIMATIONS
- transformations / animations
	- post to full post
	- menu
	- search
	- open/close menu
	- main image parallax
	- load post list
	- inital load of anything
- initial css and svg loading
- basic critical css?


### TODOs: less important
- comments
- password protected UX? 
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
