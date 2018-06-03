# d3-scatterplot
This is an interactive 2D visualization tool for cluster analysis.

Features include:
- hover mouse over data point to see its features
- select a group of data points to be shown a summary of the features of the selected points (on the right) and a list of the selected rows (at the bottom)
- zoom in by selecting two boundary points
- specify the color feature
- the default color feature can be specified by appending "&color=column_name" to the URL
- specify gradient coloring by checkboxing "spectrum" (available for numeric features)
- specify shape feature
- specify search feature and search for a substring in the feature's values to highlight data points
- specify transparent feature and values, adjust opacity of matches and nonmatches
- when using semantic model, display lists of most frequently occurring words and top predicted words for data points selected via lasso or search

Plot tool expects a tsv file as input which has columns labeled 'x' and 'y' and at least one additional column. It also accepts tsv files renamed with .txt extension. Using txt files allows for faster loading via gzip.

Command line example to get the viz running:
1. clone the repo
2. inside the repo run: python3 -m http.server
3. open your web browser to http://localhost:8000/index.html?dataset=example.tsv

To use semantic model:
1. run representation_presenter.py and semantic_model.py (instructions in respective repos)
2. open your web browser to http://localhost:8000/index.html?dataset=example.tsv&semantic_model=true
Note: semantic_model.py automatically generates .txt files for you, as files needed for semantic model get quite large. Thus, you can visit http://localhost:8000/index.html?dataset=example.txt&semantic_model=true for a faster experience.

# Regression Test Plan

## Basic Standalone Features

