import { Component, OnInit, HostBinding } from '@angular/core';
import { WpRestService } from 'app/services/wp-rest.service';
import { ViewModelService } from 'app/services/view-model.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

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

	public blogName: string;
	public blogDescription: string;

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
	}

	toggleMenu(event: MouseEvent) {
		this.menuOpen = !this.menuOpen;
	}

}
