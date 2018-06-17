import { Component, OnInit, ElementRef, AfterContentInit, ViewChild } from '@angular/core';
import { scrollBarUtil } from './scroll-bar.util';
import { fromEvent, Observable } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';

@Component({
	selector: 'ngwp-scroll-viewer',
	templateUrl: './scroll-viewer.component.html',
	styleUrls: ['./scroll-viewer.component.less']
})
export class ScrollViewerComponent implements OnInit, AfterContentInit {

	public scrollboxMargin: string = '';
	public scrollboxPadding: string = '';

	public onScroll$: Observable<Event>;

	@ViewChild('scrollViewport') scrollViewport: ElementRef;

	constructor() { }

	ngOnInit() { }

	ngAfterContentInit() {
		this._hideNativeScrollbar();
		this.onScroll$ = fromEvent<Event>(this.scrollViewport.nativeElement, 'scroll')
			.pipe(throttleTime(0, animationFrame))
	}

	private _hideNativeScrollbar() {
		const baseMargin = 30;
		const scrollbarWidth = scrollBarUtil.getNativeScrollbarWidth();
		this.scrollboxMargin = '0 -' + baseMargin + 'px 0 0';
		this.scrollboxPadding = '0 ' + (baseMargin - scrollbarWidth) + 'px 0 0';
	}

	public scrollToTop() {
		this.scrollViewport.nativeElement.scrollTop = 0;
	}

}
