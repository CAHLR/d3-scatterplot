import { plotOptionsReader } from './plot_options_reader.js';

function isMatch(datum){
  let featureForTransparency = plotOptionsReader.getFeatureForTransparency();
  let transparentSearchText = plotOptionsReader.getTransparentSearchText();
  if (plotOptionsReader.transparencyExactMatchEnabled()) {
    return datum[featureForTransparency] === transparentSearchText;
  }

  let caseInsensitiveMatch = datum[featureForTransparency]
                              .toLowerCase()
                              .indexOf(transparentSearchText.toLowerCase()) > -1;
  return (datum[featureForTransparency] && caseInsensitiveMatch);
}

export const TransparencyService = {
  filter: (data) => {
    let noSearchMatchOpacityValue = plotOptionsReader.getOpacityValueSearchNoMatch();
    let searchMatchOpacityValue = plotOptionsReader.getOpacityValueSearchMatch();
    // return data unaltered if user does not request a complete erasure from chart
    if (parseFloat(searchMatchOpacityValue) === 0) {
      return data.filter((datum) => !isMatch(datum));
    } else if (parseFloat(noSearchMatchOpacityValue) === 0) {
      return data.filter((datum) => isMatch(datum));
    } else {
      return data;
    };
  },
  opacityValue: (dot) => {
    let noSearchMatchOpacityValue = plotOptionsReader.getOpacityValueSearchNoMatch();
    let searchMatchOpacityValue = plotOptionsReader.getOpacityValueSearchMatch();
    let transparentSearchText = plotOptionsReader.getTransparentSearchText();
    let transparencyDisabled = transparentSearchText === "" || typeof dot === 'undefined';
    // the return value 1 means full opacity
    if (transparencyDisabled) { return 1 };
    if (isMatch(dot)) {
      return parseFloat(searchMatchOpacityValue)
    } else {
      return parseFloat(noSearchMatchOpacityValue);
    }
  }
}
