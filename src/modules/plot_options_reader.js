
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
	getDefaultFilterMessage: () => {
		return document.getElementsByClassName('unsupported-dataset-message')[0];
	},
	getFeatureForTransparency: () => {
		return document.getElementsByClassName('transparency-by-feature')[0]
									 .value
									 .toString();
	},
	getFeatureToColor: () => {
		return document.getElementsByClassName('color-by-feature')[0].value;
	},
	getFeatureToShape: () => {
		return document.getElementsByClassName('shape-by-feature')[0].value;
	},
	getFilterByValueButton: () => {
		return document.getElementsByClassName('filter-button')[0];
	},
	getFilterByValueButtonContainer: () => {
		return document.getElementsByClassName('filter-button-container')[0];
	},
	getFilterByValueFeature: () => {
		return document.getElementsByClassName('filter-by-value')[0].value;
	},
	getFilterByValueSelectionContainer: () => {
		return document.getElementsByClassName('filter-by-value-container')[0];
	},
	getFilterByValueSlider: () => {
		return document.getElementsByClassName('sliders')[0].noUiSlider;
	},
	getOpacityValueSearchMatch: () => {
		return document.getElementsByClassName('opacity-value-search-match')[0].value;
	},
	getOpacityValueSearchNoMatch: () => {
		return document.getElementsByClassName('opacity-value-search-no-match')[0].value;
	},
	getSearchButton: () => {
		return document.getElementsByClassName('search-button')[0];
	},
	getSearchCategory: () => {
		return document.getElementsByClassName('search-by-feature')[0].value;
	},
	getSearchText: () => {
		return document.getElementsByClassName('search-text')[0].value;
	},
	getTransparentSearchButton: () => {
		return document.getElementsByClassName('transparent-search-button')[0];
	},
	getTransparentSearchText: () => {
		return document.getElementsByClassName('transparency-search-text')[0]
									 .value
									 .toString();
	},
	getZoomButton: () => {
		return document.getElementsByClassName('zoom-button')[0];
	},
	logSpectrumEnabled: () => {
		return document.getElementsByClassName('log-spectrum-checkbox')[0].checked;
	},
	spectrumEnabled: () => {
		return document.getElementsByClassName('spectrum-checkbox')[0].checked;
	},
	searchExactMatchEnabled: () =>{
		return document.getElementsByClassName('search-exact-match')[0].checked;
	},
	transparencyExactMatchEnabled: () =>{
		return document.getElementsByClassName('transparency-exact-match')[0].checked;
	},
	zoomCheckboxEnabled: () => {
		return document.getElementsByClassName('enable-zoom')[0].checked;
	},
};