// *******************************************
// Imports
// *******************************************

import { classify, benchmark, tabulate } from './modules/table_creator.js';
import { tooltip1 } from './modules/tooltips.js';
import { getParameterByName, queryParams, searchDic } from './modules/utilities.js';
import { plotOptionsReader } from './modules/plot_options_reader.js';
import { d3_category20_shuffled, height, width } from './modules/constants.js';
import { DotsArtist } from './modules/dots_artist.js';
import { ShapesArtist } from './modules/shapes_artist.js';
import { AxisArtist } from './modules/axis_artist.js';
import {
  DefaultLegendGenerator,
  SpectrumLegendGenerator,
  ShapeLegendGenerator
} from './modules/legend_generators.js';
import { SpectrumGenerator } from './modules/spectrum_generator.js';
import { SvgInitializer } from './modules/svg_initializer.js';
import { DropdownBuilder } from './modules/dropdown_builder.js';

// *******************************************
// Begin Script
// *******************************************

export const dataset = queryParams.get("dataset") || "joined_data.csv";


var weights_2darray = [], biases_1darray = [], vocab_1darray = [], vectorspace_2darray = [], bow_2darray = [];
// Semantic model option set up
if (queryParams.get("semantic_model") === "true") {
  console.log('Using semantic model.\nGetting matrices...');
  var weightsfile = dataset.split(/\.t[a-z]{2}$/)[0]+'_weights.txt';
  var biasesfile = dataset.split(/\.t[a-z]{2}$/)[0]+'_biases.txt';
  var vocabfile = dataset.split(/\.t[a-z]{2}$/)[0]+'_vocab.txt';
  var vectorfile = 'VS-' + dataset.split("_semantic")[0]+'.txt';
  var bowfile = dataset.split(/\.t[a-z]{2}$/)[0]+'_bow.txt';

  d3.tsv(bowfile, function(text){
    console.log("Reading " + bowfile);
    bow_2darray = text.map( Object.values );
    bow_2darray = bow_2darray.map(function(entry) {
      return entry.map(function(elem) {
        return Math.round(parseFloat(elem));
      });
    });
  });

  d3.tsv(vectorfile, function(text){
    console.log("Reading " + vectorfile);
    vectorspace_2darray = text.map( Object.values );
    vectorspace_2darray = vectorspace_2darray.map(function(arr) {
            // username column ends up last in the dictionary, due to alphanumeric sort
            return arr.slice(0,-1).map(function(elem) {
              return parseFloat(elem);
            });
          });
    console.log(vectorspace_2darray);
  });
  d3.tsv(weightsfile, function(text){
    console.log("Reading " + weightsfile);
    weights_2darray = text.map( Object.values );
    weights_2darray = weights_2darray.map(function(entry) {
      return entry.map(function(elem) {
        return parseFloat(elem);
      });
    });
    console.log(weights_2darray);
  });
  d3.tsv(biasesfile, function(text){
    console.log("Reading " + biasesfile);
    biases_1darray = text.map( Object.values );
    biases_1darray = Object.values(biases_1darray.map(Number));
    console.log(biases_1darray);
  });
  d3.tsv(vocabfile, function(text){
    console.log("Reading " + vocabfile);
    vocab_1darray = text.map( Object.values );
    vocab_1darray = Object.values(vocab_1darray.map(String));
    console.log(vocab_1darray);
  });
}

// categories stores the name of all the columns
var categories = [];
let defaultValue = 'Select';
categories.push(defaultValue);
// Not sure this is really what we want -- if you enter the wrong parameter value,
// it may make things screwy...we can probably make it a bit more fault tolerant
if (queryParams.get("color")) categories.push(queryParams.get("color"));

// category_search stores the name of column according to which searching is to be done
var category_search_data = [];

// check whether the searching column is provided in the url or not
let category_search = queryParams.get("search");
if (category_search) category_search_data.push(category_search);

// setup fill color
// color_column stores the name of column according to which coloring is to be done
// check whether the coloring column is provided in the url or not
let color_column = queryParams.get("color") || "Select";

// categories_copy_color is just the copy of categories
var categories_copy_color = [];
categories_copy_color.push(color_column);

var columns = [];
let mainData;
let needZoom = false;

function extractCategoryLabelsFromData(data) {
  console.log('Loading main data')
  function extractCategoryHeaders(data) {
    let categoryHeadersFromFirstRowOfData = [];
    categoryHeadersFromFirstRowOfData = Object.keys(data[0]);
    // remove x and y
    categoryHeadersFromFirstRowOfData.splice(
      categoryHeadersFromFirstRowOfData.indexOf('x'), 1
    );
    categoryHeadersFromFirstRowOfData.splice(
      categoryHeadersFromFirstRowOfData.indexOf('y'), 1
    );
    return categoryHeadersFromFirstRowOfData;
  }
  let categoryHeaders = extractCategoryHeaders(data);

  for(var i=0;i<categoryHeaders.length;i++) {
    if (categoryHeaders[i] != category_search) {
      category_search_data.push(categoryHeaders[i]);
    }
  }

  for(var i=0;i<categoryHeaders.length;i++) {
    // color_column already pushed
    if (categoryHeaders[i] != color_column) {
      categories.push(categoryHeaders[i]);
      categories_copy_color.push(categoryHeaders[i]);
    }
    columns.push(categoryHeaders[i]);
  }
  let dropdownBuilder = new DropdownBuilder();
  dropdownBuilder.build(category_search_data, categories_copy_color, categories);
  dropdownBuilder.setDropdownEventHandlers(plotting, plotting5);
  mainData = data;

  // Initial plot draw happens here:
  highlighting(mainData, needZoom)
};

