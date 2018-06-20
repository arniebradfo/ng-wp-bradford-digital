# TODOs:
- src sizes for images
	- proper height and width for images
- fix external link routing
- css issues
	- layout css for search header
	- footer menu
	- header img border
	- home alignment
	- add focus color
	- make links black
	- touch :active state?
- tab issue? search then tab destroys layout?
	- trap tabbing?
- scroll events on touch?
- Img row... shortcode or what?
	- php plugin maybe?

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
