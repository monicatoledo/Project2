var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "year";
var chosenYAxis = "profit_mean";
// define an array of colors for each country (6)
var color = d3.scaleOrdinal()
  .range(["green","blue","orange","purple","grey","yellow","red","pink","black"]);
var xScale = d3.scaleTime().range([0,width]);

function yScale(movieData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(movieData, d => d[chosenYAxis]),
        d3.max(movieData, d => d[chosenYAxis])
      ])
      .range([height,0]);
  
    return yLinearScale;
}

function renderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
    
    return yAxis;
}

function renderCircles(circlesGroup, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));
  
  return circlesGroup;
};

// function used for updating circles group with new tooltip
function updateToolTip(chosenYAxis, circlesGroup) {
    if (chosenYAxis === "profit_mean") {
      var label = "Average Profit: ";
    }
    else {
      var label = "Total Profit:";
    }
  
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.country}<br>${label} ${d[chosenYAxis]} USD <br> Year: ${d.year}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
};

var parseDate = d3.timeParse("%Y");

// Retrieve data from CSV file
d3.csv("/static/data/movieXcountry.csv",function(err,movieData){
    if(err) throw err;
    //parse data
    movieData.forEach(function(data){
        data.profit_sum = +data.profit_sum;
        data.profit_mean = +data.profit_mean;
        data.year = parseDate(data.year);
    });
    
  //yLinearScale function above csv import
  var yLinearScale = yScale(movieData, chosenYAxis);
  //console.log(xLinearScale);
  // Create x scale function
  var xTimeScale = xScale.domain([
      parseDate("2000"),//d3.min(movieData, d => d.year), 
      d3.max(movieData, d => d.year)
    ]);
  
  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xTimeScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  
  var colorScale = color.domain([d3.keys(movieData, d => d.country)]);
  // append x axis
  chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);
  
  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(movieData)
    .enter()
    .append("circle")
    .attr("class", "countryCircle")
    .attr("cx", d => xTimeScale(d.year))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 6.5)
    .style("fill", d => colorScale(d.country))
    .attr("opacity", ".7");

  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  var meanLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "profit_mean") // value to grab for event listener
    .classed("active", true)
    .text("Average Profit");
  
  var sumLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "profit_sum") // value to grab for event listener
    .classed("inactive", true)
    .text("Total Profit");
  
  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Profit (USD)");
  
  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {
      // replaces chosenYaxis with value
      chosenYAxis = value;
      //console.log(chosenXAxis)
      // functions here found above csv import
      // updates y scale for new data
      yLinearScale = yScale(movieData, chosenYAxis);
      // updates x axis with transition
      yAxis = renderAxes(yLinearScale, yAxis);
      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);
      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
      // changes classes to change bold text
      if (chosenYAxis === "profit_mean") {
        meanLabel
          .classed("active", true)
          .classed("inactive", false);
        sumLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        meanLabel
          .classed("active", false)
          .classed("inactive", true);
        sumLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });
});



// Data by genre
// need to update some variables

var svg2 = d3
    .select("#chart2")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append an SVG group
var chartGroup2 = svg2.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// function used for updating circles group with new tooltip
function updateToolTip2(chosenYAxis, circlesGroup) {
    if (chosenYAxis === "profit_mean") {
      var label = "Average Profit: ";
    }
    else {
      var label = "Total Profit:";
    }
  
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.genre1}<br>${label} ${d[chosenYAxis]} USD <br> Year: ${d.year} `);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
};

// Retrieve data from CSV file
d3.csv("/static/data/movieXgenre.csv",function(err,movieData){
    if(err) throw err;
    //parse data
    movieData.forEach(function(data){
        data.profit_sum = +data.profit_sum;
        data.profit_mean = +data.profit_mean;
        data.year = parseDate(data.year);
    });
    
  //yLinearScale function above csv import
  var yLinearScale = yScale(movieData, chosenYAxis);
  //console.log(xLinearScale);
  // Create x scale function
  var xTimeScale = xScale.domain([
      parseDate("2000"),//d3.min(movieData, d => d.year), 
      d3.max(movieData, d => d.year)
    ]);
  
  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xTimeScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  
  var colorScale = color.domain([d3.keys(movieData, d => d.genre1)]);
  // append x axis
  chartGroup2.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  // append y axis
  var yAxis = chartGroup2.append("g")
    .call(leftAxis);
  
  // append initial circles
  var circlesGroup = chartGroup2.selectAll("circle")
    .data(movieData)
    .enter()
    .append("circle")
    .attr("class", "countryCircle")
    .attr("cx", d => xTimeScale(d.year))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 4.5)
    .style("fill", d => colorScale(d.genre1))
    .attr("opacity", ".7");

  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup2.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  var meanLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "profit_mean") // value to grab for event listener
    .classed("active", true)
    .text("Average Profit (USD)");
  
  var sumLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "profit_sum") // value to grab for event listener
    .classed("inactive", true)
    .text("Total Profit (USD)");
  
  // append y axis
  chartGroup2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Profit (USD)");
  
  // updateToolTip function above csv import
  var circlesGroup = updateToolTip2(chosenYAxis, circlesGroup);
  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {
      // replaces chosenYaxis with value
      chosenYAxis = value;
      //console.log(chosenXAxis)
      // functions here found above csv import
      // updates y scale for new data
      yLinearScale = yScale(movieData, chosenYAxis);
      // updates x axis with transition
      yAxis = renderAxes(yLinearScale, yAxis);
      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);
      // updates tooltips with new info
      circlesGroup = updateToolTip2(chosenYAxis, circlesGroup);
      // changes classes to change bold text
      if (chosenYAxis === "profit_mean") {
        meanLabel
          .classed("active", true)
          .classed("inactive", false);
        sumLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        meanLabel
          .classed("active", false)
          .classed("inactive", true);
        sumLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });
});
