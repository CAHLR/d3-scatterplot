import * as d3 from "d3-selection";

export let tooltip = d3.select(".tooltip");

export function initialTooltipState(categories) {
  let dummyDatapoint = {}
  categories.forEach((category) => {
    dummyDatapoint[category] = '';
  })
  dummyDatapoint['x'] = '';
  dummyDatapoint['y'] = '';
  return tooltipHTMLContent(categories, dummyDatapoint);
};

export function tooltipHTMLContent(categories, datapoint) {
  let tableHeaders = "";
  let tableValues = ""
  categories.forEach((category) => {
    tableHeaders += `<td>${category}</td>`;
    tableValues += `<td>${datapoint[category]}</td>`;
  });
  ['x', 'y'].forEach((value) => {
    tableHeaders += `<td>${value}-value</td>`;
    tableValues += `<td>${datapoint[value]}</td>`;
  });
  let table = `
    <table>
      <tr class='headers'>${tableHeaders}</tr>
      <tr class='values'>${tableValues}</tr>
    </table>
  `;
  return table;
};