
// This object is meant to act as the intermediary between the view-logic and
// reading values from the DOM. This allows us to introduce more human readable
// logic in the code and further separates responsibilities.
export const plotOptionsReader = {
	getClickOnFeatureValue: () => {
		return document.getElementsByClassName('click-on-feature')[0].value;
	},
	getColorOptions: () => {
		return document.getElementsByClassName('color-option');
	},
	getFeatureToColor: () => {
		return document.getElementsByClassName('color-by-feature')[0].value;
	},
	getFeatureToShape: () => {
		return document.getElementsByClassName('shape-by-feature')[0].value;
	},
	getSearchButton: () => {
		return document.getElementsByClassName('search-button')[0];
	},
	getTransparentSearchButton: () => {
		return document.getElementsByClassName('transparent-search-button')[0];
	},
	getZoomButton: () => {
		return document.getElementsByClassName('zoom-button')[0];
	},
	logSpectrumEnabled: () => {
		return document.getElementsByClassName('log-spectrum-checkbox')[0].checked;
	},
	zoomCheckboxEnabled: () => {
		return document.getElementsByClassName('enable-zoom-checkbox')[0].checked;
	},
};