import { plotOptionsReader } from './plot_options_reader.js';

export const FilterService = {
	filter: (data) => {
		let feature = plotOptionsReader.getFilterByValueFeature();
    let filterValue = plotOptionsReader.getFilterByValueSlider().get();
    return data.filter((datum) => {
    	if (filterValue.length === 1) {
    		return +datum[feature] === +filterValue
    	} else if (filterValue.length === 2) {
    		return +datum[feature] >= +filterValue[0] && +datum[feature] <= +filterValue[1];
    	}
    });
	}
}