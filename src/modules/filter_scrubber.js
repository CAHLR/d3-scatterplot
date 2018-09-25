import { DropdownBuilder } from './dropdown_builder.js';
import { plotOptionsReader } from './plot_options_reader.js';
import { hideElement, showElement } from './utilities.js';

export function FilterScrubber(dataManager, categories) {
	this.dataManager = dataManager;
	this.categories = categories;

	this.mount = () => {
		let numericCategories = this.categories.filter((category) => {
      return this.dataManager.featureIsNumeric(category)
    });
    if (numericCategories.length === 0) {
    	return
    } else {
    	hideElement(plotOptionsReader.getDefaultFilterMessage());
    	showElement(plotOptionsReader.getFilterByValueButtonContainer());
    	showElement(plotOptionsReader.getFilterByValueSelectionContainer());
    	createAndPopulateDropdown(numericCategories);
    	createScrubber(numericCategories[0]);
    	setEventHandlers();
    }
	}

	let hideDefaultMessage = () => {
		let className = '';
		let messageContainer = document.getElementsByClassName(className)[0];
		messageContainer.className = `${className} hidden`;
	}

	let setEventHandlers = () => {}

	let showFilterButton = () => {
		let className = 'filter-button';
		let toggleContainer = document.getElementsByClassName(className)[0];
		toggleContainer.className = className;
	}

	let createAndPopulateDropdown = (categories) => {
		let dropdownBuilder = new DropdownBuilder();
		let filterDropdown = dropdownBuilder.createDowndownMenu(
      'color_column',
      'filter-by-value-container',
      'filter-by-value scrubber-dropdown'
    );
    dropdownBuilder.populateDropdownOptions(filterDropdown, categories);
	}

	let createScrubber = (selectedCategory) => {
		let selectedValues = this.dataManager
														 .featureCategoryAndDataMap[selectedCategory]
														 .map((el) => (+el))
														 .sort();
	  let container = document.getElementsByClassName('sliders')[0];
	  noUiSlider.create(container, {
	    start: createStartpoints(selectedValues),
	    range: createRangeObject(selectedValues),
	    snap: true,
	    // Display colored bars between handles
	    connect: true,
	    // tooltips: [true],
	    pips: {
        mode: 'steps'
    	}
	  })
	}

	let createRangeObject = (values) => {
		let rangeObject = {};
		let arraySize = values.length;
		values.forEach((value, index) => {
			if (index === 0) {
				rangeObject['min'] = value;
			} else if (index === arraySize - 1) {
				rangeObject['max'] = value;
			} else {
				let percentage = ((index / arraySize) * 100).toFixed(2);
				rangeObject[percentage] = value;
			}
		});
		return rangeObject;
	}

	let createStartpoints = (values) => {
		let midpointValueIndex = Math.floor(values.length / 2);
		return [values[midpointValueIndex], values[midpointValueIndex + 2]];
	}
}
