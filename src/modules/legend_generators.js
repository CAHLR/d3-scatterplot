import { scale, width } from './constants.js';
import { linSpace } from './utilities';
import { ShapeGenerator } from './shape_generator.js';

export function DefaultLegendGenerator(svg, color) {
  this.uniqueElements = color.domain();

  let createLegendRows = () => {
    return svg.selectAll(".legend")
              .data(this.uniqueElements)
              .enter()
              .append("g")
              .attr("class", "legend")
              .attr("transform", (el, index) => (`translate(0,${index * 20})`));
  };

  let drawLegendText = (legendRows) => {
    legendRows.append("text")
              .attr("x", width)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text((element) => (element));
  };

  let drawColoredRectangles = (legendRows) => {
    legendRows.append('rect')
              .attr("x", width + 6)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);
  };

  this.generate = () => {
    if (color.domain().length > 30) { return }
    let legendRows = createLegendRows();
    drawLegendText(legendRows);
    drawColoredRectangles(legendRows);
  };
};

export function SpectrumLegendGenerator(svg, spectrumGenerator) {
  let colorScale = scale; // local rename before an impending global rename
  this.spectrumGenerator = spectrumGenerator;

  let generateLegendContainer = () => {
    return svg.selectAll(".legend")
              .data(this.spectrumGenerator.color.domain())
              .enter()
              .append("g")
              .attr("class", "legend");
  };

  let createGradientObject = (legend) => {
    // quick reference for creating <defs> element:
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs
    return legend.append('defs')
                 .append('linearGradient')
                 .attr('id', 'gradient')
                 .attr('x1', '0%') // bottom
                 .attr('y1', '100%')
                 .attr('x2', '0%') // to top
                 .attr('y2', '0%')
                 .attr('spreadMethod', 'pad');
  };

  let colorsAndTransitionsTuples = () => {
    let colorTransitionsByPercentage = linSpace(0, 100, colorScale.length);
    let colorTransitions = colorTransitionsByPercentage.map(
      (percentageFloat) => (`${Math.round(percentageFloat)}%`)
    );
    return d3.zip(colorScale, colorTransitions);
  };

  let setGradientColorTransitions = (gradient) => {
    colorsAndTransitionsTuples().forEach((tuple) => {
      let [color, transitionValue] = tuple;
      gradient.append('stop')
              .attr('offset', transitionValue)
              .attr('stop-color', color)
              .attr('stop-opacity', 1)
    });
  };

  let drawGradientBox = (legend) => {
    legend.append('rect')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('width', 18)
          .attr('height', 150)
          .attr("transform", "translate(582, 0)")
          .style('fill', 'url(#gradient)');
  };

  let drawLegendAxis = (legend) => {
    let scaleBoundaries = [
      this.spectrumGenerator.spectrumMin,
      this.spectrumGenerator.spectrumMax
    ];
    let legendScale = d3.scale.linear().domain(scaleBoundaries).range([150, 0]);
    let legendAxis = d3.svg.axis().scale(legendScale).orient("right").ticks(10);

    legend.append("g")
          .attr("class", "legend axis")
          .attr("transform", "translate(600, 0)")
          .call(legendAxis);
  };

  this.generate = () => {
    let legend = generateLegendContainer();
    let gradient = createGradientObject(legend);
    setGradientColorTransitions(gradient);
    drawGradientBox(legend);
    drawLegendAxis(legend);
  };
};

export function ShapeLegendGenerator(uniqueDataValuesToShape) {
  this.shapeGenerator = new ShapeGenerator(uniqueDataValuesToShape);

  let generateLegendRows = (svg) => {
    return svg.selectAll(".shape-legend")
              .data(uniqueDataValuesToShape)
              .enter()
              .append("g")
              .attr('class', 'shape-legend');
  };

  let generateLegendLabels = (legendRows) => {
    legendRows.append("text")
              .attr("dy", ".35em")
              .attr('transform', (el, index) => (`translate(30,${index * 20})`))
              .style("text-anchor", "begin")
              .text((element) => (element))
              .attr('class', 'shape-label');
  };

  let generateLegendSymbols = (legendRows) => {
    legendRows.append('path')
              .attr('d', d3.svg.symbol().type(this.shapeGenerator.shapeType))
              .attr('x', width)
              .attr('width', 18)
              .attr('height', 18)
              .attr('class', 'shape-symbol')
              .attr('transform', (el, index) => {
                return `translate(20,${index * 20}) rotate(${this.shapeGenerator.shapeRotation(el)})`
              });
  };

  this.generate = (svg) => {
    let uniqueShapeCount = uniqueDataValuesToShape.length;
    if (uniqueShapeCount >= 20) { return };
    let legend = generateLegendRows(svg);
    generateLegendSymbols(legend);
    generateLegendLabels(legend);
  };
};