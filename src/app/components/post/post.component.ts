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
	@Input() parallaxScrollTop: number = 0;

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
		console.log(this.post);
	}

	onSubmitPassword(): void {
		this.viewModelService.getPasswordProtected(this.post.id, this.password);
	}

	chooseRoute(post: IWpPost): any[] {
		return post.externalLink ? ['/externalRedirect', { externalUrl: post.externalLink.href }] : ['/', post.slug];
	}

	parallaxTranslate(denominator: number = 2): string {
		const transX = Math.round(this.parallaxScrollTop / denominator);
		return `translate3d( 0, ${transX}px, 0 )`;
		// a different method: http://www.javascriptkit.com/dhtmltutors/parallaxscrolling/index.shtml
	}

}
