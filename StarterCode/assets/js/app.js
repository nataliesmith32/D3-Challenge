var svgWidth = 960;
var svgHeight = 550;

var margin = {
  top: 60,
  right: 80,
  bottom: 120,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .style("background-color", 'white')
  .style("shadow", 'black')
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Append a div element in order to add in the chart
  d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0)

// Import Data
d3.csv("assets/data/data.csv").then(function(censusdata) {

// Parse Data/Cast as numbers
    censusdata.forEach(function(data) {
      data.obesity = +data.obesity;
      data.poverty= +data.poverty;
    });

// Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusdata, d => d.obesity) * 0.8, d3.max(censusdata, d => d.obesity) * 1.2])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusdata, d => d.poverty)])
      .range([height, 0]);

// Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
// Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

// Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("stroke", "black")
    .attr("opacity", ".5");

// Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(data) {
        var stateName = d.abbr;
        var obesityinfo = +d.obesity;
        var povertyinfo = +d.poverty;
      });

// Create tooltip in the chart
    chartGroup.call(toolTip);

// Create event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

 // Appending a the state labels to the circles on graph
 chartGroup.append("text")
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .selectAll("tspan")
    .data(censusdata)
    .enter()
    .append("tspan")
     .attr("x", function(data) {
         return xLinearScale(data.obesity - 0);
     })
     .attr("y", function(data) {
         return yLinearScale(data.poverty - 0.2);
     })
     .text(function(data) {
         return data.abbr
     });

// Append an SVG group for the xaxis, then display x-axis 
    chartGroup
        .append("g")
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    // Append a group for y-axis, then display it
    chartGroup.append("g").call(leftAxis);

    // Append y-axis label
    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 20)
        .attr("x", 0 - height/2)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text("Poverty Levels (%)")

    // Append x-axis labels
    chartGroup
        .append("text")
        .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top ) + ")"
        )
        .attr("class", "axis-text")
        .text("Obesity Levels (%)");
    });
