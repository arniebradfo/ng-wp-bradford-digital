import { Component, OnInit, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// search form that routes to a list filtered by the search string

@Component({
	selector: 'ngwp-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {

	search: string;

	@HostBinding('class.is-open')
	isOpen: boolean = false;

	@ViewChild('searchInput')
	searchInput: ElementRef;

	@ViewChild('searchSubmit')
	searchSubmit: ElementRef;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute
	) { }

	ngOnInit() { }

	onSubmit() {
		this.router.navigate(['search', this.search], {
			// queryParams: { s: this.search },
			// relativeTo: this.activatedRoute.root
		});
		// window.setTimeout(() => this.close(), 0)
		this.close();
	}

	hasFocus(): boolean {
		const focused = document.activeElement;
		return this.searchInput.nativeElement.nativeElement === focused || this.searchSubmit.nativeElement === focused;
	}

	open() {
		this.isOpen = true;
		window.setTimeout(() => this.searchInput.nativeElement.focus(), 0)
	}
	close() {
		this.isOpen = false;
		window.setTimeout(() => this.searchInput.nativeElement.blur(), 0)
		this.search = '';
	}
	toggleOpen() {
		return this.isOpen ? this.close() : this.open();
	}

	maybeClose() {
		window.setTimeout(() => {
			if (!this.hasFocus())
				this.close();
		}, 0)
	}

}
