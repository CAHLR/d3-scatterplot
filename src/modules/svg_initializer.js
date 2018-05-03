import { height, margin, width } from './constants.js';
import { classify, benchmark, tabulate } from './table_creator.js';
import { searchDic, queryParams } from './utilities';


function LassoInitializer(svg, color, color_column, x_max, x_min, y_max, y_min, allXValues, allYValues, categories, dict1, columns) {
  this.svg = svg;

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
              .style("fill", (dot) => (color(dot[color_column])));

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

    // ********************************************************************
    // The following code draws the side table using the selection data
    // ********************************************************************
    // AJF annotation
    // The data that we have is multi-dimensional, with X and Y values only two
    // dimensions of the total available per datum.
    // The dimensions that we want to expose/categorize in the side table are
    // those that are not directly plottable on the X-Y axes.
    // This algorithm will:
    // 1) extract the explicit X/Y coordinate values from the selection
    //  a) adjust/scale the x/y values (reason tbd still)
    // 2) find the corresponding points from all the data plotted (all data is sorted)
    // 3) extract the additional dimension data from the corresponding points in all data plotted
    // 4) create an array containing the feature data from the selection and the corresponding index in
    //    all data
    // 5) pass selected data array with additional dimensions to tabulation function to build
    //    side table
    // When possible, see whether it's possible to get algorithm to run under O(n^2)

    // get values for table -> array inside a list
    let selectedDots = this.lasso.items()
                                 .filter((dot) => (dot.selected === true))[0];
    // adjust the x and y values
    let selectedXValues = [];
    let selectedYValues = [];
    for (let i=0; i < selectedDots.length; i++) {
      // From the spec: https://www.w3.org/TR/SVGTiny12/svgudom.html#svg__SVGLocatable_getBBox
      // SVGLocatable.getBBox()
      // Returns a DOMRect representing the computed bounding box of the current element.
      selectedXValues.push(
        (((selectedDots[i].getBBox().x + 6.5) * (x_max - x_min)) / width) + x_min
      );
      selectedYValues.push(
        ((selectedDots[i].getBBox().y + 6.5) * (y_min - y_max)) / height + y_max
      );
    };
    var selected_data=[], selected_data_indices=[];

    // Compare every selected point to all points (tempX)
    // in order to match coordinates with actual data
    for (let ii=0; ii < selectedXValues.length; ii++) {
      console.log("lasso_end gathering selected data");
      console.log(allXValues.length);
      for (let jj=0; jj < allXValues.length; jj++) {
        selectedXValues[ii] = +(selectedXValues[ii].toFixed(3)); // coerce String to Int
        selectedYValues[ii] = +(selectedYValues[ii].toFixed(5)); // coerce String to Int
        // find which data point in the selection corresponds to the data in allData (index jj)
        if ( (selectedXValues[ii] === +(allXValues[jj].toFixed(3))) && (selectedYValues[ii] === +(allYValues[jj].toFixed(5))) ) {
          let all_values = {};
          // set the value
          for (var k=1;k<categories.length;k++) {
            all_values[categories[k]] = (dict1[categories[k]][jj]);
          }
          if(searchDic(selected_data,all_values)==true){
            selected_data.push(all_values);
            selected_data_indices.push(jj);
            break;
          }
        }
      }
    }

    // render the table for the points selected by lasso
    if (selected_data.length > 0) {
      console.log("Rendering table...");
      console.log(selected_data);
      console.log(columns);
      console.log(selectedXValues);
      tabulate(selected_data, columns, selectedXValues);
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

export function SvgInitializer (color, color_column, x_max, x_min, y_max, y_min, allXValues, allYValues, categories, dict1, columns) {
  this.svg = d3.select("body")
               .select('div.plot-container')
               .append("svg")
               .attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom)
               .append("g")
               .attr("transform",`translate(${margin.left}, ${margin.top})`);

  this.lasso = new LassoInitializer(this.svg, color, color_column, x_max, x_min, y_max, y_min, allXValues, allYValues, categories, dict1, columns).initialize();
  this.initializeWithLasso = () => {
    // Init the lasso object on the svg:g that contains the dots
    this.svg.call(this.lasso);
    return this.svg;
  };

}