// getting header from csv file to make drowdown menus
// NOTE: tsv() is an async function
d3.tsv(dataset, extractCategoryLabelsFromData);

// function to call for change event
// Coloring
function plotting(){
  needZoom = false;
  highlighting(mainData, needZoom);
}

// function to call for change event
// Shaping
function plotting5(){
  needZoom = false;
  highlighting(mainData, needZoom);
}

// search event
// it will be executed when search button is pressed and points that matches the searched string will be highlighted
function searchEventHandler(event) {
  console.log(document.getElementById("searchText").value);
  needZoom = false;
  highlighting(mainData, needZoom);
  return false;
}
function searchExactMatchEventHandler(event) {
  if (document.getElementById("searchText").value) searchEventHandler();
}

// transparent event
// it will be executed when Transparent button is pressed and points that satisfies the condition will be highlighted
function transparentSearchEventHandler(event) {
  console.log(document.getElementById("transpText").value);
  needZoom = false;
  highlighting(mainData, needZoom);
  return false;
}
function handleCheck1(event) {
  if (document.getElementById("transpText").value) {
    transparentSearchEventHandler();
  }
}

// spectrum / log event
// it will be executed when spectrum/log is checked
// ?? Can we collapse transparentSearchEventHandler,3,4?
function spectrumAndLogColoringEventHandler(event) {
  needZoom = false;
  highlighting(mainData, needZoom);
}

// it will be executed when (?? draw and) zoom button is pressed and the plot will zoomed out according to the points obtained by mouse click event
function zoomEventHandler(){
  if (plotOptionsReader.zoomCheckboxEnabled() === false) {
    document.getElementById("zoomxy").value = ""; // clear the textbox
  }
  needZoom = true;
  highlighting(mainData, needZoom);
}

(function setEventHandlers() {
  let zoomButton = plotOptionsReader.getZoomButton();
  zoomButton.onclick = zoomEventHandler;

  let colorOptions = plotOptionsReader.getColorOptions();
  for (let i = 0; i < 2; i++) {
    colorOptions[i].onclick = spectrumAndLogColoringEventHandler;
  };


  let searchFormButton = plotOptionsReader.getSearchButton();
  searchFormButton.addEventListener('click', (event) => {
    event.preventDefault();
    searchEventHandler();
  });

  let transparentSearchButton = plotOptionsReader.getTransparentSearchButton();
  transparentSearchButton.addEventListener('click', (event) => {
    event.preventDefault();
    transparentSearchEventHandler();
  });

  // AJF note: currently, I'm disabling the checkbox event handlers as I think
  // they are disruptive to the UX of working with the tool

  // let searchExactMatchCheckbox = document.getElementsByClassName('search-exact-match')[0];
  // searchExactMatchCheckbox.onclick = searchExactMatchEventHandler;

  // let transparencyExactMatch = document.getElementsByClassName('transparency-exact-match')[0];
  // transparencyExactMatch.addEventListener('change', (event) => {
  //   event.preventDefault();
  //   transparentSearchEventHandler();
  // });
})()

let coordinatesx = [];
let coordinatesy = [];

