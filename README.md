# d3-scatterplot
This is an interactive 2D visualization tool for cluster analysis.

Features include:
- hover mouse over data point to see its features
- select a group of data points to be shown a summary of the features of the selected points (on the right) and a list of the selected rows (at the bottom)
- select the coloring feature
- the default coloring feature can be selected by appending "&coloring=column_name" to the URL
- specify gradient coloring by checkboxing "spectrum" (gradient feature is currently limited to integer features)
- specify search feature and search for a substring in the feature's values to highlight data points

Plot tool expects a tsv file as input which has columns labeled 'x' and 'y' and at least one additional column.

Command line example to get the viz running:
1. clone the repo
2. inside the repo run: python3 -m http.server
3. open your web browser to http://localhost:8000/plot.html?dataset=example.tsv


