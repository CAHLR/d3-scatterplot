import { plotOptionsReader } from './plot_options_reader.js';
import { xAxis, xScale, xValue, yAxis, yScale, yValue } from './utilities.js';
import { height, width } from './constants.js';

export function AxisArtist(data, needZoom, coordinatesx, coordinatesy) {
  if (plotOptionsReader.zoomCheckboxEnabled() && needZoom === true && coordinatesx.length >= 2) {
    this.xMin = xScale.invert(Math.min(coordinatesx[0], coordinatesx[1])) - 1;
    this.xMax = xScale.invert(Math.max(coordinatesx[0], coordinatesx[1])) + 1;
    this.yMin = yScale.invert(Math.min(coordinatesy[0], coordinatesy[1])) - 1;
    this.yMax = yScale.invert(Math.max(coordinatesy[0], coordinatesy[1])) + 1;
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

  let setZoomInput = (needZoom, coordinatesx) => {
    let inputValue = '';
    if (plotOptionsReader.zoomCheckboxEnabled() && needZoom === true && coordinatesx.length >= 2) {
      inputValue = `X:[${parseInt(this.xMin)}, ${parseInt(this.xMax)}] Y:[${parseInt(this.yMin)}, ${parseInt(this.yMax)}]`;
    }
    document.getElementById("zoomxy").value = inputValue;
  }

  this.draw = (svg) => {
    xScale.domain([this.xMin, this.xMax]);
    yScale.domain([this.yMin, this.yMax]);
    drawXAxis(svg);
    drawYAxis(svg);
  }
}