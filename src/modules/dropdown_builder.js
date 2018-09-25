import * as d3 from "d3";

export function DropdownBuilder() {

  this.createDowndownMenu = (nameAttribute, containerClass, dropdownClass) => {
    return d3.select("body")
             .select(`.${containerClass}`)
             .append("select")
             .attr("name", nameAttribute)
             .attr('class', dropdownClass);
  }

  this.populateDropdownOptions = (dropdown, data) => {
    return dropdown.selectAll('option')
                   .data(data)
                   .enter()
                   .append('option')
                   .text((featureName) => (featureName));
  };
  let createAllDropdowns = () => {
    this.clickOnFeatureDropdown = this.createDowndownMenu(
      'color_column',
      'click-on-feature-container',
      'click-on-feature'
    );
    this.coloringDropdown = this.createDowndownMenu(
      'color_column',
      'color-by-feature-container',
      'color-by-feature'
    );
    this.searchDropdown = this.createDowndownMenu(
      'color_column',
      'search-by-feature-container',
      'search-by-feature'
    );
    this.shapingDropdown = this.createDowndownMenu(
      'color_column',
      'shape-by-feature-container',
      'shape-by-feature'
    );
    this.transparentDropdown = this.createDowndownMenu(
      'color_column',
      'transparency-by-feature'
    );

  };
  this.build = (categorySearchData, categories) => {
    createAllDropdowns();
    // Searching
    this.populateDropdownOptions(this.searchDropdown, categorySearchData);
    // Coloring
    this.populateDropdownOptions(this.coloringDropdown, categories);
    // Transparent
    this.populateDropdownOptions(this.transparentDropdown, categorySearchData);
    // Click on feature
    this.populateDropdownOptions(this.clickOnFeatureDropdown, categorySearchData);
    // Shaping
    this.populateDropdownOptions(this.shapingDropdown, categories);
  };

  this.setDropdownEventHandlers = (redrawFunction) => {
    this.coloringDropdown.on("change", redrawFunction);

    // Shaping
    this.shapingDropdown.on("change", redrawFunction);
  };
};