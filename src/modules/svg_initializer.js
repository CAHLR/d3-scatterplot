import { height, margin, width } from './constants.js';
import { classify, benchmark, tabulate } from './table_creator.js';
import { searchDic, queryParams } from './utilities';
import { plotOptionsReader } from './plot_options_reader.js';


function LassoInitializer(svg, color, x_max, x_min, y_max, y_min, allXValues, allYValues, categories, dict1, columns) {
  this.svg = svg;
  let featureToColor = plotOptionsReader.getFeatureToColor();

  // *************************************
  // UTILITY FUNCTIONS
  // *************************************

  let removeTable = () => {
    d3.select("table").remove();
    document.getElementById("demo3").innerHTML = "";
  };

  // *************************************
  // LASSO AREA AND CALLBACKS
  // *************************************

  let createLassoArea = () => {
    return this.svg.append("rect")
                   .attr("width", width)
                   .attr("height", height)
                   .style("opacity", 0);
  };

  let lassoStart = () => {
    removeTable();
    this.lasso.items()
         .attr("r", 3.5) // reset size
         .style("fill", null) // clear all of the fills (greys out)
         .classed({ "not_possible": true, "selected": false }); // style as not possible
  };

  let lassoDraw = () => {
    // Style the possible dots
    this.lasso.items()
         .filter((d) => (d.possible === true))
         .classed({ "not_possible": false, "possible": true });

    // Style the not possible dot
    this.lasso.items()
         .filter((d) => (d.possible===false))
         .classed({ "not_possible": true, "possible": false })
         .style("stroke", "#000");
  };

  let lassoEnd = () => {
    // Reset the color of all dots
    this.lasso.items()
              .style("fill", (dot) => (color(dot[featureToColor])));

    // Style the selected dots
    this.lasso.items()
              .filter((dot) => ( dot.selected === true ))
              .classed({ "not_possible": false, "possible": false })
              .attr("r", 6.5);

    // Reset the style of the not selected dots (we made them 0.5 smaller)
    this.lasso.items()
              .filter((dot) => ( dot.selected === false ))
              .classed({ "not_possible": false, "possible": false })
              .attr("r", 3)
              .style("stroke", "#000");

    let selectedDots = this.lasso.items()
                                 .filter((dot) => (dot.selected === true))[0];
    let selectedData = selectedDots.map((dot) => (dot.__data__));

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

  this.lasso = d3.lasso()
        .closePathDistance(75) // max distance for the lasso loop to be closed
        .closePathSelect(true) // can items be selected by closing the path?
        .hoverSelect(true) // can items by selected by hovering over them?
        .area(createLassoArea()) // area where the lasso can be started
        .on("start", lassoStart) // lasso start function
        .on("draw", lassoDraw) // lasso draw function
        .on("end", lassoEnd); // lasso end function

  this.initialize = () => {
    return this.lasso;
  }
}

export function SvgInitializer (color, x_max, x_min, y_max, y_min, allXValues, allYValues, categories, dict1, columns) {
  this.svg = d3.select("body")
               .select('div.plot-container')
               .append("svg")
               .attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom)
               .append("g")
               .attr("transform",`translate(${margin.left}, ${margin.top})`);

  this.lasso = new LassoInitializer(this.svg, color, x_max, x_min, y_max, y_min, allXValues, allYValues, categories, dict1, columns).initialize();
  this.initializeWithLasso = () => {
    // Init the lasso object on the svg:g that contains the dots
    this.svg.call(this.lasso);
    return this.svg;
  };

}

