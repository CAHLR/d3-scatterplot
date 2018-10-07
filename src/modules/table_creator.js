import { CsvExporter } from './csv_exporter.js';
import { plotOptionsReader } from './plot_options_reader.js';

// ****************************
// Create Table functionality
// ****************************

// Utility function used for predicting words in semantic setting
// Source: https://stackoverflow.com/a/11792230/7100714
function findIndicesOfMax(inp, count) {
  let outp = new Array();
  for (let i = 0; i < inp.length; i++) {
    outp.push(i);
    if (outp.length > count) {
      outp.sort((a, b) => (inp[b] - inp[a]));
      outp.pop();
    }
  }
  return outp;
}

export function classify (indices, vs_source, weights_source, biases_source, vocab_source) {
  let sum_vectors = vs_source[indices[0]];
  for (i=1; i < indices.length; i++) {
    sum_vectors = math.add(sum_vectors, vs_source[indices[i]]);
  }
  let avg_vector = sum_vectors.map((x) =>  ( x / indices.length ));
  let mul = math.multiply(avg_vector, weights_source);
  let add = math.add(mul, biases_source);
  // get indices of 10 greatest elements
  let topIndices = findIndicesOfMax(add, 10);
  console.log("Top predicted vocab words:");
  let strbuilder = "Predicted words:";
  for (i=0; i<10; i++) {
    console.log((i+1) + ": " + vocab_source[topIndices[i]]);
    strbuilder += " " + vocab_source[topIndices[i]] + ",";
  }
  document.getElementById("predicted_words").innerHTML = strbuilder.slice(0, -1);
};

export function benchmark (indices, bow_source, vocab_source) { // may need to adjust
  var num_indices = indices.length;
  var vocab_freq = bow_source[indices[0]];
  for (i=1; i < num_indices; i++) {
    vocab_freq = math.add(vocab_freq, bow_source[indices[i]]);
  }
  // get indices of 10 greatest elements
  var topIndices = findIndicesOfMax(vocab_freq, 10);
  console.log("Most frequent words:");
  var strbuilder = "Most frequent words:";
  for (i=0; i<10; i++) {
    console.log((i+1) + ": " + vocab_source[topIndices[i]]);
    strbuilder += " " + vocab_source[topIndices[i]] + ",";
  }
  document.getElementById("frequent_words").innerHTML = strbuilder.slice(0, -1);
};

// displays the summary in tabular form
export function tabulate (data_tab, columns) {
  let table = d3.select('.filters-and-options').append("table").attr("class", "summary-data"),
      thead = table.append("thead"),
      tbody = table.append("tbody");

  // append the header row
  thead.append("tr")
       .selectAll("th")
       .data(columns)
       .enter()
       .append("th")
       .text((column) => (column ));

  // create a row for each object in the data
  let rows = tbody.selectAll("tr")
                  .data(data_tab)
                  .enter()
                  .append("tr");

  // create a cell in each row for each column
  let cells = rows.selectAll("td")
                  .data((row) => {
                    return columns.map((column) => {
                      return {column: column, value: row[column]};
                    });
                  })
                  .enter()
                  .append("td")
                  .attr("style", "font-family: Courier") // sets the font style
                  .html((d) => ( d.value ) );

  /*
    crossfilter dimensions and group by
    http://animateddata.co.uk/articles/crossfilter/
  */
  let output = "";
  let cf = crossfilter(data_tab);
  /* crossfilter currently only supports up to 32 columns) */
  for (var i=0;i<columns.length && i<32;i++) {
    let byParty = cf.dimension((party) => ( party[columns[i]] ));
    output = output + "<b>" + columns[i] + "</b>" + "<br>";
    var groupByParty = byParty.group();
    groupByParty.top(5).forEach(function(p, i) {
      output = output + p.key + ": " + p.value + "<br>";
      console.log(p.key + ": " + p.value);
    });
    output = output + "<br>";
  }
  // side table
  let sideTableContainer = plotOptionsReader.getSideTableContainer();
  sideTableContainer.innerHTML = output;
  sideTableContainer.prepend(
    CsvExporter.createExportButton(),
    document.createElement('br'),
    document.createElement('br')
  );
  return table;
}