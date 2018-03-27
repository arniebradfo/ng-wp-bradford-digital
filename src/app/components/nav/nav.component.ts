import { Component, OnInit, Input } from '@angular/core';
import { IWpMenuItem } from '../../interfaces/wp-rest-types';
import { WpRestService } from '../../services/wp-rest.service';

// displays a menu from the WP MENU API plugin
// will not work without the plugin: https://wordpress.org/plugins/wp-api-menus/

@Component({
	selector: 'ngwp-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {

	public error: any;

	@Input() items: IWpMenuItem[];

	constructor(
		private wpRestService: WpRestService,
	) { }

	ngOnInit() { }

	// get the route out of a url
	public parseRouterLink(url: string): string {
		return new URL(url).pathname;
	}

}
