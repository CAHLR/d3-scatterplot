import { width } from './constants.js';

export function LegendGenerator(svg, color) {
  this.uniqueElements = color.domain();

  let createLegendContainer = () => {
    return svg.selectAll(".legend")
              .data(this.uniqueElements)
              .enter()
              .append("g")
              .attr("class", "legend")
              .attr("transform", (el, index) => (`translate(0,${index * 20})`));
  };

  let drawLegendText = (legendContainer) => {
    legendContainer.append("text")
                   .attr("x", width)
                   .attr("y", 9)
                   .attr("dy", ".35em")
                   .style("text-anchor", "end")
                   .text((element) => (element));
  };

  let drawColoredRectangles = (legendContainer) => {
    legendContainer.append('rect')
                   .attr("x", width + 6)
                   .attr("width", 18)
                   .attr("height", 18)
                   .style("fill", color);
  };

  this.generateDefaultLegend = () => {
    let legendContainer = createLegendContainer();
    drawLegendText(legendContainer);
    drawColoredRectangles(legendContainer);
  };
};