| Feature | Replication Instructions | Expectation |
| ------- | ------------------------ | ----------- |
| Load data | Start the python server, then navigate to http://localhost:8000/index.html?dataset=example.tsv&semantic_model=false | Expect to see a scatter plot with blue dots load. |
| Display information about a single data point | Hover over a given dot with the mouse | A table should materialize above the scatterplot displaying additional dimensions associated with the data point along with the data point's X,Y coordinate values. |
| Lasso dots | Click on the plot area and drag the cursor around in a circle, encapsulating dots in the drawing | Upon clicking, the dots should all change color to gray. Once the lasso is completed but the mouse click has not yet been released, the dots within the drawn shape should grow and turn orange. When the mouse click is released, the dots that were in the drawn shape should stay large. A table to the right of the scatterplot should show up, displaying frequency information about the selected dots by feature. Another table should show up at the bottom of the web page displaying all the selected data by feature. |
| Color scatter plot by other dimensions values | Scroll down below the scatterplot area and select a value other than "Select" from the dropdown next to the label "Color By:" | Scatter plot should update with a new color scheme. A legend should appear in the top right corner indicating the color associated with each unique value in the selected feature. |
| Spectrum coloring for features with numerical data | Select a feature with numerical data from the "Color By:" dropdown. From the "Options:" checkbox beneath the "Color By" label, check the "Spectrum" checkbox. | The plot should update the colors of plotted data to reflect a new, more gradual color scheme. The legend in the right hand side of the plot should merge from multiple discrete categories to a single spectrum legend. |
| Log coloring for features with numerical data | Select a feature with numerical data from the "Color By:" dropdown ("feature 2" from the sample data). From the "Options:" checkbox beneath the "Color By" label, check the Log" checkboxes. | ~~Plot should update the colors of the displayed data.~~ (Strikeout due to known, existing bug). Confirm the legend is drawn in top right and that values reflect a log scale instead of a linear scale. |
| Click on feature | Click on a data point. Scroll down and select a different feature from the dropdown next to the "Click on Feature:" label. Click on a different data point. | After clicking on the first data point, confirm that the value associated with the selected feature is permanently printed below and to the right of the clicked data point. After selecting a different feature, confirm that the scatterplot has not refreshed to a clean slate. After clicking on the second data point, confirm that the value associated with the newly selected feature is permanently printed below and to the right of the second clicked data point. Confirm that the printed value of the first clicked data point remains unchanged on the scatter plot area. |
| Shape by feature | Scroll down below the scatterplot area and select a value other than "Select" from the dropdown next to the label "Shape By:" | Scatterplot area should update to display shapes as the data points instead of the default dots. A legend should appear in the top left corner indicating the shape associated with each unique value in the selected feature. |
| Search by value (Happy path) | Select a feature from the "Search By:" dropdown. Enter a value into the input field with placeholder "Search Text" that **__does__** exist in the feature. Click the apply button. | After hitting apply, confirm that the scatterplot updates to enlarge and give a yellow halo to the data points matching the searched value. Confirm that a frequency table associated with the highlighted data points appears to the right of the scatter plot and that a table displaying all data by feature appears at the bottom of the table. |
| Search by value (Sad path) | Enter a value into the input field with placeholder "Search Text" that **__does not__** exist in the feature. Click the apply button. | Confirm that the scatterplot reverts to its default state (i.e. no side or bottom tables, no enlarged data points). |
| Search by exact value (Happy path) | Check the "Exact match" checkbox above the input field. Enter a value into the input field with placeholder "Search Text" that **__does__** exist (exactly) in the feature. Click the apply button. | After hitting apply, confirm that the scatterplot updates to enlarge and give a yellow halo to the data points matching the searched value. Confirm that a frequency table associated with the highlighted data points appears to the right of the scatter plot and that a table displaying all data by feature appears at the bottom of the table. |
| Transparency search by value (Happy path) | Select a feature from the "Search By:" dropdown. Enter a value into the input field with placeholder "Match attri. val" that **__does__** exist in the feature. Enter "1" in the "Opacity (match)" input field. Enter ".2" in the "Opacity (no match)" input field. Click the apply button. | After hitting apply, confirm that the scatterplot updates by making all data points not matching the searched value faint and not changing the opacity of matched data points. |
| Transparency search by value (Sad path) | Enter a value into the input field with placeholder "Match attri. val" that **__does not__** exist in the feature. Enter "1" in the "Opacity (match)" input field. Enter ".2" in the "Opacity (no match)" input field. Click the apply button. | After hitting apply, confirm that all data points on the scatterplot become more faint. |
| Transparency search by exact value (Happy path) | Check the "Exact match" checkbox above the input field. Enter a value into the input field with placeholder "Match attri. val" that **__does__** exist (exactly) in the feature. Enter "1" in the "Opacity (match)" input field. Enter ".2" in the "Opacity (no match)" input field. Click the apply button. | After hitting apply, confirm that the scatterplot updates by making all data points not matching the searched value faint and not changing the opacity of matched data points. |
| Zoom | Scroll down below the scatterplot and click the checkbox next to the "Zoom" label. Click on two data points in the scatter plot (you can confirm they've been clicked if their click by feature value appears). Click on the Zoom button below the scatter plot. | After clicking the Zoom button, confirm that the scatterplot is redrawn with the two selected datapoints in the center of the plot. Confirm that the values for axes have changed to reflect a more granular view. |

## Combined Features
Any of the above features should be able to be combined and still work as anticipated. For example, see regression plan for combined feature below.


| Feature | Replication Instructions | Expectation |
| ------- | ------------------------ | ----------- |
| Log-Spectrum coloring for features with numerical data | Select a feature with numerical data from the "Color By:" dropdown. From the "Options:" checkbox beneath the "Color By" label, check the "Spectrum" and "Log" checkboxes. | The plot should update the colors of plotted data to reflect a new, more gradual color scheme. The legend in the right hand side of the plot should merge from multiple discrete categories to a single spectrum legend. The legend markers should reflect a log scale instead of a linear scale. |


## Dev notes
Began to incorporate webpack in order to compile modules and maintain better code encapsulation for readability and maintainability. 
Installation can be done by running `npm install -g webpack` (currently running v. 4.6.0). 
To start the webpack bundler service, run `npm start`. This command will watch the repo and update the `bundle.js` file to match saved changes.

- TODO: make sure tool works with semantic model
- TODO: investigate lasso functionality with shapes, seems like they might failing silently
- TODO: investigate why lasso with spectrum and Log enabled changes dot fill to dark blue
- TODO: investigate further writing [automated tests for d3](https://busypeoples.github.io/post/testing-d3-with-jasmine/)