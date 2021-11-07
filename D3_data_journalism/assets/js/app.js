//var svgWidth = 960;
//var svgHeight = 500;

// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Read CSV
  d3.csv("assets/data/data.csv").then(function(CensusData) {
    console.log(CensusData);

      // create date parser
     // var dateParser = d3.timeParse("%d-%b");

      // parse data
      CensusData.forEach(function(data) {
        data.poverty = +data.poverty ;
        data.age = +data.age;
        data.healthcare = +data.healthcare
        data.smokes =  +data.smokes;
        data.income =  +data.income;
        data.obesity = +data.obesity;

      });

      // create scales
      // x-axis left to right
      var xPovertyScale = d3.scaleLinear()
        .domain(d3.extent(CensusData, d => d.poverty))
        .range([0, width]);

      var yHealthCareScale = d3.scaleLinear()
      // input raw values
        .domain([0, d3.max(CensusData, d => d.healthcare)])
        .range([height, 0]);

      // create axes
      var xAxis = d3.axisBottom(xPovertyScale);
      var yAxis = d3.axisLeft(yHealthCareScale);

      // place axes inside the chart group
      var xAxisGroup = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        xAxisGroup.call(xAxis);

    // appened g element 

    var yAxisGroup = chartGroup.append("g")
    yAxisGroup.call(yAxis);

  
      // append circles
      var circlesGroup = chartGroup.append("g");

      circlesGroup.selectAll("circle")
         // bind the data came from the api
        .data(CensusData)
        .enter()
        .append("circle")
        .attr("cx", d => xPovertyScale(d.poverty))
        .attr("cy", d => yHealthCareScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "gold")
        .attr("stroke-width", "1")
        .attr("stroke", "black")
        .attr("opacity", ".9");


        chartGroup.append("text")
        .attr("x", width/2)
        .attr("y", height+40)
        //.classed("active", true)
        .text(" In poverty (%)");

      //// append y axis
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks HealthCare %");
       
      // add text to data point

      circlesGroup.selectAll("text")
        // bind the data came from the api
       .data(CensusData)
      .enter()
      .append("text")
      .text(d=>d.abbr)
       .attr("dx", d => xPovertyScale(d.poverty) -6)
       .attr("dy", d => yHealthCareScale(d.healthcare) +3)
       .attr("opacity", ".5")
       .attr("font-size", "10px");
       
      // .attr("r", "15")
      // .attr("fill", "gold")
      // .attr("stroke-width", "1")
      // .attr("stroke", "black");

      // Date formatter to display dates nicely
      //var dateFormatter = d3.timeFormat("%d-%b");
      //text to each dataPoint

      // Step 1: Initialize Tooltip
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`<strong>${dateFormatter(d.poverty)}<strong><hr>${d.healthcare}
          medal(s) won`);
        });

      // Step 2: Create the tooltip in chartGroup.
      chartGroup.call(toolTip);

      // Step 3: Create "mouseover" event listener to display tooltip
      circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
      // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });
    }).catch(function(error) {
      console.log(error);
    });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