// function for plotting
function highlighting(data, needZoom) {
  let uniqueDataValuesToShape = [];
  let spectrumGenerator;
  var xValues = [], yValues = [], searchColumnValues = [];
  var featureCategoryAndDataMap = {};
  console.log('main data', data);

  // remove the existing svg plot if any and clear side table
  document.getElementById("demo3").innerHTML = "";
  document.getElementById("predicted_words").innerHTML = "";
  document.getElementById("frequent_words").innerHTML = "";
  d3.select("svg").remove();
  d3.select("table").remove();

  // What is numerics doing?
  // We want to ask the question of a given data point -- is the data associated
  // with it numerical or is it other (e.g. categorical or ordinal, is the format a string?)
  // Can we generate an object that will encapsulate this information and allow us
  // to query it with a category name?

  let shapingColumn = plotOptionsReader.getFeatureToShape();
  let searchCategory = plotOptionsReader.getSearchCategory();
  let featureToColor = plotOptionsReader.getFeatureToColor();
  let color;

  // change string (from CSV) into number format
  var numerics = {};
  //Omitting Select (0)
  for(var i=1;i<categories.length;i++) {
    // initialize the value for each category key to empty list
    featureCategoryAndDataMap[categories[i]] = [];
    // initialize all categories as numeric
    numerics[categories[i]] = 1;
  }
  let counter = 0;
  data.forEach(function(d) {
    // coerce the data to numbers
    d.x = +d.x;
    d["y"] = +d["y"];

    for(var i=1;i<categories.length;i++){
      // add every attribute of point to the {category:[val1,val2,...]}
      featureCategoryAndDataMap[categories[i]].push(d[categories[i]]);
      // revoke a category's numerics status if find an entry has a non-Int or non-null value for that category
      numerics[categories[i]] = numerics[categories[i]] && (d[categories[i]] == "" || d[categories[i]] == parseFloat(d[categories[i]]));
    }
    // fill the symbol dictionary with all possible values of the shaping column as keys
    // value is the order of points
    if (uniqueDataValuesToShape.indexOf(d[shapingColumn]) === -1) {
      uniqueDataValuesToShape.push(d[shapingColumn]);
    }
    // push all x values, y values, and all category search values into xValues/2/3
    xValues.push(d.x);
    yValues.push(d["y"]);
    searchColumnValues.push(d[searchCategory]);
    // console.log(d["z"] == parseInt(d["z"]));
  });
  console.log("Numerics: ", numerics);

  // set color according to spectrum
  if (numerics[featureToColor] && document.getElementById('cbox1').checked) {
    console.log('using spectrum');
    spectrumGenerator = new SpectrumGenerator(data);
    color = spectrumGenerator.color;
  } else {
    console.log('not using spectrum');
    color = d3.scale.ordinal().range(d3_category20_shuffled);
  }

  let axisArtist = new AxisArtist(data, needZoom, coordinatesx, coordinatesy);
  let svgInitializer = new SvgInitializer(color, axisArtist.xMax, axisArtist.xMin, axisArtist.yMax, axisArtist.yMin, xValues, yValues, categories, featureCategoryAndDataMap, columns);
  let svg = svgInitializer.initializeWithLasso();
  let lasso = svgInitializer.lasso;
  axisArtist.draw(svg);
  svg.on("click",function() {
    // svg.select("#myText").remove();

    tooltip1.style("opacity", 0);
    var coordinates1 = d3.mouse(this);
    coordinatesx.unshift(coordinates1[0]);
    coordinatesy.unshift(coordinates1[1]);
    console.log(coordinatesx, coordinatesy);
  })


  // searching according to the substring given and searching column

  var searchFunc1 = function(d) {
    if (typeof d == 'undefined' ) {
      return 1;
    }
    // noMatch true if not found
    var noMatch;
    if (document.getElementById('cbox5').checked) {
      noMatch = d !== plotOptionsReader.getSearchText();
    } else {
      noMatch = d.toLowerCase().indexOf(plotOptionsReader.getSearchText().toLowerCase()) < 0
      || plotOptionsReader.getSearchText().length === 0;
    }
    return noMatch ? 1 : 2;
  };

  var searched_data = [], searched_data_indices = [], d_temp;
  /* searchColumnValues holds the value of every point for the search column */
  for (var i=0;i<searchColumnValues.length;i++) {
    // 0 if found val in this point, 1 if not found
    if ( searchFunc1(searchColumnValues[i])-1 ) {
      d_temp = {};
      // enter all data into dictionary
      for(var j=1;j<categories.length;j++) {
        d_temp[categories[j]] = featureCategoryAndDataMap[categories[j]][i];
      }
      // only add to searched_data if not already in
      if(searchDic(searched_data, d_temp) === true) {
        searched_data.push(d_temp);
        searched_data_indices.push(i);
      }
    }
  }
  // create the table
  if ( plotOptionsReader.getSearchText() != "" && searched_data.length > 0) {
    var peopleTable1 = tabulate(searched_data, columns);
    if (queryParams.get('semantic_model') === "true") {
      console.log("Predicting words...");
      classify(searched_data_indices, vectorspace_2darray, weights_2darray, biases_1darray, vocab_1darray);
      benchmark(searched_data_indices, bow_2darray, vocab_1darray);
    }
  };

  /*** BEGIN drawing dots ***/
  // shaping of symbols according to the shaping column
  if (shapingColumn !== "Select" ) {
    let shapesArtist = new ShapesArtist(
      {
        svg: svg,
        data: data,
        categorySearchData: category_search_data,
        uniqueDataValuesToShape: uniqueDataValuesToShape,
        color: color
      }
    )
    shapesArtist.drawUnmatchedShapes();
    shapesArtist.drawMatchedShapes();
    new ShapeLegendGenerator(uniqueDataValuesToShape).generate(svg);
    lasso.items(d3.selectAll(".dot"));
  } else {
    let dotsArtist = new DotsArtist(
      {
        svg: svg,
        data: data,
        categorySearchData: category_search_data,
        color: color
      }
    )
    dotsArtist.drawUnmatchedDots();
    dotsArtist.drawMatchedDots();
    lasso.items(d3.selectAll(".dot"));
  }

  // if coloring
  if (featureToColor !== "Select") {
    if (numerics[featureToColor] && document.getElementById('cbox1').checked) {
      new SpectrumLegendGenerator(svg, spectrumGenerator).generate();
    } else {
      new DefaultLegendGenerator(svg, color).generate();
    }
  };
} // end highlighting