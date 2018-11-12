// *******************************************
// Imports
// *******************************************
// ****** CSS
import style from './css/style.css';
import nouisliderStyle from './css/nouislider.css';

import { AxisArtist } from './modules/axis_artist.js';
import { d3_category20_shuffled, height, width } from './modules/constants.js';
import * as d3 from "d3";
import { DataManager } from './modules/data_manager.js';
import { DotsArtist } from './modules/dots_artist.js';
import { DropdownBuilder } from './modules/dropdown_builder.js';
import { FilterScrubber } from './modules/filter_scrubber.js';
import { FilterService } from './modules/filter_service.js';
import {
  DefaultLegendGenerator,
  SpectrumLegendGenerator,
  ShapeLegendGenerator
} from './modules/legend_generators.js';
import { plotOptionsReader } from './modules/plot_options_reader.js';
import { SearchDataManager } from './modules/search_data_manager.js';
import { ShapesArtist } from './modules/shapes_artist.js';
import { ShapeGenerator } from './modules/shape_generator.js';
import { SpectrumGenerator } from './modules/spectrum_generator.js';
import { SvgInitializer } from './modules/svg_initializer.js';
import { classify, benchmark, tabulate } from './modules/table_creator.js';
import { tooltip, initialTooltipState, tooltipHTMLContent } from './modules/tooltips.js';
import { TransparencyService } from './modules/transparency_service.js';
import { preSelectCheckboxValues, preSelectDropdownValues, queryParams, searchDic } from './modules/utilities.js';
import { ZoomService } from './modules/zoom_service.js';

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

// categorySearch stores the name of column according to which searching is to be done
var categorySearchData = [];

// check whether the searching column is provided in the url or not
let categorySearch = queryParams.get("search");
if (categorySearch) categorySearchData.push(categorySearch);

var columns = [];
let mainData;
let dataManager;
let filterScrubber;

function loadMainData(data) {
  console.log('Loading main data');
  let categoryHeaders = data.columns.filter(cat => cat !== 'x' && cat !== 'y');
  categoryHeaders.forEach((categoryHeader) => {
    if (categoryHeader !== categorySearch) {
      categorySearchData.push(categoryHeader);
    }
    categories.push(categoryHeader);
    columns.push(categoryHeader);
  });
  mainData = data.map((datum) => {
    datum['x'] = +datum['x'];
    datum['y'] = +datum['y'];
    return datum;
  });
  dataManager = new DataManager(mainData, categories);
  filterScrubber = new FilterScrubber(dataManager, categories).mount();

  tooltip.html(initialTooltipState(categorySearchData));
  let dropdownBuilder = new DropdownBuilder();
  dropdownBuilder.build(categorySearchData, categories);
  dropdownBuilder.setDropdownEventHandlers(redrawPlotWithoutZoom);

  preSelectCheckboxValues();
  preSelectDropdownValues(categories, categorySearchData);

  // Initial plot draw happens here:
  let needZoom = false;
  highlighting(mainData, needZoom);
};

// NOTE: tsv() is an async function
console.log('initiating dataset load;');
let fetchPromise = d3.tsv(dataset);
fetchPromise.then(loadMainData).catch(e => console.log(e));


function searchExactMatchEventHandler(event) {
  if (document.getElementById("searchText").value) redrawPlotWithoutZoom();
}

function resetPlotEventHandler() {
  let needZoom = false;
  highlighting(mainData, needZoom);
}

function redrawPlotWithoutZoom() {
  let needZoom = false;
  let filteredData = TransparencyService.filter(mainData);
  highlighting(filteredData, needZoom);
}

function filterEventHandler() {
  let needZoom = false;
  let filteredData = TransparencyService.filter(mainData);
  let featureFilteredData = FilterService.filter(filteredData);
  highlighting(featureFilteredData, needZoom);
}

function zoomEventHandler(){
  if (plotOptionsReader.zoomCheckboxEnabled() === false) {
    document.getElementsByClassName("zoomxy")[0].innerText = ""; // clear the textbox
  }
  let needZoom = true;
  let filteredData = TransparencyService.filter(mainData);
  let zoomFilteredData = ZoomService.filter(filteredData, coordinatesx, coordinatesy);
  highlighting(zoomFilteredData, needZoom);
}

