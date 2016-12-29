var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // setup x 
var xValue = function(d) {return d.x;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) {return d["y"];}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

// setup fill color
var category = "Select";
var cValue = function(d) { return d[category];},
    color = d3.scale.category10();

//create the dropdown menu
var dropDown = d3.select("body").append("select")
                 .attr("class", "select1")
                 .attr("name", "category");

var dropDown1 = d3.select("body").append("select")
                 .attr("class", "select2")
                 .attr("name", "category");

var category_search;
var category_search_data = [];
var categories = ["Select"];
var temp = [];

// getting header files in csv file
d3.csv("joined_data.csv", function(data) {
  //gives the keys and first values of our dataset
  console.log(data[0]);
  //to get an array with the keys of the data
  temp = Object.keys(data[0]);
  //remove the first element of both x and y so that you can get just the index numbers of the dataset
  temp.splice(temp.indexOf('x'), 1);
  temp.splice(temp.indexOf('y'), 1);
  // for loop to create category_search_data which contains the selected datapoints 
  for(var i=0;i<temp.length;i++)
      category_search_data.push(temp[i]);
  // for loop to create cateogies which contains the selected datapoints
  for(var i=0;i<temp.length;i++)
      categories.push(temp[i]);
  //input the SELECT option as the first entry
  category = categories[0];
  //select first element from category_search_data
  category_search = category_search_data[0];
  dropDown1.selectAll("option")
        .data(category_search_data)
        .enter()
        .append("option")
        .text(function(d) { return d;})
        .text(function(d) {return d;});
  dropDown.selectAll("option")
        .data(categories)
        .enter()
        .append("option")
        .text(function(d) { return d;})
        .text(function(d) {return d;});

});

dropDown.on("change", plotting);
dropDown1.on("change", plotting2);

highlighting("");

function plotting2(){
    category_search = d3.event.target.value; 
}

// function to call for change event
function plotting(){

    category = d3.event.target.value; 
    color = d3.scale.category10();

    cValue = function(d) { return d[category];};
    highlighting(""); 
    d3.csv("joined_data.csv", function (error, data){
    	var first = "'";
    	first += category;
    	first += "'";

    if (!categories.includes("time"))
  	d3.selectAll(".chart").remove();
    
})}


// search event
function handleClick(event){

                console.log(document.getElementById("myVal").value);
                highlighting(document.getElementById("myVal").value);
        
                return false;
            }

function highlighting(val){
var svg
  d3.selectAll("svg").remove();
  svg = d3.select("#map").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

var data;

var impacts = svg.append("g")

d3.csv("joined_data.csv", function (error,csv){
  var dtgFormat = d3.time.format("%Y-%m-%dT%H:%M:%S");
  rawData = csv;
  data = [];
  rawData.forEach(function(d){
      d.id = +d.id
      d.x = +d.x;
      d["y"] = +d["y"];
      d.year = +d.year;
      d.intensity = +d.intensity;
      d.dtg = dtgFormat.parse(d.neworigintime.substr(0,19));
      data.push(d);
  })

  data.sort(function(a, b){return a.id - b.id;})

val = val.toLowerCase(); 
    var searchFunc = function(d){
                    var x=d[category_search].toLowerCase().indexOf(val) < 0
                    || val.length === 0;
                return x ? 1 : 2;};
    var trans = function(d){
                    var x = val.length === 0;
                    return x ? 1 : (searchFunc(d)-1 ? 1:0.65); 
                };

// don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("");

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("");


var colours = ["#6363FF", "#6373FF", "#63A3FF", "#63E3FF", "#63FFFB", "#63FFCB",
               "#63FF9B", "#63FF6B", "#7BFF63", "#BBFF63", "#DBFF63", "#FBFF63", 
               "#FFD363", "#FFB363", "#FF8363", "#FF7363", "#FF6364"];

var heatmapColour = d3.scale.linear()
  .domain(d3.range(0, 1, 1.0 / (colours.length - 1)))
  .range(colours);

// dynamic bit...
var c = d3.scale.linear().domain([d3.min(data, function(d) {return cValue(d)}), 
								  d3.max(data, function(d) {return cValue(d)})])
								.range([0,1]);

console.log(d3.max(data, function(d) {return cValue(d)}))
if(!isNaN(+d3.max(data, function(d) {return cValue(d)})))
    console.log("hello!");

  impacts.selectAll(".dot")
    .data(data).enter()
      .append("circle")
      .attr("class", "dot")
        .attr("cx", xMap)
        .attr("cy", yMap)
        .attr("r",  function(d){ return searchFunc(d)-1 ? 7:3 ; })
        .attr("id", function(d){return "id" + d.id;})
        .style("stroke", function(d){ return searchFunc(d)-1 ? "yellow":"#000";})
        .style("stroke-width", function(d){ return searchFunc(d);})
        .style("fill", function(d) {return !isNaN(+d3.max(data, function(d) {return cValue(d)})) ? heatmapColour(c(cValue(d))): color(cValue(d));})
        .style("opacity",function(d){ return trans(d);})
    .on("mouseover", function(d) {

        tooltip.transition()
               .duration(200)
               .style("opacity", 1);
        tooltip.html(d[category_search] 
                  + "<br/> (" + xValue(d) 
          + ", " + yValue(d) + ")")
               .style("left", 60 + "px")
               .style("top", 30 + "px");
                 
        })
        .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0)
        });

        var len = color.domain().length;
  
  if(len <= 20 && category != "Select"){

     // draw legend
  var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;});
    };
      
var facts = crossfilter(data),
    all = facts.groupAll(),
    year = facts.dimension(function(d){return d.year;}),
    years = year.group(function(d){return Math.floor(d/10)*10;}),
    date = facts.dimension(function (d) {return d.dtg; }),
    dates = date.group(d3.time.day),
    volumeByHour = facts.dimension(function(d) {return d3.time.hour(d.dtg); }),
    volumeByHourGroup = volumeByHour.group().reduceCount()
    dataId = facts.dimension(function(d){return d.id;});
    dataIds = dataId.group()
    intensity = facts.dimension(function(d) {return d.intensity;})

  var minDate     =new Date(d3.min(data, function(d) { return d3.time.day(d.dtg); }));
  var maxDate     =new Date(d3.max(data, function(d) { return d3.time.day(d.dtg); }));

  var newminDate  = d3.time.day.offset(minDate, -3);
  var newmaxDate  = d3.time.day.offset(maxDate, +3);

  var charts = [
barChart()
        .dimension(date)
        .group(dates)
        .round(d3.time.day.round)
      .x(d3.time.scale()
        .domain([newminDate, newmaxDate])
        .rangeRound([0, 10 * 90]))
        ];

  var chart = d3.selectAll(".chart")
      .data(charts)
      .each(function(chart){chart.on("brush", renderAll).on("brushend", renderAll)});

  d3.selectAll("#total")
      .text(facts.size());


  function render(method){
    d3.select(this).call(method);
  }


  lastFilterArray = [];
  data.forEach(function(d, i){
    lastFilterArray[i] = 1;
  });

  function renderAll(){
    chart.each(render);

    var filterArray = dataIds.all();
    filterArray.forEach(function(d, i){
      if (d.value != lastFilterArray[i]){
        lastFilterArray[i] = d.value;
        d3.select("#id" + d.key).transition().duration(500)
            .attr("r", d.value == 1 ? function(d){ return searchFunc(d)-1 ? 7:3 ; } : 0)
      }
    })

    d3.select("#active").text(all.value());
  }

  window.reset = function(i){
    charts[i].filter(null);
    renderAll();
  }

  renderAll();
})

}
