import {
  matchedData,
  transpar,
  xMap,
  yMap
} from './utilities';
import { PlotCallbackHelper } from './plot_callback_helper.js';


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
  // Static Dot Attributes
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