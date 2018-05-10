import { tooltip } from './tooltips.js';
import { printArray } from './utilities.js';
import { plotOptionsReader } from './plot_options_reader.js';

export function PlotCallbackHelper(svg) {
  this.marked = {}; // store X,Y coordinates of data points that have been clicked;

  let desensitizeClickArea = () => {
    this.marked[[d3.event.pageX, d3.event.pageY]] = true;
    for (let i = 1; i < 4; i++) {
      this.marked[[d3.event.pageX - i, d3.event.pageY - i]] = true;
      this.marked[[d3.event.pageX + i, d3.event.pageY + i]] = true;
      this.marked[[d3.event.pageX - i, d3.event.pageY + i]] = true;
      this.marked[[d3.event.pageX + i, d3.event.pageY - i]] = true;
    }
  };

  this.clickCallback = (categorySearchData) => {
    return (dataPoint) => {
      let featureColumn = plotOptionsReader.getClickOnFeatureValue();
      if (!([d3.event.pageX, d3.event.pageY] in this.marked)) {
        desensitizeClickArea();
        svg.append("text")
           .text(dataPoint[featureColumn])
           .attr("x", (d3.event.pageX - 50))
           .attr("y", (d3.event.pageY - 35));
      }
    }
  };

  this.mouseoverCallback = (categorySearchData) => {
    return (dataPoint) => {
      tooltip.transition()
             .duration(200)
             .style("opacity", 1);
      tooltip.html(printArray(categorySearchData, dataPoint))
             .style("left", "60px")
             .style("top", "30px");
    };
  };

  this.mouseoutCallback = (dataPoint) => {
    tooltip.transition()
           .duration(500)
           .style("opacity", 0);
  };
};