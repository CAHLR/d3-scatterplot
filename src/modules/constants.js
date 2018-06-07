export const margin = { top: 90, right: 40, bottom: 40, left: 40 };
export const width = 700 - margin.left - margin.right;
export const height = 750 - margin.top - margin.bottom;

// Can generate more with http://jnnnnn.github.io/category-colors-2L-inplace.html if want more
export const d3_category20_shuffled = [
	"#1f77b4",
	"#ff7f0e",
	"#2ca02c",
	"#d62728",
	"#9467bd",
	"#8c564b",
	"#e377c2",
	"#7f7f7f",
	"#bcbd22",
	"#17becf",
	"#aec7e8",
	"#ffbb78",
	"#98df8a",
	"#ff9896",
	"#c5b0d5",
	"#c49c94",
	"#f7b6d2",
	"#c7c7c7",
	"#dbdb8d",
	"#9edae5"
];

// provides different colored spectrum
export const scale_d = {
  'puOr11': ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],
  'spectral8': ['#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd'],
  'redBlackGreen': ['#ff0000', '#AA0000', '#550000', '#005500', '#00AA00', '#00ff00'],
};
export const scale = scale_d['spectral8'];

export const sizes = {};
sizes[0] = ["0", "90", "0", "0"];
sizes[1] = ["0", "45", "0", "0"];
sizes[2] = ["0", "90", "0", "0"];
sizes[3] = ["0", "45", "0", "0"];
sizes[4] = ["0", "90", "0", "0"];
sizes[5] = ["0", "0", "0", "0"];
export const availableShapes = ["diamond", "cross", "triangle-up", "square", "triangle-down","circle"];