(function setEventHandlers() {
  let zoomButton = plotOptionsReader.getZoomButton();
  zoomButton.onclick = zoomEventHandler;

  let resetButton = plotOptionsReader.getResetButton();
  resetButton.onclick = resetPlotEventHandler;

  let filterButton = plotOptionsReader.getFilterByValueButton();
  filterButton.onclick = filterEventHandler;

  document.addEventListener('scrubberMounted', () => {
    plotOptionsReader.getFilterByValueSlider().on('update', () => {
      if ( plotOptionsReader.getLiveUpdateToggled()) {
        filterEventHandler();
      }
    })
  });

  let colorOptions = plotOptionsReader.getColorOptions();
  for (let i = 0; i < 2; i++) {
    colorOptions[i].onclick = redrawPlotWithoutZoom;
  };


  let searchFormButton = plotOptionsReader.getSearchButton();
  searchFormButton.addEventListener('click', (event) => {
    event.preventDefault();
    redrawPlotWithoutZoom();
  });

  let transparentSearchButton = plotOptionsReader.getTransparentSearchButton();
  transparentSearchButton.addEventListener('click', (event) => {
    event.preventDefault();
    redrawPlotWithoutZoom();
  });
})();

var coordinatesx = [];
var coordinatesy = [];

// function for plotting
function highlighting(data, needZoom) {
  let uniqueDataValuesToShape = [];
  let spectrumGenerator;
  console.log('main data', data);

  document.getElementById("predicted_words").innerHTML = "";
  document.getElementById("frequent_words").innerHTML = "";
  d3.select("svg").remove();
  d3.select(".summary-data").remove();

  let shapingColumn = plotOptionsReader.getFeatureToShape();
  let searchCategory = plotOptionsReader.getSearchCategory();
  let featureToColor = plotOptionsReader.getFeatureToColor();
  let color;

  data.forEach(function(d) {
    // fill the symbol dictionary with all possible values of the shaping column as keys
    // value is the order of points
    if (uniqueDataValuesToShape.indexOf(d[shapingColumn]) === -1) {
      uniqueDataValuesToShape.push(d[shapingColumn]);
    }
  });
  let shapeGenerator = new ShapeGenerator(uniqueDataValuesToShape);

  // set color according to spectrum
  if (dataManager.featureIsNumeric(featureToColor) && plotOptionsReader.spectrumEnabled()) {
    console.log('using spectrum');
    spectrumGenerator = new SpectrumGenerator(data);
    color = spectrumGenerator.color;
  } else {
    console.log('not using spectrum');
    color = d3.scaleOrdinal().range(d3_category20_shuffled);
  }

  let axisArtist = new AxisArtist(data, needZoom, coordinatesx, coordinatesy);
  let svgInitializer = new SvgInitializer(
    color,
    axisArtist,
    categories,
    columns,
    shapeGenerator
  );
  let svg = svgInitializer.initializeWithLasso();
  let lasso = svgInitializer.lasso;
  axisArtist.draw(svg);
  svg.on("click",function() {
    var coordinates1 = d3.mouse(this);
    coordinatesx.unshift(coordinates1[0]);
    coordinatesy.unshift(coordinates1[1]);
    console.log(coordinatesx, coordinatesy);
  })

  let searchDataManager = new SearchDataManager(dataManager.featureCategoryAndDataMap, categories);

  // create the table
  if ( plotOptionsReader.getSearchText() !== "" && searchDataManager.searchedData.length > 0) {
    var peopleTable1 = tabulate(searchDataManager.searchedData, columns);
    if (queryParams.get('semantic_model') === "true") {
      console.log("Predicting words...");
      classify(searchDataManager.searchedDataIndices, vectorspace_2darray, weights_2darray, biases_1darray, vocab_1darray);
      benchmark(searchDataManager.searchedDataIndices, bow_2darray, vocab_1darray);
    }
  };

  /*** BEGIN drawing dots ***/
  if (shapingColumn !== "Select" ) {
    let shapesArtist = new ShapesArtist(
      {
        svg: svg,
        data: data,
        categorySearchData: categorySearchData,
        uniqueDataValuesToShape: uniqueDataValuesToShape,
        color: color
      }
    )
    shapesArtist.drawUnmatchedShapes();
    shapesArtist.drawMatchedShapes();
    new ShapeLegendGenerator(uniqueDataValuesToShape).generate(svg);
    lasso.items(d3.selectAll(".point"));
  } else {
    let dotsArtist = new DotsArtist(
      {
        svg: svg,
        data: data,
        categorySearchData: categorySearchData,
        color: color
      }
    )
    dotsArtist.drawUnmatchedDots();
    dotsArtist.drawMatchedDots();
    lasso.items(d3.selectAll(".dot"));
  }

  // if coloring
  if (featureToColor !== "Select") {
    if (dataManager.featureIsNumeric(featureToColor) && plotOptionsReader.spectrumEnabled()) {
      new SpectrumLegendGenerator(svg, spectrumGenerator).generate();
    } else {
      new DefaultLegendGenerator(svg, color).generate();
    }
  };
} // end highlighting
