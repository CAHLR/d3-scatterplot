import * as d3 from "d3";

import { plotOptionsReader } from './plot_options_reader.js';
import { xScale, xValue, yScale, yValue, getArrayMin, getArrayMax } from './utilities.js';
import { height, width } from './constants.js';

export function AxisArtist(data, needZoom, coordinatesx, coordinatesy) {
  // The following two variables are the X and Y axis objects
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);

  this.needZoom = needZoom;
  this.coordinatesy = coordinatesy;
  this.coordinatesx = coordinatesx;

  if (plotOptionsReader.zoomCheckboxEnabled() && needZoom === true && coordinatesx.length >= 2) {
    this.xMin = xScale.invert(getArrayMin(coordinatesx)) - 1;
    this.xMax = xScale.invert(getArrayMax(coordinatesx)) + 1;
    this.yMin = parseInt(yScale.invert(getArrayMax(coordinatesy)) - 1);
    this.yMax = Math.round(yScale.invert(getArrayMin(coordinatesy)) + 1);
  } else {
    this.xMin = d3.min(data, xValue) - 1;
    this.xMax = d3.max(data, xValue) + 1;
    this.yMin = d3.min(data, yValue) - 1;
    this.yMax = d3.max(data, yValue) + 1;
  }

  let drawXAxis = (svg) => {
    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", `translate(0,${height})`)
       .call(xAxis)
       .append("text")
       .attr("class", "label")
       .attr("x", width)
       .attr("y", -6)
       .style("text-anchor", "end")
       .text("");
  };

  let drawYAxis = (svg) => {
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
  };

  let setZoomInput = () => {
    let inputValue = '';
    if (plotOptionsReader.zoomCheckboxEnabled() && this.needZoom === true && this.coordinatesx.length >= 2) {
      inputValue = 'The current boundaries of the plot have been set to ';
      inputValue += `X:[${parseInt(this.xMin)}, ${parseInt(this.xMax)}] Y:[${parseInt(this.yMin)}, ${parseInt(this.yMax)}]`;
    }
    document.getElementsByClassName("zoomxy")[0].innerText = inputValue;
  }

  this.draw = (svg) => {
    xScale.domain([this.xMin, this.xMax]);
    yScale.domain([this.yMin, this.yMax]);
    drawXAxis(svg);
    drawYAxis(svg);
    setZoomInput()
  }
}
