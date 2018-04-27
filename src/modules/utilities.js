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