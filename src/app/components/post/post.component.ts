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

	// @HostBinding('class.show-full')

	@Input() showFull: boolean = false;
	@Input() class: string = '';
	@HostBinding('class')
	get hostClasses(): string {
		return [
			this.class,
			this.showFull ? 'show-full' : 'show-list',
			`format-${(<IWpPost>this.post).format}`,
			this.post.featured_media_ref ? 'featured-media-with' : 'featured-media-without',
		].join(' ');
	}


	private showPasswordForm: boolean = false;
	private password: string;

	constructor(
		private viewModelService: ViewModelService
	) { }

	ngOnInit() {
		this.showPasswordForm = !!this.post.content.protected;
		console.log(this.post);
	}

	public onSubmitPassword(): void {
		this.viewModelService.getPasswordProtected(this.post.id, this.password);
	}

	public chooseRoute(post: IWpPost): any[] {
		return post.externalLink ? ['/externalRedirect', { externalUrl: post.externalLink.href }] : ['/', post.slug];
	}

}
