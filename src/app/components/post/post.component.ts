import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { IWpPage, IWpPost } from '../../interfaces/wp-rest-types';
import { ViewModelService } from '../../services/view-model.service';

@Component({
	selector: 'ngwp-post',
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.less']
})
export class PostComponent implements OnInit {

	@Input() post: IWpPage | IWpPost;

	@Input() displayFull: boolean = false;
	@Input() class: string = '';
	@HostBinding('class')
	get hostClasses(): string {
		return [
			this.class,
			this.displayFull ? 'display-full' : 'display-condensed',
			`format-${(<IWpPost>this.post).format}`,
			this.post.featured_media_ref ? 'featured-media-with' : 'featured-media-without',
		].join(' ');
	}

	private password: string;

	constructor(
		private viewModelService: ViewModelService
	) { }

	ngOnInit() {
		// console.log(this.post);
	}

	public onSubmitPassword(): void {
		this.viewModelService.getPasswordProtected(this.post.id, this.password);
	}

	public chooseRoute(post: IWpPost): any[] {
		return post.externalLink ? ['/externalRedirect', { externalUrl: post.externalLink.href }] : ['/', post.slug];
	}

}
