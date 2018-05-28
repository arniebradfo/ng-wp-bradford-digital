export const scrollBarUtil = {

	// https://stackoverflow.com/a/13382873/5648839
	_nativeScrollbarWidth: undefined,
	getNativeScrollbarWidth: function (): number {
		if (this._nativeScrollbarWidth) return this._nativeScrollbarWidth;

		// Create hidden div (outer) with width set to '100px' and get offset width (should be 100)
		const outer = document.createElement('div');
		outer.style.visibility = 'hidden';
		outer.style.width = '100px';
		outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
		document.body.appendChild(outer);
		const widthNoScroll = outer.offsetWidth;

		// Force scroll bars to appear in div (outer) using CSS overflow property
		outer.style.overflow = 'scroll';

		// Create new div (inner) and append to outer, set its width to '100%' and get offset width
		const inner = document.createElement('div');
		inner.style.width = '100%';
		outer.appendChild(inner);
		const widthWithScroll = inner.offsetWidth;

		// Calculate scrollbar width based on gathered offsets
		outer.parentNode.removeChild(outer);

		this._nativeScrollbarWidth = widthNoScroll - widthWithScroll;
		return this._nativeScrollbarWidth;
	}

};
