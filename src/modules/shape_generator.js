import { symbols, sizes } from './constants.js';

export function ShapeGenerator(uniqueDataValuesToShape, featureToShape) {
  this.featureToShape = featureToShape;
  const availableShapes = symbols; // local rename before global rename

  // ***************************************
  // Helpers
  // ***************************************
  let shapeIndex = (dataPoint) => {
    const numberOfAvailableShapes = availableShapes.length;
    // cycle through shape assignment for unique features to shape
    let datum = dataPoint[this.featureToShape];
    // I would like to see this following line be refactored to:
    // uniqueDataValuesToShape.indexOf(datum) % numberOfAvailableShapes;
    return uniqueDataValuesToShape[datum] % numberOfAvailableShapes;
  };

  // ***************************************
  // API
  // ***************************************

  this.shapeType = (dataPoint) => {
    return availableShapes[shapeIndex(dataPoint)]
  };

  this.shapeRotation = (dataPoint) => {
    const datum = dataPoint[this.featureToShape];
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
};