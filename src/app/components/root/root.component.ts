import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { WpRestService } from 'app/services/wp-rest.service';
import { ViewModelService } from 'app/services/view-model.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IWpMenuItem } from 'app/interfaces/wp-rest-types';
import { Subscription } from 'rxjs/Subscription';

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
export class RootComponent implements OnInit, OnDestroy {

	blogName: string;
	blogDescription: string;
	menu: IWpMenuItem[];
	menuMame: string = 'primary';
	private _routerInfoSubscription: Subscription;

	@HostBinding('class.view-menu-open')
	public viewMenuOpen: boolean = false;

	@HostBinding('class.view-post-list')
	public viewPostList: boolean = false;

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
		this._routerInfoSubscription = this.viewModelService.routerInfo$.subscribe((routerInfo) => {
			console.log(routerInfo);
			this.viewMenuOpen = routerInfo.menuOpen;
			this.viewPostList = !routerInfo.postActive;
		});
	}

	ngOnDestroy(): void {
		this._routerInfoSubscription.unsubscribe();
	}

	toggleMenu(event: MouseEvent) {
		this.viewMenuOpen = !this.viewMenuOpen;
	}

	private _getMenus() {
		this.wpRestService
			.getMenu(this.menuMame)
			.subscribe(res => {
				this.menu = res;
				// console.log(this.menu);
			}, err => {
				console.error(err);
			});
	}



}
