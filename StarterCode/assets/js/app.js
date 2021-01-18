// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 620;

var margin = {
  top: 20,
  right: 40,
  bottom: 200,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0)

// Import Data
d3.csv("assets/data/data.csv").then(function(censusdata) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    censusdata.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.obesity= +data.obesity;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusdata, d => d.healthcare)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusdata, d => d.obesity)])
      .range([height, 0]);

  