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
      return;
    } else {
      hideElement(plotOptionsReader.getDefaultFilterMessage());
      showElement(plotOptionsReader.getFilterByValueButtonContainer());
      showElement(plotOptionsReader.getFilterByValueOptionsContainer());
      let filterDropdown = createAndPopulateDropdown(numericCategories);
      let slider = createScrubber(numericCategories[0]);
      setEventHandlers(slider, filterDropdown, dataManager);
      let mountEvent = new Event("scrubberMounted", {"bubbles":true, "cancelable":false});
      document.dispatchEvent(mountEvent);
    }
  }

  let hideDefaultMessage = () => {
    let className = '';
    let messageContainer = document.getElementsByClassName(className)[0];
    messageContainer.className = `${className} hidden`;
  }

  let setEventHandlers = (slider, dropdown, dataManager) => {
    dropdown.on('change', () => {
      let data = selectedValues(plotOptionsReader.getFilterByValueSelectedFeature());
      let uniqueValues = [...new Set(data)];
      slider.noUiSlider.updateOptions(createSliderOptions(data, uniqueValues));
    })
  }

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
    return filterDropdown;
  }

  let createScrubber = (selectedCategory) => {
    let data = selectedValues(selectedCategory);
    let uniqueValues = [...new Set(data)];
    let container = document.getElementsByClassName('sliders')[0];
    let options = createSliderOptions(data, uniqueValues)
    noUiSlider.create(container, options);
    return container;
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
    return [values[0], values[values.length - 1]];
  }

  let createSliderOptions = (data, uniqueValues) => {
    let options = {
      start: createStartpoints(data),
      range: createRangeObject(uniqueValues),
      snap: true,
      // Display colored bars between handles
      connect: true,
      pips: {
        mode: 'positions',
        values: [0, 100],
        density: 8
      },
      tooltips: [true, true]
    }
    return options;
  }

  let selectedValues = (selectedCategory) =>{
    return this.dataManager
               .featureCategoryAndDataMap[selectedCategory]
               .map((el) => (+el))
               .sort((x, y) => x - y);
  }
}
