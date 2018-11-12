import * as d3 from "d3";

import { height, margin, width } from './constants.js';
import { URLSearchParamsPolyfill } from '../vendors/url_search_params_polyfill.js';
import { plotOptionsReader } from './plot_options_reader.js';

// Use native API or Polyfill for older browsers that don't support URLSearchParams API
export const queryParams = (() => {
  if ('URLSearchParams' in window) {
    return new URLSearchParams(location.search)
  } else {
    return new URLSearchParamsPolyfill(location.search)
  };
})();

export function preSelectCheckboxValues() {
  const queryParamToCheckboxMap = {
    'log': plotOptionsReader.getLogSpectrumCheckbox,
    'spectrum': plotOptionsReader.getSpectrumCheckbox,
    'search_exact': plotOptionsReader.getSearchExactCheckbox,
    'transparency_exact': plotOptionsReader.getTransparencyExactCheckbox,
    'zoom': plotOptionsReader.getZoomCheckbox,
  };

  for (let queryParam of queryParams.keys()) {
    if (queryParamToCheckboxMap[queryParam]) {
      queryParamToCheckboxMap[queryParam]().checked = queryParams.get(queryParam);
    }
  }
}

export function preSelectDropdownValues(categories, categorySearchData) {
  const queryParamToDropdownMap = {
    'color': {
      'dropdown': plotOptionsReader.getFeatureToColorDropdown,
      'categoryType': categories
    },
    'search': {
      'dropdown': plotOptionsReader.getSearchCategoryDropdown,
      'categoryType': categorySearchData
    },
    'transparency': {
      'dropdown': plotOptionsReader.getFeatureForTransparencyDropdown,
      'categoryType': categorySearchData
    },
    'click': {
      'dropdown': plotOptionsReader.getClickOnFeatureDropDown,
      'categoryType': categorySearchData
    },
    'shape': {
      'dropdown': plotOptionsReader.getFeatureToShapeDropdown,
      'categoryType': categories
    }
  };

  for (let queryParam of queryParams.keys()) {
    if (queryParamToDropdownMap[queryParam]) {
      let paramValue = queryParams.get(queryParam);
      let categoryValues = queryParamToDropdownMap[queryParam]['categoryType'];
      if (categoryValues.includes(paramValue)) {
        queryParamToDropdownMap[queryParam]['dropdown']().value = paramValue;
      } else { //invalid dropdown value, set back to Select
        queryParamToDropdownMap[queryParam]['dropdown']().value = categoryValues[0];
      }
    }
  }
}

export function showElement(element) {
  let newClassName = element.className.replace(/hidden/gi,'');
  element.className = newClassName;
};

export function hideElement(element) {
  let newClassName = `${element.className} hidden`;
  element.className = newClassName;
};

export function featureToColorValueTranslator() {
  let featureToColor = plotOptionsReader.getFeatureToColor();
  let extractFeatureToColorValue = (targetColumn) => {
    return (data) => {
      return data[targetColumn];
    };
  };
  let extractFeatureToColorLogValue = (targetColumn) => {
    return (data) => {
      return Math.log(parseFloat(data[targetColumn]));
    };
  };

  if (plotOptionsReader.logSpectrumEnabled()) {
    return extractFeatureToColorLogValue(featureToColor);
  } else {
    return extractFeatureToColorValue(featureToColor);
  }
};

export let getArrayMin = (array) => {
  return array.reduce(
    (accumulator, currentValue) => Math.min(accumulator, currentValue)
  );
};

export let getArrayMax = (array) => {
  return array.reduce(
    (accumulator, currentValue) => Math.max(accumulator, currentValue)
  );
}

export let flattenArray = (array) => {
  return array.reduce((acc, val) => acc.concat(val), []);
}


// used to search a particular substring in the list of requested feature column
// used to determine whether we should add allValues to selectedData, hence the t/f -> f/t
export function searchDic(selectedData, allValues) {
  for(let i=0; i < selectedData.length; i++) {
    if (JSON.stringify(allValues) === JSON.stringify(selectedData[i])) {
      return false;
    }
  }
  return true;
};

export function linSpace(start, end, n) {
  var out = [];
  var delta = (end - start) / (n - 1);
  var i = 0;
  while(i < (n - 1)) {
    out.push(start + (i * delta));
    i++;
  }
  out.push(end);
  return out;
};

export function transpar (dot, valTransp, transparentColumn, valOpacityMatch, valOpacityNoMatch) {
  let transparencyDisabled = valTransp === "" || typeof dot === 'undefined';
  // the return value 1 means full opacity
  if (transparencyDisabled) { return 1 };

  let isMatch = ((dot, transparentColumn, valTransp) => {
    if (plotOptionsReader.transparencyExactMatchEnabled()) {
      return dot[transparentColumn] === valTransp;
    }

    let caseInsensitiveMatch = dot[transparentColumn].toLowerCase().indexOf(valTransp.toLowerCase()) > -1;
    return (dot[transparentColumn] && caseInsensitiveMatch);
  })(dot, transparentColumn, valTransp);

  return isMatch ? parseFloat(valOpacityMatch) : parseFloat(valOpacityNoMatch);
};

export function matchedData (searchCategory, valSearch, match) {
  if (match) {
    return (dataPoint) => {
      return dotSearchFilter(dataPoint, searchCategory, valSearch) === 2;
    }
  }
  return (dataPoint) => {
    return dotSearchFilter(dataPoint, searchCategory, valSearch) === 1;
  }
};

export function dotSearchFilter (dot, searchCategory, valSearch) {
  // return value 1 means unmatched dots
  // return value 2 means matched dots
  if (typeof dot[searchCategory] == 'undefined' ) {
    return 1;
  }
  // noMatch truthy if not found
  let noMatch = ((dot, searchCategory, valSearch) => {
    if (plotOptionsReader.searchExactMatchEnabled()) {
      return dot[searchCategory] !== valSearch;
    }

    let caseInsensitiveMatch = dot[searchCategory].toLowerCase().indexOf(valSearch.toLowerCase()) < 0;
    return caseInsensitiveMatch || valSearch.length === 0
  })(dot, searchCategory, valSearch);

  return noMatch ? 1 : 2;
};

// The following two functions are getter methods:
// value accessor - returns the value to encode for a given data object.
// Type Signature: data Object -> value
export function xValue(data) { return data.x };
export function yValue(data) { return data["y"] };

// The following two functions map a value to a visual display encoding, such as
// a pixel position.
// Type Signature: Value -> display Object
export let xScale = d3.scaleLinear().range([0, width]);
export let yScale = d3.scaleLinear().range([height, 0]);

// The following two functions map from data Object to display value (? not sure
// if value of object)
// Type Signature: data Object -> display Object (? Might be value)
export function xMap(data) { return xScale(xValue(data)) };
export function yMap(data) { return yScale(yValue(data)) };
