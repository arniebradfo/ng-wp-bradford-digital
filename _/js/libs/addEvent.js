/**
 * addEvent
 * normalizes adding event listeners/handlers
 * @author http://stackoverflow.com/questions/10149963/adding-event-listener-cross-browser
 * @param {Element} element - the element to add the event listener to
 * @param {Event} event - the event to listen for
 * @param {Function} callback - the function called on the event
 */

(function (window) {
	window.addEvent = function (element, event, callback) {
		if (element.addEventListener) {
			element.addEventListener(event, callback, false);
		} else if (element.attachEvent) {
			element.attachEvent('on' + event, function () {
				// set the this pointer same as addEventListener when fn is called
				return (callback.call(element, window.event));
			});
		}
	};
})(window);
