
export function DataManager(data, categories) {
  this.allXValues = [];
  this.allYValues = [];
  const dataTypeMap = {};

  let populateDataTypeMap = (datum, category) => {
    let datumIsEmpty = datum[category] === "";
    let datumIsFloat = datum[category] == parseFloat(datum[category]);
    let datumType = datumIsEmpty || datumIsFloat ? 'numeric' : 'categorical or ordinal';
    dataTypeMap[category] =  datumType;
  };

  // featureCategoryAndDataMap is an object containing all
  // attributes of datapoint e.g. { category: [val1, val2, ...] }
  let initializeFeatureCategoryAndDataMap = (categories) => {
    this.featureCategoryAndDataMap = {};
    categories.forEach((category) => { this.featureCategoryAndDataMap[category] = []});
  }

  let populatefeatureCategoryAndDataMap = (datum, category) => {
    this.featureCategoryAndDataMap[category].push(datum[category]);
  }

  let initialize = (data, categories) => {
    initializeFeatureCategoryAndDataMap(categories);
    data.forEach((datum) => {
      categories.forEach((category) => {
        populateDataTypeMap(datum, category);
        populatefeatureCategoryAndDataMap(datum, category);
        this.allXValues.push(datum['x']);
        this.allYValues.push(datum['y']);
      })
    });
  }

  this.featureIsNumeric = (columnName) => {
    return dataTypeMap[columnName] === 'numeric';
  }

  // guard against default category value being passed in
  let categoryList = categories.filter((category) => {
    return category.toLowerCase() !== 'select'
  });
  initialize(data, categoryList);
}