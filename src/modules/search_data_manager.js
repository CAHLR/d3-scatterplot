import { plotOptionsReader } from './plot_options_reader.js';
import { searchDic } from './utilities.js';

export function SearchDataManager(featureCategoryAndDataMap, categories) {
  this.searchedData = [];
  this.searchedDataIndices = [];
  const searchColumn = plotOptionsReader.getSearchCategory();
  const searchText = plotOptionsReader.getSearchText();
  const searchCategoryValues = featureCategoryAndDataMap[searchColumn];

  // searching according to the substring given and searching column
  let isMatched = function(d) {
    if ( typeof d === 'undefined' ) {
      return false;
    }

    if (plotOptionsReader.searchExactMatchEnabled()) {
      return d === searchText;
    } else {
      return d.toLowerCase().indexOf(searchText.toLowerCase()) >= 0
        && searchText.length !== 0;
    }
  };

  let constructDataRowObject = (categories, datumIndex, featureCategoryAndDataMap) => {
    // featureCategoryAndDataMap is an object containing all
    // attributes of datapoint e.g. { category: [val1, val2, ...] }
    let dataRowObject = {}
    categories.forEach((category) => {
      dataRowObject[category] = featureCategoryAndDataMap[category][datumIndex];
    })
    return dataRowObject;
  };

  let initialize = (searchCategoryValues, featureCategoryAndDataMap, categories) => {
    /* searchCategoryValues holds the value of every point for the search column */
    for (let i=0; i < searchCategoryValues.length; i++) {
      // 0 if found val in this point, 1 if not found
      if (isMatched(searchCategoryValues[i])) {
        let dataRowObject = constructDataRowObject(categories, i, featureCategoryAndDataMap);
        // only add to searched_data if not already in
        if(searchDic(this.searchedData, dataRowObject) === true) {
          this.searchedData.push(dataRowObject);
          this.searchedDataIndices.push(i);
        }
      }
    }
  };
  // guard against default category value being passed in
  let categoryList = categories.filter((category) => {
    return category.toLowerCase() !== 'select'
  });
  initialize(searchCategoryValues, featureCategoryAndDataMap, categoryList);
}