// *******************************************
// Imports
// *******************************************

// TODO: Currently, we're importing everything into global scope. YUCK.
// But as we disentangle scope violations and figure out better ways of incorporating
// dependency injection, we can start to implement stronger encapsulation and message passing

import { classify, benchmark, tabulate } from './modules/table_creator.js';
import { tooltip1 } from './modules/tooltips.js';
import {
  getParameterByName,
  queryParams,
  searchDic,
  xAxis,
  xScale,
  xValue,
  yAxis,
  yScale,
  yValue
} from './modules/utilities.js';
import { plotOptionsReader } from './modules/plot_options_reader.js';
import {
  d3_category20_shuffled,
  height,
  width
} from './modules/constants.js';
import { DotsArtist } from './modules/dots_artist.js';
import { ShapesArtist } from './modules/shapes_artist.js';
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

  console.log("Reading " + bowfile);
  d3.tsv(bowfile, function(text){
    bow_2darray = text.map( Object.values );
    bow_2darray = bow_2darray.map(function(entry) {
      return entry.map(function(elem) {
        return Math.round(parseFloat(elem));
      });
    });
  });

  console.log("Reading " + vectorfile);
  d3.tsv(vectorfile, function(text){
    vectorspace_2darray = text.map( Object.values );
    vectorspace_2darray = vectorspace_2darray.map(function(arr) {
            // username column ends up last in the dictionary, due to alphanumeric sort
            return arr.slice(0,-1).map(function(elem) {
              return parseFloat(elem);
            });
          });
  });
  console.log("Reading " + weightsfile);
  d3.tsv(weightsfile, function(text){
    weights_2darray = text.map( Object.values );
    weights_2darray = weights_2darray.map(function(entry) {
      return entry.map(function(elem) {
        return parseFloat(elem);
      });
    });
  });
  console.log("Reading " + biasesfile);
  d3.tsv(biasesfile, function(text){
    biases_1darray = text.map( Object.values );
    biases_1darray = Object.values(biases_1darray.map(Number));
  });
  console.log("Reading " + vocabfile);
  d3.tsv(vocabfile, function(text){
    vocab_1darray = text.map( Object.values );
    vocab_1darray = Object.values(vocab_1darray.map(String));
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
// column for the transparent value
var transparent_column = "Select", feature_column = "", shaping_column = "Select";

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
  dropdownBuilder.setDropdownEventHandlers(
                   plotting,
                   plotting2,
                   plotting3,
                   plotting4,
                   plotting5
                 );

  category_search = category_search_data[0];
  shaping_column = categories[0];
  feature_column = category_search_data[0];
  transparent_column = category_search_data[0];
};

// getting header from csv file to make drowdown menus
// NOTE: tsv() is an async function
d3.tsv(dataset, extractCategoryLabelsFromData);

let createColorValue = (targetColumn) => {
  return (data) => {
    return data[targetColumn];
  };
};
// need to rename this function to be more descriptive
let createColorValue2 = (targetColumn) => {
  return (data) => {
    return Math.log(parseFloat(data[targetColumn]));
  };
};
let color = d3.scale.ordinal().range(d3_category20_shuffled);
let colorValueFunction = createColorValue(color_column);
let colorValueFunction2 = createColorValue2(color_column);
// Initial plot draw happens here:
highlighting(colorValueFunction, colorValueFunction2, queryParams.get("q") || "", "", "")

// the functions to call when the value of dropdown menu is changes
// Click on feature
function plotting4(){
  feature_column = d3.event.target.value;
}
// Transparent
function plotting3(){
  transparent_column = d3.event.target.value;
}
// Searching
function plotting2(){
  category_search = d3.event.target.value;
}

// function to call for change event
// Coloring
function plotting(){
  color_column = d3.event.target.value;
  colorValueFunction = createColorValue(color_column);
  colorValueFunction2 = createColorValue2(color_column);
  highlighting(colorValueFunction, colorValueFunction2);
}

// function to call for change event
// Shaping
function plotting5(){
  shaping_column = d3.event.target.value;
  colorValueFunction = createColorValue(color_column);
  colorValueFunction2 = createColorValue2(color_column);
  highlighting(colorValueFunction, colorValueFunction2);
}

var zoomed = 0;
var needZoom = false;
var needDrawCircle = false;

// search event
// it will be executed when search button is pressed and points that matches the searched string will be highlighted
function searchEventHandler(event) {
  console.log(document.getElementById("searchText").value);
  highlighting(colorValueFunction, colorValueFunction2);
  return false;
}
function searchExactMatchEventHandler(event) {
  if (document.getElementById("searchText").value) searchEventHandler();
}

// transparent event
// it will be executed when Transparent button is pressed and points that satisfies the condition will be highlighted
function transparentSearchEventHandler(event) {
  console.log(document.getElementById("transpText").value);
  highlighting(colorValueFunction, colorValueFunction2);
  return false;
}
function handleCheck1(event) {
  if (document.getElementById("transpText").value) {
    transparentSearchEventHandler();
  }
}

// ?? I believe this function is unused, and draw also maps to zoomEventHandler
// it will be executed when Draw button is pressed and the plot will highlight those points that covers fixed percentage of point from the point obtained by mouse click
function handleClick2(event){
  shaping_column = "Select";
  color_column = "Select";
  myForm.searchText.value = 0;
  myForm1.transpText.value = 0;
  myForm1.opacityMatch.value = 0;
  myForm1.opacityNoMatch.value = 0;
  shapingDropdown.property( "value", "Select" );
  dropDown.property( "value", "Select" );
  highlighting(colorValueFunction, colorValueFunction2, "", "", "");
  return false;
}

// spectrum / log event
// it will be executed when spectrum/log is checked
// ?? Can we collapse transparentSearchEventHandler,3,4?
function spectrumAndLogColoringEventHandler(event) {
  highlighting(colorValueFunction, colorValueFunction2);
}

// it will be executed when (?? draw and) zoom button is pressed and the plot will zoomed out according to the points obtained by mouse click event
function zoomEventHandler(){
  if (plotOptionsReader.zoomCheckboxEnabled() === false) {
    document.getElementById("zoomxy").value = ""; // clear the textbox
  }
  needZoom = true;
  highlighting(colorValueFunction, colorValueFunction2);
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
function highlighting(cValue, cValue2) {
  let uniqueDataValuesToShape = [];

  let x_max, x_min, y_max, y_min, spectrumGenerator;
  var temp1 = [], temp2 = [], temp3 = [];
  var dict1 = {};

  // to remove the existing svg plot if any and clear side table
  document.getElementById("demo3").innerHTML = "";
  document.getElementById("predicted_words").innerHTML = "";
  document.getElementById("frequent_words").innerHTML = "";
  d3.select("svg").remove();
  d3.select("table").remove();

  d3.tsv(dataset, function(error, data) {
    // AJF Note: it'd be nice to load the data once and then pass the data into the 
    // highlighting function
    console.log('Loading main data, again') // load data
    // change string (from CSV) into number format
    var numerics = {};
    //Omitting Select (0)
    for(var i=1;i<categories.length;i++) {
      // initialize the value for each category key to empty list
      dict1[categories[i]] = [];
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
        dict1[categories[i]].push(d[categories[i]]);
        // revoke a category's numerics status if find an entry has a non-Int or non-null value for that category
        numerics[categories[i]] = numerics[categories[i]] && (d[categories[i]] == "" || d[categories[i]] == parseFloat(d[categories[i]]));
      }
      // fill the symbol dictionary with all possible values of the shaping column as keys
      // value is the order of points
      if (uniqueDataValuesToShape.indexOf(d[shaping_column]) === -1) {
        uniqueDataValuesToShape.push(d[shaping_column]);
      }
      // push all x values, y values, and all category search values into temp1/2/3
      temp1.push(d.x);
      temp2.push(d["y"]);
      temp3.push(d[category_search]);
      // console.log(d["z"] == parseInt(d["z"]));
    });
    console.log("Numerics: ", numerics);
    console.log("Color Column: ",color_column);
    // set color according to spectrum
    if (numerics[color_column] && document.getElementById('cbox1').checked) {
      console.log('using spectrum');
      spectrumGenerator = new SpectrumGenerator(data);
      color = spectrumGenerator.color;
    } else {
      console.log('not using spectrum');
      color = d3.scale.ordinal().range(d3_category20_shuffled);
    }

    // don't want dots overlapping axis, so add in buffer to data domain
    var zoom = getParameterByName('Zoom'); // unused, capitalized Z anyway as changed above

    if (document.getElementById("cbox3").checked==false) {
      document.getElementById("zoomxy").value = "";
      zoomed = 0;
      needZoom = false;
      x_max = d3.max(data, xValue)+1;
      x_min = d3.min(data, xValue)-1;
      y_max = d3.max(data, yValue)+1;
      y_min = d3.min(data, yValue)-1;
    }

    // if zoom is checked and conditions are satisfied
    if (document.getElementById("cbox3").checked==true  && needZoom == true && coordinatesx.length >= 2) {

      x_max = xScale.invert(Math.max(coordinatesx[0], coordinatesx[1]))+1;
      x_min = xScale.invert(Math.min(coordinatesx[0], coordinatesx[1]))-1;
      y_max = yScale.invert(Math.min(coordinatesy[0], coordinatesy[1]))+1;
      y_min = yScale.invert(Math.max(coordinatesy[0], coordinatesy[1]))-1;

      console.log(x_max, x_min, y_max, y_min);
      document.getElementById("zoomxy").value = "X:["+parseInt(x_min)+", "+parseInt(x_max)+"] Y:["+parseInt(y_min)+", "+parseInt(y_max)+"]";

      zoomed = 1;
      needZoom = false;
            // document.getElementById("cbox3").checked = false;
            /*
                      zoom = zoom.substr(1, zoom.length-2);
                      commaIndex = zoom.indexOf(',');
                      x_min = parseFloat(zoom.substr(0, commaIndex));
                      zoom = zoom.substr(commaIndex+1);
                      commaIndex = zoom.indexOf(',');
                      x_max = parseFloat(zoom.substr(0, commaIndex));
                      zoom = zoom.substr(commaIndex+1);
                      commaIndex = zoom.indexOf(',');
                      y_min = parseFloat(zoom.substr(0, commaIndex));
                      y_max = parseFloat(zoom.substr(commaIndex+1));
                      */
    }
    xScale.domain([x_min, x_max]);
    yScale.domain([y_min, y_max]);

    // xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    // yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);


    // I know it looks ugly injecting so many arguments into the initializer right now,
    // but at least we're being explicit about dependencies as opposed to
    // implicit/throwing everything into global state
    let svgInitializer = new SvgInitializer(color, color_column, x_max, x_min, y_max, y_min, temp1, temp2, categories, dict1, columns);
    let svg = svgInitializer.initializeWithLasso();
    let lasso = svgInitializer.lasso;

    // x-axis
    let cx = 0;
    let cy = 0;
    let ans = 0;

    // draw the x-axis of plot
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("");

    // draw the y-axis of plot
    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("");

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
    /* temp3 holds the value of every point for the search column */
    for (var i=0;i<temp3.length;i++) {
      // 0 if found val in this point, 1 if not found
      if ( searchFunc1(temp3[i])-1 ) {
        d_temp = {};
        // enter all data into dictionary
        for(var j=1;j<categories.length;j++) {
          d_temp[categories[j]] = dict1[categories[j]][i];
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
    if (shaping_column !== "Select" ) {
      let shapesArtist = new ShapesArtist(
        {
          svg: svg,
          data: data,
          categorySearch: category_search,
          categorySearchData: category_search_data,
          uniqueDataValuesToShape: uniqueDataValuesToShape,
          color: color,
          cValue2: cValue2,
          cValue: cValue
        }
      )
      shapesArtist.drawUnmatchedShapes();
      shapesArtist.drawMatchedShapes();
      lasso.items(d3.selectAll(".dot"));
      new ShapeLegendGenerator(uniqueDataValuesToShape).generate(svg);
    } else {
      let dotsArtist = new DotsArtist(
        {
          svg: svg,
          data: data,
          categorySearch: category_search,
          categorySearchData: category_search_data,
          color: color,
          cValue2: cValue2,
          cValue: cValue
        }
      )
      dotsArtist.drawUnmatchedDots();
      dotsArtist.drawMatchedDots();
      lasso.items(d3.selectAll(".dot"));
    }

    // the event to call on click event
    svg.on("click",function() {
      // svg.select("#myText").remove();

      tooltip1.style("opacity", 0);
      var coordinates1 = d3.mouse(this);
      coordinatesx.unshift(coordinates1[0]);
      coordinatesy.unshift(coordinates1[1]);
      console.log(coordinatesx, coordinatesy);
    })


    // if coloring
    if (color_column !== "Select") {
      if (numerics[color_column] && document.getElementById('cbox1').checked) {
        new SpectrumLegendGenerator(svg, spectrumGenerator).generate();
      } else {
        new DefaultLegendGenerator(svg, color).generate();
      }
    };
  }); // end load data
} // end highlighting