import { scale } from './constants.js';
import { linSpace } from './utilities.js';
import { plotOptionsReader } from './plot_options_reader.js';

export function SpectrumGenerator(data) {
  let colorScale = scale; // stopgap til I rename in the entire app
  // *************************************
  // private functions
  // *************************************
  let featureToColor = plotOptionsReader.getFeatureToColor();
  let logEnabled = plotOptionsReader.logSpectrumEnabled();
  let scaledFeatureValue = (datum) => {
    let featureDatum = parseFloat(datum[featureToColor])
    if (logEnabled) return Math.log(featureDatum);
    return featureDatum;
  };

  this.spectrumMin = Math.max(Number.MIN_VALUE, d3.min(data.map(scaledFeatureValue)));
  this.spectrumMax = d3.max(data.map(scaledFeatureValue));

  let spectrumColorBreakpoints = linSpace(
    this.spectrumMin,
    this.spectrumMax,
    colorScale.length
  );

  // *************************************
  // Public functions
  // *************************************
  this.color = d3.scaleLinear()
                 .domain(spectrumColorBreakpoints)
                 .range(colorScale);
}
