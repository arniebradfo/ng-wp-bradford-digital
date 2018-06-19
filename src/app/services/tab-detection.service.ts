import { Injectable } from '@angular/core';

@Injectable()
export class TabDetectionService {

	private _isTabbing: boolean = false;
	private _element: HTMLElement = document.body;
	private _endTabbingRef = this._endTabbing.bind(this);
	private _startTabbingRef = this._startTabbing.bind(this);

	constructor() {
		this._endTabbing();
	}

	private _endTabbing() {
		document.removeEventListener('mousedown', this._endTabbingRef, true);
		document.addEventListener('keydown', this._startTabbingRef, true);
		this._element.classList.remove('input-tabbing');
		this._isTabbing = false;
	}

	private _startTabbing(event: KeyboardEvent) {
		if (event.which !== 9) // 9 is tab, 32 is spacebar, 13 is return
			return;

		document.addEventListener('mousedown', this._endTabbingRef, true);
		document.removeEventListener('keydown', this._startTabbingRef, true);
		this._element.classList.add('input-tabbing');
		this._isTabbing = true;
	}

}
