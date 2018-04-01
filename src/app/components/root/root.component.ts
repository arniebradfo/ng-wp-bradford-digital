import { Component, OnInit, HostBinding } from '@angular/core';
import { WpRestService } from 'app/services/wp-rest.service';
import { ViewModelService } from 'app/services/view-model.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IWpMenuItem } from 'app/interfaces/wp-rest-types';

@Component({
	selector: 'ngwp-root',
	templateUrl: './root.component.html',
	styleUrls: ['./root.component.less'],
	// animations: [ // not sure how performant this is...
		// trigger('menuState', [
		// 	state('open', style({
		// 		transform: 'translateX(-300px)',
		// 	})),
		// 	state('closed',  style({
		// 		transform: 'translateX(-100%)',
		// 	})),
		// 	transition('open => closed', animate('1000ms ease-in')),
		// 	transition('closed => open', animate('1000ms ease-out'))
		// ])
	// ]
})
export class RootComponent implements OnInit {

	blogName: string;
	blogDescription: string;
	menu: IWpMenuItem[];
	menuMame: string = 'primary';

	@HostBinding('class.menu-open')
	public menuOpen: boolean = true;

	constructor(
		private wpRestService: WpRestService,
		public viewModelService: ViewModelService,
	) { }

	ngOnInit(): void {
		this.wpRestService.options.then(options => {
			this.blogName = options.general.blogname;
			this.blogDescription = options.general.blogdescription;
		});
		this._getMenus();
	}

	toggleMenu(event: MouseEvent) {
		this.menuOpen = !this.menuOpen;
	}

		// get the route out of a url
		public parseRouterLink(url: string): string {
			return new URL(url).pathname;
		}

	private _getMenus() {
		this.wpRestService
			.getMenu(this.menuMame)
			.subscribe(res => {
				this.menu = res;
				console.log(this.menu);
			}, err => {
				console.error(err);
			});
	}

}
