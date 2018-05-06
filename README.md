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


## Dev notes
Began to incorporate webpack in order to compile modules and maintain better code encapsulation for readability and maintainability. 
Installation can be done by running `npm install -g webpack` (currently running v. 4.6.0). 
To start the webpack bundler service, run `npm start`. This command will watch the repo and update the `bundle.js` file to match saved changes.

- Upcoming work:
[] extract color function from highlight, see whether encapulation of colorValue functions also possible
[] extract legend drawing functionality from highlight
[] extract shape drawing from highlight

- TODO next: test extracting highlight function, see what needs to be injected and see whether it's possible at this state
- TODO: investigate lasso functionality with shapes, seems like they might failing silently;
- TODO: investigate why legend for shapes isn't always popping up
- TODO: fix shape by feature functionality once graph is already zoomed

- TODO: write up regression test plan since currently, QA is necessary to test since tool has no tests
	- Addendum: investigate further writing [automated tests for d3](https://busypeoples.github.io/post/testing-d3-with-jasmine/)