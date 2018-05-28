import { Component, OnInit } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { scrollBarUtil } from './scroll-bar.util';

@Component({
	selector: 'ngwp-scroll-viewer',
	templateUrl: './scroll-viewer.component.html',
	styleUrls: ['./scroll-viewer.component.less']
})
export class ScrollViewerComponent implements OnInit, AfterContentInit {

	public scrollboxMargin: string = '';
	public scrollboxPadding: string = '';

	constructor() { }

	ngOnInit() { }

	ngAfterContentInit() {
		this.hideNativeScrollbar();
	}

	private hideNativeScrollbar(): void {
		const baseMargin = 30;
		const scrollbarWidth = scrollBarUtil.getNativeScrollbarWidth();
		this.scrollboxMargin = '0 -' + baseMargin + 'px 0 0';
		this.scrollboxPadding = '0 ' + (baseMargin - scrollbarWidth) + 'px 0 0';
	}

}
