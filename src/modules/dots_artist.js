import {
  featureToColorValueTranslator,
  matchedData,
  transpar,
  xMap,
  yMap
} from './utilities';
import { PlotCallbackHelper } from './plot_callback_helper.js';
import { plotOptionsReader } from './plot_options_reader.js';

export function DotsArtist ({svg, data, categorySearchData, color}) {
  this.points = svg.selectAll(".dot").data(data).enter();
  let searchCategory = plotOptionsReader.getSearchCategory();
  let searchText = plotOptionsReader.getSearchText();
  let featureForTransparency = plotOptionsReader.getFeatureForTransparency();
  let transparentSearchText = plotOptionsReader.getTransparentSearchText()
  let searchMatchOpacityValue = plotOptionsReader.getOpacityValueSearchMatch();
  let noSearchMatchOpacityValue = plotOptionsReader.getOpacityValueSearchNoMatch();
  let featureToColorValue = featureToColorValueTranslator();

  // ******************************************
  // Callbacks
  // ******************************************
  let fill = (dot) => {
    return color(featureToColorValue(dot));
  };

  let opacity = (dot) => {
    return transpar(
      dot,
      transparentSearchText,
      featureForTransparency,
      searchMatchOpacityValue,
      noSearchMatchOpacityValue
    )
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
                            .filter(matchedData(searchCategory, searchText, false));
    drawDots(unmatchedDots, unmatchedDotsAttributes);
  };

  this.drawMatchedDots = () => {
    let matchedDots = this.points
                          .append('circle')
                          .filter(matchedData(searchCategory, searchText, true));
   drawDots(matchedDots, matchedDotsAttributes);
  };
};