// TODO - Implement using ES6 module system, but want to ship quickly rn, so keeping utils gobally available

// The location of svg plot is determined by the following margins
// let plotDimensions = {
//   margin: { top: 90, right: 40, bottom: 40, left: 40 },
//   get width() { return 700 - this.margin.left - this.margin.right },
//   get height() { return 750 - this.margin.top - this.margin.bottom }
// };

// Hardcoded values
export const margin = { top: 90, right: 40, bottom: 40, left: 40 };
export const width = 700 - margin.left - margin.right;
export const height = 750 - margin.top - margin.bottom;