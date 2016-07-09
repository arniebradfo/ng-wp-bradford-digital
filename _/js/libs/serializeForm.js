/**
 * serializeForm
 * Convert form elements to query string or JavaScript object.
 * @param {HTMLFormElement} form: the form to be serialized
 * @param {boolean} usePlusSpaces -
	false: spaces encoded as '%20'
	true: spaces encoded as '+'
 * @param {boolean} asObject -
	false: serialization returned as '&' separated string
	true: serialization returned as an object
 */

(function (window) {
	window.serializeForm = function (form, usePlusSpaces, asObject) {
		'use strict';

		var elements;
		var add = function (name, value) {
			value = encodeURIComponent(value);

			// Apparetly this is helpful - @link https://stackoverflow.com/questions/4276226/ajax-xmlhttprequest-post/
			if (usePlusSpaces) value = value.replace(/%20/g, '+');

			if (asObject) elements[name] = value;
			else elements.push(name + '=' + value);
		};

		if (asObject) elements = {};
		else elements = [];

		var i, len;
		for (i = 0, len = form.elements.length; i < len; ++i) {
			var element = form.elements[i];
			if (i in form.elements) {
				switch (element.nodeName) {
				case 'BUTTON': // Omit these elements
					break;
				default:
					switch (element.type) {
					case 'submit': case 'button': // Omit these input types
						break;
					default:
						add(element.name, element.value);
						break;
					}
					break;
				}
			}
		}

		if (asObject) {
			return elements;
		}

		return elements.join('&');
	};
})(window);
