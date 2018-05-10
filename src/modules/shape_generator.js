import { availableShapes, sizes } from './constants.js';
import { plotOptionsReader } from './plot_options_reader.js';

export function ShapeGenerator(uniqueDataValuesToShape) {
  const featureToShape = plotOptionsReader.getFeatureToShape();
  this.uniqueDataValuesToShape = uniqueDataValuesToShape;

  let getDatum = (dataPoint) => {
    return typeof dataPoint === 'object' ? dataPoint[featureToShape]: dataPoint;
  }

  // ***************************************
  // Helpers
  // ***************************************
  let shapeIndex = (dataPoint) => {
    const numberOfAvailableShapes = availableShapes.length;
    let datum = getDatum(dataPoint);
    // cycle through shape assignment for unique features to shape
    return this.uniqueDataValuesToShape.indexOf(datum) % numberOfAvailableShapes;
  };

  // ***************************************
  // API
  // ***************************************

  this.shapeType = (dataPoint) => {
    return availableShapes[shapeIndex(dataPoint)]
  };

  this.shapeRotation = (dataPoint) => {
    const datum = getDatum(dataPoint);
    const numberOfAvailableShapes = availableShapes.length;
    // IMPORTANT TODO:
    // we need to refactor this next part (i.e. data structure of `sizes`) to remove 
    // unintelligible math for identification and replace with human readable keys
    let rotationOptionsForShape = sizes[shapeIndex(dataPoint)];
    const numberOfDifferentRotations = rotationOptionsForShape.length;

    // we add the rotation so that we can reuse the same shapes but plot them differently,
    // thus expanding the total number of unique values we can represent with shapes
    const uniqueRotationIndexForDatum = (
      parseInt(this.uniqueDataValuesToShape.indexOf(datum) / numberOfAvailableShapes)
    ) % numberOfDifferentRotations;
    return rotationOptionsForShape[uniqueRotationIndexForDatum];
  };
};