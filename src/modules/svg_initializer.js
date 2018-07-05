import * as d3 from "d3";
import { lasso } from 'd3-lasso';

import { height, margin, width } from './constants.js';
import { classify, benchmark, tabulate } from './table_creator.js';
import {
  featureToColorValueTranslator,
  queryParams,
  searchDic,
  flattenArray
} from './utilities';
import { plotOptionsReader } from './plot_options_reader.js';


function LassoInitializer(svg, color, axisArtist, allXValues, allYValues, categories, featureCategoryAndDataMap, columns, shapeGenerator) {
  this.svg = svg;
  var [smallDotSize, largeDotSize] = [3, 6.5];
  var [smallShapeSize, largeShapeSize] = [30, 180];
  var [xMax, xMin] = [axisArtist.xMax, axisArtist.xMin];
  var [yMax, yMin] = [axisArtist.yMax, axisArtist.yMin];
  let featureToColor = plotOptionsReader.getFeatureToColor();
  let featureToColorValue = featureToColorValueTranslator();

  // *************************************
  // UTILITY FUNCTIONS
  // *************************************

  let removeTable = () => {
    d3.select("table").remove();
    document.getElementById("demo3").innerHTML = "";
  };

  let dataAreShapes = (selectedData) => {
    if (selectedData.node() === null) {
      return;
    }
    return selectedData.node().getAttribute('class').split(" ").includes("point");
  }

  let setDatapointSize = (data, enlarge) => {
    if (dataAreShapes(data)) {
      return data.attr('d', (datum) => {
        return d3.symbol()
                 .type(shapeGenerator.shapeType(datum))
                 .size(enlarge ? largeShapeSize : smallShapeSize)()
      })
    } else {
      return data.attr('r', enlarge ? largeDotSize : smallDotSize);
    }
  }

  let datapointIsSelected = (dot) => {
    return dot.getAttribute('class').split(' ').includes('selected');
  }
  let datapointNotSelected = (dot) => {
    return !dot.getAttribute('class').split(' ').includes('selected');
  }

  let parseDataSelection = (lasso) => {
    var selectedNodes, notSelectedNodes;
    let multipleClusterSelectionEnabled = window.event.shiftKey;
    if (multipleClusterSelectionEnabled) {
      selectedNodes = flattenArray([
        lasso.selectedItems().nodes(),
        lasso.notSelectedItems().nodes().filter(datapointIsSelected)
      ])
      notSelectedNodes = flattenArray([
        lasso.notSelectedItems().nodes().filter(datapointNotSelected)
      ])
    } else {
      selectedNodes = lasso.selectedItems().nodes()
      notSelectedNodes = lasso.notSelectedItems().nodes()
    }
    return [d3.selectAll(selectedNodes), d3.selectAll(notSelectedNodes)]
  }

  // *************************************
  // LASSO AREA AND CALLBACKS
  // *************************************

  let createLassoArea = () => {
    return this.svg.append("rect")
                   .classed('lasso-area', true)
                   .attr("width", width)
                   .attr("height", height)
                   .style("opacity", 0);
  };

  let lassoStart = () => {
    removeTable();
    let items = this.lasso.items()
                          .style("fill", null) // clear all of the fills (greys out)
    if (window.event.shiftKey) {
      return;
    } else {
      items.classed("not_possible", true)
           .classed("selected", false); // style as not possible
      setDatapointSize(items, false)
    }
  };

  let lassoDraw = () => {
    // Style the possible dots
    this.lasso.possibleItems()
              .classed("not_possible", false)
              .classed("possible", true);

    // Style the not possible dot
    this.lasso.notPossibleItems()
              .classed("not_possible", true)
              .classed("possible", false)
              .style("stroke", "#000");
  };

  let lassoEnd = () => {
    var [selectedDatapoints, notSelectedDatapoints] = parseDataSelection(this.lasso);
    // Reset the color of all dots
    this.lasso.items()
              .style("fill", (dot) => (color(featureToColorValue(dot))));
    // Style the selected data
    selectedDatapoints.classed("not_possible", false)
                      .classed("possible", false);
    setDatapointSize(selectedDatapoints, true);

    // Reset the style of the not selected data (we made them 0.5 smaller)
    notSelectedDatapoints.classed("not_possible", false)
                         .classed("possible", false)
                         .style("stroke", "#000");
    setDatapointSize(notSelectedDatapoints, false);

    selectedDatapoints.classed('selected', true);
    let selectedData = selectedDatapoints.data();

    // render the table for the points selected by lasso
    if (selectedData.length > 0) {
      console.log("Rendering table...");
      tabulate(selectedData, columns);
      if (queryParams.get('semantic_model') === "true") {
        console.log("Predicting words...");
        classify(selected_data_indices, vectorspace_2darray, weights_2darray, biases_1darray, vocab_1darray);
        benchmark(selected_data_indices, bow_2darray, vocab_1darray);
      }
    }
  };

  d3.lasso = lasso;

  this.lasso = d3.lasso()
                 .closePathDistance(75) // max distance for the lasso loop to be closed
                 .closePathSelect(true) // can items be selected by closing the path?
                 .hoverSelect(true) // can items by selected by hovering over them?
                 .targetArea(createLassoArea()) // area where the lasso can be started
                 .on("start", lassoStart.bind(this)) // lasso start function
                 .on("draw", lassoDraw.bind(this)) // lasso draw function
                 .on("end", lassoEnd.bind(this)) // lasso end function

  this.initialize = () => {
    return this.lasso;
  }
}

export function SvgInitializer (color, axisArtist, allXValues, allYValues, categories, featureCategoryAndDataMap, columns, shapeGenerator) {
  this.svg = d3.select("body")
               .select('div.plot-container')
               .append("svg")
               .attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom)
               .append("g")
               .attr("transform",`translate(${margin.left}, ${margin.top})`);

  this.lasso = new LassoInitializer(this.svg, color, axisArtist, allXValues, allYValues, categories, featureCategoryAndDataMap, columns, shapeGenerator).initialize();
  this.initializeWithLasso = () => {
    // Init the lasso object on the svg:g that contains the dots
    this.svg.call(this.lasso);
    return this.svg;
  };

}

