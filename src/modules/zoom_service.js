import { xScale, yScale } from './utilities.js';

export const ZoomService = {
  filter: (data, coordinatesX, coordinatesY) => {
    let minX = xScale.invert(Math.min(...coordinatesX));
    let maxX = xScale.invert(Math.max(...coordinatesX));
    let minY = yScale.invert(Math.max(...coordinatesY));
    let maxY = yScale.invert(Math.min(...coordinatesY));
    return data.filter((datum) => {
      return datum['x'] >= minX && datum['x'] <= maxX
         && datum['y'] >= minY && datum['y'] <= maxY;
    });
  }
}
