import { Injectable } from '@angular/core';

// TODO: browser test

@Injectable()
export class InputDetectionService {

	public get isInputMouse(): boolean { return !this._isInputTouch };
	public get isInputTouch(): boolean { return this._isInputTouch };
	private _isInputTouch: boolean = false;
	private _element: HTMLElement = document.body;
	private _switchToTouchRef = this._switchToTouch.bind(this);
	private _switchToMouseRef = this._switchToMouse.bind(this);
	private _recordEventTimeStampRef = this._recordEventTimeStamp.bind(this);
	private _touchEndTimeStamp: number;

	constructor() {
		this._switchToMouse(); // or...
		// this._switchToTouch(); // if we expect a mobile device more often

		// FOR DEBUG //
		// document.addEventListener('touchstart', () => console.log('touchstart'), true);
		// document.addEventListener('mousemove', () => console.log('mousemove'), true);
	}

	private _switchToTouch() {
		document.removeEventListener('touchstart', this._switchToTouchRef, true);
		document.addEventListener('touchend', this._recordEventTimeStampRef, true);
		document.addEventListener('mousemove', this._switchToMouseRef, true);
		this._element.classList.remove('input-mouse');
		this._element.classList.add('input-touch');
		this._isInputTouch = true;
		// console.log('input-touch');
	}

	private _switchToMouse(event?: MouseEvent) {
		// 'touchend' and 'mousemove' both fire at the end of a touch press on android
		// event.timeStamp should equal this._touchEndTimeStamp exactly, but lets allow a margin of error
		if (event && event.timeStamp - this._touchEndTimeStamp < 10 )
			return; // filter out the 'mousemove' that occur after presses on a touch device

		document.addEventListener('touchstart', this._switchToTouchRef, true);
		document.removeEventListener('touchend', this._recordEventTimeStampRef, true);
		document.removeEventListener('mousemove', this._switchToMouseRef, true);
		this._element.classList.add('input-mouse');
		this._element.classList.remove('input-touch');
		this._isInputTouch = false;
		// console.log('input-mouse');
	}

	private _recordEventTimeStamp(event: TouchEvent) {
		// record the 'touchend' time stamp to compare with 'mousemove' in_switchToMouse
		this._touchEndTimeStamp = event.timeStamp
	}

}
