import { PlotCallbackHelper } from './plot_callback_helper.js';
import { symbols, sizes } from './constants.js';
import {
  matchedData,
  transpar,
  xMap,
  yMap
} from './utilities';

export function ShapesArtist ({svg, data, categorySearch, categorySearchData, valSearch, color, cValue2, cValue, symbol, valTransp, transparentColumn, valOpacityMatch, valOpacityNoMatch}) {
  this.points = svg.selectAll(".dot").data(data).enter();
  let featureToShape = document.getElementsByClassName('shape-by-feature')[0].value;

  // what really is symbol? an Object containing unique values for which to create shapes
  // keys of the Object are unique values of the feature to be shaped and the 
  // values of the Object are the count of the unique elements
  // 
  // same thing could probably be accomplished with an array -->
  // keys would be the elements, values would be the index position
  const uniqueDataValuesToShape = symbol; // local rename before global rename
  const availableShapes = symbols; // local rename before global rename

  // ******************************************
  // Static Shape Attributes
  // ******************************************
  let unmatchedShapesAttributes = {
    borderColor: '#000',
    borderWidth: 1,
    shapeSize: 30
  };

  let matchedShapesAttributes = {
    borderColor: 'yellow',
    borderWidth: 2,
    shapeSize: 180
  };

  // ******************************************
  // Shape Helpers
  // ******************************************
  let shapeIndex = (dataPoint) => {
    const numberOfAvailableShapes = availableShapes.length;
    // cycle through shape assignment for unique features to shape
    let datum = dataPoint[featureToShape];
    // I would like to see this following line be refactored to:
    // uniqueDataValuesToShape.indexOf(datum) % numberOfAvailableShapes;
    return uniqueDataValuesToShape[datum] % numberOfAvailableShapes;
  }

  let shapeRotation = (dataPoint) => {
    const datum = dataPoint[featureToShape];
    const numberOfAvailableShapes = availableShapes.length;
  // IMPORTANT TODO:
  // we need to refactor this next part (i.e. data structure of `sizes`) to remove 
  // unintelligible math for identification and replace with human readable keys
    let rotationOptionsForShape = sizes[shapeIndex(dataPoint)];
    const numberOfDifferentRotations = rotationOptionsForShape.length;

    // we add the rotation so that we can reuse the same shapes but plot them differently,
    // thus expanding the total number of unique values we can represent with shapes
    const uniqueRotationIndexForDatum = (
      parseInt(uniqueDataValuesToShape[datum] / numberOfAvailableShapes)
    ) % numberOfDifferentRotations;
    return rotationOptionsForShape[uniqueRotationIndexForDatum];
  }

  let transformAttributes = (dataPoint) => {
    let translateStyling = `translate(${xMap(dataPoint)},${yMap(dataPoint)})`;
    let rotationStyling = `rotate(${shapeRotation(dataPoint)})`;
    return `${translateStyling} ${rotationStyling}`;
  };

  // ******************************************
  // Dynamic Shape Attributes
  // ******************************************

  // should extract to the helper, rename helper
  let fill = (shape) => {
    if (document.getElementsByClassName('log-spectrum-checkbox')[0].checked) {
      return color(cValue2(shape));
    }
    return color(cValue(shape));
  };

  let opacity = (shape) => {
    return transpar(shape, valTransp, transparentColumn, valOpacityMatch, valOpacityNoMatch)
  };

  let drawShapes = (shapes, attributes) => {
    let shapeAttributes = d3.svg
                            .symbol()
                            .type((dataPoint) => {
                              return availableShapes[shapeIndex(dataPoint)]
                            })
                            .size(attributes['shapeSize']);

    let callbackHelper = new PlotCallbackHelper(svg);
    // consistent attributes
    shapes.attr('class', 'point')
          .attr('d', shapeAttributes)
          .attr('transform', transformAttributes)
          .style('fill', fill)
          .style('opacity', opacity)
          .on("mouseover", callbackHelper.mouseoverCallback(categorySearchData))
          .on("mouseout", callbackHelper.mouseoutCallback)
          .on("click", callbackHelper.clickCallback(categorySearchData))

    // customized attributes
    shapes.style('stroke', attributes['borderColor']) // border color
          .style('stroke-width', attributes['borderWidth'])
  };

  this.drawUnmatchedShapes = () => {
    let unmatchedShapes = this.points
                            .append("path")
                            .filter(matchedData(categorySearch, valSearch, false));
    drawShapes(unmatchedShapes, unmatchedShapesAttributes);
  }

  this.drawMatchedShapes = () => {
    let matchedShapes = this.points
                            .append("path")
                            .filter(matchedData(categorySearch, valSearch, true));
    drawShapes(matchedShapes, matchedShapesAttributes);
  }
}