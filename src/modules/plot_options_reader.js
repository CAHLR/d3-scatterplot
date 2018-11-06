import { queryParams } from './utilities.js';
import {checkBoxClassNames, dropDownClassNames} from './constants.js';
// This object is meant to act as the intermediary between the view-logic and
// reading values from the DOM. This allows us to introduce more human readable
// logic in the code and further separates responsibilities.
export const plotOptionsReader = {
	getClickOnFeatureValue: () => {
		return document.getElementsByClassName('click-on-feature')[0].value;
	},
	getClickOnFeatureDropDown: () => {
		return document.getElementsByClassName('click-on-feature')[0];
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
	getFeatureForTransparencyDropdown: () => {
		return document.getElementsByClassName('transparency-by-feature')[0];
	},
	getFeatureToColor: () => {
		return document.getElementsByClassName('color-by-feature')[0].value;
	},
	getFeatureToColorDropdown: () => {
		return document.getElementsByClassName('color-by-feature')[0];
	},
	getFeatureToShape: () => {
		return document.getElementsByClassName('shape-by-feature')[0].value;
	},
	getFeatureToShapeDropdown: () => {
		return document.getElementsByClassName('shape-by-feature')[0];
	},
	getFilterByValueButton: () => {
		return document.getElementsByClassName('filter-button')[0];
	},
	getFilterByValueButtonContainer: () => {
		return document.getElementsByClassName('filter-button-container')[0];
	},
	getFilterByValueSelectedFeature: () => {
		return document.getElementsByClassName('scrubber-dropdown')[0].value;
	},
	getFilterByValueFeature: () => {
		return document.getElementsByClassName('filter-by-value')[0].value;
	},
	getFilterByValueOptionsContainer: () => {
		return document.getElementsByClassName('filter-by-value-options')[0];
	},
	getFilterByValueSlider: () => {
		return document.getElementsByClassName('sliders')[0].noUiSlider;
	},
	getLiveUpdateToggled: () => {
		return document.getElementsByClassName('live-update-toggled')[0].checked;
	},
	getOpacityValueSearchMatch: () => {
		return document.getElementsByClassName('opacity-value-search-match')[0].value;
	},
	getOpacityValueSearchNoMatch: () => {
		return document.getElementsByClassName('opacity-value-search-no-match')[0].value;
	},
	getResetButton: () => {
		return document.getElementsByClassName('reset-button')[0];
	},
	getSearchButton: () => {
		return document.getElementsByClassName('search-button')[0];
	},
	getSearchCategory: () => {
		return document.getElementsByClassName('search-by-feature')[0].value;
	},
	getSearchCategoryDropdown: () => {
		return document.getElementsByClassName('search-by-feature')[0];
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
	getLogSpectrumCheckbox: () => {
		return document.getElementsByClassName('log-spectrum-checkbox')[0];
	},
	logSpectrumEnabled: () => {
		return document.getElementsByClassName('log-spectrum-checkbox')[0].checked;
	},
	getSpectrumCheckbox: () => {
		return document.getElementsByClassName('spectrum-checkbox')[0];
	},
	spectrumEnabled: () => {
		return document.getElementsByClassName('spectrum-checkbox')[0].checked;
	},
	getSearchExactCheckbox: () => {
		return document.getElementsByClassName('search-exact-match')[0];
	},
	searchExactMatchEnabled: () => {
		return document.getElementsByClassName('search-exact-match')[0].checked;
	},
	getTransparencyExactCheckbox: () => {
		return document.getElementsByClassName('transparency-exact-match')[0];
	},
	transparencyExactMatchEnabled: () => {
		return document.getElementsByClassName('transparency-exact-match')[0].checked;
	},
	getZoomCheckbox: () => {
		return document.getElementsByClassName('enable-zoom')[0];
	},
	zoomCheckboxEnabled: () => {
		return document.getElementsByClassName('enable-zoom')[0].checked;
	},
};
