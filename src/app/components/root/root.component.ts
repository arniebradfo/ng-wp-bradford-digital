import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { WpRestService } from 'app/services/wp-rest.service';
import { ViewModelService } from 'app/services/view-model.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IWpMenuItem } from 'app/interfaces/wp-rest-types';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationExtras } from '@angular/router';

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
	private _routerInfoState;
	private _menuNavigation: [any[], NavigationExtras];

	@HostBinding('class')
	public stateRoot: StateRoot = 'state-list';

	// @HostBinding('class')
	// public stateMobile: StateMobile = 'state-not-mobile';

	constructor(
		private wpRestService: WpRestService,
		public viewModelService: ViewModelService,
		private router: Router
	) { }

	ngOnInit(): void {
		this.wpRestService.options.then(options => {
			this.blogName = options.general.blogname;
			this.blogDescription = options.general.blogdescription;
		});
		this._getMenus();
		this._routerInfoSubscription = this.viewModelService.routerInfo$.subscribe((routerInfo) => {
			console.log(routerInfo.state);
			this.stateRoot = routerInfo.state
			this._routerInfoState = routerInfo;

			// TODO: if mobile, do something else??
			this._menuNavigation = [
				routerInfo.slug ? [routerInfo.slug] : [],
				{
					queryParams: this.stateRoot === 'state-post' ? { m: true } : {}
				}
			];
		});
	}

	ngOnDestroy(): void {
		this._routerInfoSubscription.unsubscribe();
	}

	menuButtonClick() {
		console.log(this._menuNavigation);
		this.router.navigate(this._menuNavigation[0], this._menuNavigation[1]);
	}

	menuButtonIcon(): string {
		return this.stateRoot === 'state-post' ? 'icon_Menu' : 'icon_X'
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

export type StateRoot = 'state-post' | 'state-list' | 'state-menu';
export type StateMobile = 'state-not-mobile' | 'state-mobile';
