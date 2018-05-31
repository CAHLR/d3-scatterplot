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


// VIEW HELPER: used to display the summary on the webpage
// print all the key values pairs of a point
export function printArray(arr, d) {
  var x = "";
  for (var i=0; i < arr.length; i++) {
    x = x + "<b>" + arr[i] + "</b>: " + d[arr[i]] + "<br>"
  }
  x = x + d.x + "<br>" + d["y"];
  return x;
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

export function matchedData (categorySearch, valSearch, match) {
  if (match) {
    return (dataPoint) => {
      return dotSearchFilter(dataPoint, categorySearch, valSearch) === 2;
    }
  }
  return (dataPoint) => {
    return dotSearchFilter(dataPoint, categorySearch, valSearch) === 1;
  }
};

export function dotSearchFilter (dot, categorySearch, valSearch) {
  // return value 1 means unmatched dots
  // return value 2 means matched dots
  if (typeof dot[categorySearch] == 'undefined' ) {
    return 1;
  }
  // noMatch truthy if not found
  let noMatch = ((dot, categorySearch, valSearch) => {
    if (plotOptionsReader.searchExactMatchEnabled()) {
      return dot[categorySearch] !== valSearch;
    }

    let caseInsensitiveMatch = dot[categorySearch].toLowerCase().indexOf(valSearch.toLowerCase()) < 0;
    return caseInsensitiveMatch || valSearch.length === 0
  })(dot, categorySearch, valSearch);

  return noMatch ? 1 : 2;
};

// Checks the url query for name=value and extracts the value
// *************************************************************
// TODO: This can likely be accomplished using newer browser APIS, e.g.:
// let queryParams = (new URL(location)).searchParams;
export function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// The following two functions are getter methods:
// value accessor - returns the value to encode for a given data object.
// Type Signature: data Object -> value
export function xValue(data) { return data.x };
export function yValue(data) { return data["y"] };

// The following two functions map a value to a visual display encoding, such as
// a pixel position.
// Type Signature: Value -> display Object
export let xScale = d3.scale.linear().range([0, width]);
export let yScale = d3.scale.linear().range([height, 0]);

// The following two functions map from data Object to display value (? not sure
// if value of object)
// Type Signature: data Object -> display Object (? Might be value)
export function xMap(data) { return xScale(xValue(data)) };
export function yMap(data) { return yScale(yValue(data)) };

