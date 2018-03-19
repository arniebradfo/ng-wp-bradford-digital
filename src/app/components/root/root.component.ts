import { Component, OnInit, HostBinding } from '@angular/core';
import { WpRestService } from 'app/services/wp-rest.service';
import { ViewModelService } from 'app/services/view-model.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
	selector: 'ngwp-root',
	templateUrl: './root.component.html',
	styleUrls: ['./root.component.less'],
	animations: [
		trigger('menuState', [
			state('open', style({
				opacity: 0,
			})),
			state('closed',   style({
				opacity: 1,
			})),
			transition('open => closed', animate('1000ms ease-in')),
			transition('closed => open', animate('1000ms ease-out'))
		])
	]
})
export class RootComponent implements OnInit {

	public blogName: string;
	public blogDescription: string;

	// @HostBinding('@menuState')
	public menuState: 'open' | 'closed';



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
		this.menuState = this.menuState === 'closed' ? 'open' : 'closed';
	}

}
