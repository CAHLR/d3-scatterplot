import {
  dotSearchFilter,
  printArray,
  transpar,
  xMap,
  yMap
} from './utilities';
import { tooltip } from './tooltips';

export function DotsArtist (svg, data, categorySearch, categorySearchData, valSearch, color, cValue2, cValue, valTransp, transparentColumn, valOpacityMatch, valOpacityNoMatch) {
  this.marked = {}; // store X,Y coordinates of data points that have been clicked;
  this.points = svg.selectAll(".dot").data(data).enter();

  // ******************************************
  // Utility Functions
  // ******************************************
  this.matchedDots = (categorySearch, valSearch, match) => {
    if (match) {
      return (dot) => {
        return dotSearchFilter(dot, categorySearch, valSearch) === 2;
      }
    }
    return (dot) => {
      return dotSearchFilter(dot, categorySearch, valSearch) === 1;
    }
  };

  let mouseoverCallback = (categorySearchData) => {
    return (dot) => {
      tooltip.transition()
             .duration(200)
             .style("opacity", 1);
      tooltip.html(printArray(categorySearchData, dot))
             .style("left", "60px")
             .style("top", "30px");
    };
  };

  let mouseoutCallback = (dot) => {
    tooltip.transition()
           .duration(500)
           .style("opacity", 0);
  };

  let clickCallback = () => {
    let desensitizeClickArea = () => {
      this.marked[[d3.event.pageX, d3.event.pageY]] = true;
      for (let i = 1; i < 4; i++) {
        this.marked[[d3.event.pageX - i, d3.event.pageY - i]] = true;
        this.marked[[d3.event.pageX + i, d3.event.pageY + i]] = true;
        this.marked[[d3.event.pageX - i, d3.event.pageY + i]] = true;
        this.marked[[d3.event.pageX + i, d3.event.pageY - i]] = true;
      }
    };

    return (dot) => {
      let featureColumn = document.getElementsByClassName('click-on-feature')[0].value;
      if (!([d3.event.pageX, d3.event.pageY] in this.marked)) {
        desensitizeClickArea();
        svg.append("text")
           .text(dot[featureColumn])
           .attr("x", (d3.event.pageX - 50))
           .attr("y", (d3.event.pageY - 35))
           .on("mouseover", mouseoverCallback(categorySearchData))
           .on("mouseout", mouseoutCallback)
           .on("click", clickCallback)
      }
    }
  };

  let drawDots = (dots, attributes) => {
    let fill = (dot) => {
      if (document.getElementById('cbox2').checked) return color(cValue2(dot));
      return color(cValue(dot));
    };
    let opacity = (dot) => {
      return transpar(dot, valTransp, transparentColumn, valOpacityMatch, valOpacityNoMatch)
    };
    // consistent attributes
    dots.attr('class', 'dot')
        .attr("cx", xMap)
        .attr("cy", yMap)
        .on("mouseover", mouseoverCallback(categorySearchData))
        .on("mouseout", mouseoutCallback)
        .on("click", clickCallback())
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
                            .filter(this.matchedDots(categorySearch, valSearch, false));
    drawDots(unmatchedDots, unmatchedDotsAttributes);
  };

  this.drawMatchedDots = () => {
    let matchedDots = this.points
                          .append('circle')
                          .filter(this.matchedDots(categorySearch, valSearch, true));
   drawDots(matchedDots, matchedDotsAttributes);
  };
};