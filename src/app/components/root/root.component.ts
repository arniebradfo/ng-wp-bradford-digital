import { Component, OnInit, HostBinding, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { WpRestService } from 'app/services/wp-rest.service';
import { ViewModelService } from 'app/services/view-model.service';
// import { trigger, state, style, transition, animate } from '@angular/animations';
import { IWpMenuItem } from 'app/interfaces/wp-rest-types';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router, NavigationExtras } from '@angular/router';
import { InputDetectionService } from '../../services/input-detection.service';
import { TabDetectionService } from '../../services/tab-detection.service';
import { ScrollViewerComponent } from '../scroll-viewer/scroll-viewer.component';

@Component({
	selector: 'ngwp-root',
	templateUrl: './root.component.html',
	styleUrls: ['./root-states.component.less', './root.component.less']
})
export class RootComponent implements OnInit, AfterViewInit, OnDestroy {

	blogName: string;
	blogDescription: string;
	menu: IWpMenuItem[];
	menuMame: string = 'primary';
	private _subscriptions: Subscription[] = [];
	private _routerInfoState;
	private _menuNavigation: [any[], NavigationExtras];

	stateRoot: StateRoot = 'state-list';
	stateMobile: StateMobile = 'state-not-mobile';
	stateWas: StateRootWas = 'was-state-list';

	@HostBinding('class')
	private get _rootClass(): string {
		return `${this.stateRoot} ${this.stateMobile} ${this.stateWas}`;
	}

	@ViewChild('postScrollViewer') postScrollViewer: ScrollViewerComponent;
	@ViewChild('listScrollViewer') listScrollViewer: ScrollViewerComponent;

	constructor(
		private wpRestService: WpRestService,
		public viewModelService: ViewModelService,
		private router: Router,
		private inputDetectionService: InputDetectionService,
		private tabDetectionService: TabDetectionService
	) { }

	ngOnInit(): void {
		this.wpRestService.options.then(options => {
			this.blogName = options.general.blogname;
			this.blogDescription = options.general.blogdescription;
		});
		this._getMenus();
		this._subscriptions.push( fromEvent(window, 'resize').pipe(debounceTime(200)).subscribe(this._updateStateMobile.bind(this)) );
		this._subscriptions.push( this.viewModelService.routerInfo$.subscribe(this._onRouterInfoChange.bind(this)) );
		this._updateStateMobile();
	}

	ngAfterViewInit() {
		this._subscriptions.push( this.postScrollViewer.onScroll$.subscribe(this._onPostScroll.bind(this)) );
	}

	ngOnDestroy() {
		this._subscriptions.forEach(subscription => subscription.unsubscribe());
	}

	menuButtonClick() {
		// console.log(this._menuNavigation);
		this.router.navigate(this._menuNavigation[0], this._menuNavigation[1]);
	}

	menuButtonIcon(): string {
		if (this.stateMobile === 'state-not-mobile')
			return this.stateRoot === 'state-post' ? 'icon_Menu' : 'icon_X'
		else
			return this.stateRoot !== 'state-menu' ? 'icon_Menu' : 'icon_X'
	}

	private _onRouterInfoChange(routerInfo) {
		this.stateWas = `was-${this.stateRoot}` as StateRootWas ;
		this.stateRoot = routerInfo.state
		this._routerInfoState = routerInfo;

		console.log(routerInfo);


		// console.log(routerInfo);
		// console.log(this.stateWas);

		if (this.stateMobile === 'state-not-mobile') {

			this._menuNavigation = [
				routerInfo.slug ? [routerInfo.slug] : [],
				{
					queryParams: this.stateRoot === 'state-post' ? { m: true } : {}
				}
			];

		} else { // if (this.stateMobile === 'state-mobile') {

			let route: string[] = [];
			if (this.stateRoot === 'state-post' && routerInfo.slug)
				route = [routerInfo.slug];
			else if (this.stateRoot === 'state-list' && routerInfo.type && routerInfo.typeSlug)
				route = [routerInfo.type, routerInfo.typeSlug];

			this._menuNavigation = [
				route,
				{
					queryParams: this.stateRoot !== 'state-menu' ? { m: true } : {}
				}
			];
		}
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

	private _updateStateMobile() {
		this.stateMobile = window.innerWidth > MOBILE_BREAKPOINT ? 'state-not-mobile' : 'state-mobile';
	}

	private _onPostScroll(event: Event) {
		// console.log(event.srcElement.scrollTop);
	}

}

export type StateRoot = 'state-post' | 'state-list' | 'state-menu';
export type StateMobile = 'state-not-mobile' | 'state-mobile';
export type StateRootWas = 'was-state-post' | 'was-state-list' | 'was-state-menu';

// this must match:
// @MOBILE_BREAKPOINT: 700px;
// in ./root.media-queries.less
export const MOBILE_BREAKPOINT = 8 * 120;
