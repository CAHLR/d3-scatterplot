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
- ~~when using semantic model, display lists of most frequently occurring words and top predicted words for data points selected via lasso or search~~ (semantic model not currently enabled)

Plot tool expects a tsv file as input which has columns labeled 'x' and 'y' and at least one additional column. It also accepts tsv files renamed with .txt extension. Using txt files allows for faster loading via gzip.

Command line example to get the viz running:
1. clone the repo
2. run `npm install`
3. inside the repo run: python3 -m http.server
4. open your web browser to http://localhost:8000/index.html?dataset=example.tsv

(Semantic model is currently not functional)

~~To use semantic model:~~

~~1. run representation_presenter.py and semantic_model.py (instructions in respective repos)~~

~~2. open your web browser to http://localhost:8000/plot.html?dataset=example.tsv&semantic_model=true~~

~~Note: semantic_model.py automatically generates .txt files for you, as files needed for semantic model get quite large. Thus, you can visit http://localhost:8000/plot.html?dataset=example.txt&semantic_model=true for a faster experience.~~



### d3-scatterplot inline
Just like matplotlib inline, you may want to embed d3-scatterplot into your Jupyter Notebook or Google Colab. And here they are:
1. Jupyter Notebook
    ```python
    from IPython.display import Javascript
    from IPython.display import IFrame
    
    # clone d3-scatterplot to your local directory
    !git clone https://github.com/CAHLR/d3-scatterplot.git
    
    # run the http server on your local machine
    get_ipython().system_raw('cd d3-scatterplot && python3 -m http.server 8000 &') 
    
    # display example.tsv with d3-scatterplot in your jupyter notebook
    IFrame('http://127.0.0.1:8000/index.html?dataset=example.tsv', width=1000, height=1000)
    ```
    
2. Google Colab
You may check [this link](https://colab.research.google.com/drive/1RkmJxFOBAfsiJ0JDRQYZvDg3hPLxWnjU?usp=sharing) for the Google Colab demo.



### Preselecting visualization options

Query parameters can be used to preselect any of the options for a given feature.

To enable, add `&[OPTION_NAME]=[FEATURE_NAME]` after the `dataset=[YOUR_DATASET]` in the URL (e.g. http://localhost:8000/index.html?dataset=example.tsv&color=feature%202 [N.B. %20 is the URL encoding for whitespace characters]).

Any or all options may be added, though some require another option name to be present in order to function. For example, to preselect the `spectrum` option, you must also preselect the `color` option for a continuous variable (e.g. http://localhost:8000/index.html?dataset=example.tsv&color=feature%202&spectrum=feature%202).

Please reference the table below to see a list of option names and recommended/required combinations.


| Option Name | Functionality | Required/Recommended Combination | Example |
| ----------- | ------------- | ------------------- | ------- |
| `click` | Preselect which feature's value will be printed to the plot when clicking on a dot | N/A | http://localhost:8000/index.html?dataset=example.tsv&click=feature%202 |
| `shape` | Display different shapes for different feature values | N/A | http://localhost:8000/index.html?dataset=example.tsv&shape=feature%202 |
| `color` | Display different colors for different feature values | N/A | http://localhost:8000/index.html?dataset=example.tsv&color=feature%202 |
| `spectrum` | Colors display according to value on a spectrum | required: `color` | http://localhost:8000/index.html?dataset=example.tsv&color=feature%202&spectrum=feature%202 |
| `log` | Color feature values based on the log of their original value | required: `color`, recommended: `spectrum` | http://localhost:8000/index.html?dataset=example.tsv&color=feature%202&log=feature%202&spectrum=feature%202 |
| `search`    | Preselect which feature to search. Searching a value will create a yellow halo around dots/shapes that match the value. | N/A | http://localhost:8000/index.html?dataset=example.tsv&search=feature%202 |
| `search_exact` | Preselect search features on an exact value | required: `search` | http://localhost:8000/index.html?dataset=example.tsv&search=feature%202&search_exact=feature%202 |
| `transparency` | Preselect which feature to search. Searching a value will set the transparency of matched/unmatched dots/shapes to the opacity value specified. | N/A | http://localhost:8000/index.html?dataset=example.tsv&transparency=feature%202 |
| `transparency_exact` | Preselect transparency search features on an exact value. | required: `transparency` | http://localhost:8000/index.html?dataset=example.tsv&transparency=feature%202&transparency_exact=feature%202 |
| `zoom` | If this option is set, the plot enters zoom mode upon its initial load (for more details, see [the regression plan](https://github.com/CAHLR/d3-scatterplot/wiki/Regression-Test-Plan)) | N/A | http://localhost:8000/index.html?dataset=example.tsv&zoom=true |



### Dev notes

This project uses webpack to bundle various modules together into a single `bundle.js` file that is embedded on the `index.html` page.

To start the webpack bundler service, run `npm start` (make sure you've `npm install`ed). This command will watch the for changes in repo and update the `bundle.js` file to match saved changes.
*NOTE:* you _must_ run bundler in order to have changes reflected in the overall file.

TODO:

- [] migrate semantic model functionality from monolith version to modularized version of the tool
- [] Deep linking of search and transparency search values in URL

Check out [the wiki](https://github.com/CAHLR/d3-scatterplot/wiki/Regression-Test-Plan) to view a full regression test plan.
