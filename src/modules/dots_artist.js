import {
  dotSearchFilter,
  printArray,
  transpar,
  xMap,
  yMap
} from './utilities';
import { tooltip } from './tooltips';

// ******************************************
// Utility Functions (probably will want to extract soon, maybe to utilities)
// ******************************************
let matchedData = (categorySearch, valSearch, match) => {
  if (match) {
    return (dataPoint) => {
      return dotSearchFilter(dataPoint, categorySearch, valSearch) === 2;
    }
  }
  return (dataPoint) => {
    return dotSearchFilter(dataPoint, categorySearch, valSearch) === 1;
  }
};

function PlotCallbackHelper(svg) {
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
      let featureColumn = document.getElementsByClassName('click-on-feature')[0].value;
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

export function DotsArtist ({svg, data, categorySearch, categorySearchData, valSearch, color, cValue2, cValue, valTransp, transparentColumn, valOpacityMatch, valOpacityNoMatch}) {
  this.points = svg.selectAll(".dot").data(data).enter();

  let fill = (dot) => {
    if (document.getElementsByClassName('log-spectrum-checkbox')[0].checked) {
      return color(cValue2(dot));
    }
    return color(cValue(dot));
  };

  let opacity = (dot) => {
    return transpar(dot, valTransp, transparentColumn, valOpacityMatch, valOpacityNoMatch)
  };

  let drawDots = (dots, attributes) => {
    let callbackHelper = new PlotCallbackHelper(svg);
    // consistent attributes
    dots.attr('class', 'dot')
        .attr("cx", xMap)
        .attr("cy", yMap)
        .on("mouseover", callbackHelper.mouseoverCallback(categorySearchData))
        .on("mouseout", callbackHelper.mouseoutCallback)
        .on("click", callbackHelper.clickCallback(categorySearchData))
        .style('fill', fill)
        .style('opacity', opacity)

    // customized attributes
    dots.attr('r', attributes['radiusSize']) //radius size
        .style('stroke', attributes['borderColor']) // border color
        .style('stroke-width', attributes['borderWidth'])
  };

  // ******************************************
  // Dot Attributes
  // ******************************************
  let unmatchedDotsAttributes = {
    radiusSize: 3,
    borderColor: '#000',
    borderWidth: 1,
  };

  let matchedDotsAttributes = {
    radiusSize: 7,
    borderColor: 'yellow',
    borderWidth: 2
  };

  // ******************************************
  // Draw Functions
  // ******************************************
  // dots that were not a match for search parameters (consider function rename?)
  this.drawUnmatchedDots = () => {
    let unmatchedDots = this.points
                            .append("circle")
                            .filter(matchedData(categorySearch, valSearch, false));
    drawDots(unmatchedDots, unmatchedDotsAttributes);
  };

  this.drawMatchedDots = () => {
    let matchedDots = this.points
                          .append('circle')
                          .filter(matchedData(categorySearch, valSearch, true));
   drawDots(matchedDots, matchedDotsAttributes);
  };
};