import { height, margin, width } from './constants.js';

// used to search a particular substring in the list of requested feature column
// used to determine whether we should add allValues to selectedData, hence the t/f -> f/t
export function searchDic(selectedData, allValues) {
  for(let i=0; i < selectedData.length; i++) {
    if (JSON.stringify(allValues) === JSON.stringify(selectedData[i])) {
      return false;
    }
  }
  return true;
}

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

// The following two variables are the X and Y axis objects
export let xAxis = d3.svg.axis().scale(xScale).orient("bottom");
export let yAxis = d3.svg.axis().scale(yScale).orient("left");