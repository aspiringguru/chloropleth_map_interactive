// Set the dimensions of the canvas / graph
var	margin = {top: 30, right: 20, bottom: 30, left: 50},
	width = 400 - margin.left - margin.right,
	height = 220 - margin.top - margin.bottom;

// Set the ranges
var	x = d3.scaleTime().range([0, width]);
var	y = d3.scaleLinear().range([height, 0]);

// Define the axes
//var	xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5);
var	xAxis = d3.axisBottom().scale(x).ticks(5);

//var	yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);
var	yAxis = d3.axisLeft().scale(y).ticks(5);

// Define the line
var	valueline = d3.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.close); });

// Adds the svg canvas
//var	chart1 = d3.select("body")
var	chart1 = d3.select("#chart1")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// parse the date / time
//sample from .csv file
// date,close
// 1-May-12,58.13
var parseTime = d3.timeParse("%d-%b-%y");
//https://github.com/d3/d3-time-format#timeParse

// Get the data
d3.csv("data/data1.csv", function(error, data) {
  //console.log(data)
  data.forEach(function(d) {
		//d.date = parseDate(d.date);
    //d.date = new Date(d.date)
    d.date = parseTime(d.date);
		d.close = +d.close;
    //console.log(d.date+", "+d.close)
	});
  //console.log("end loading .csv")
	// Scale the range of the data
	x.domain(d3.extent(data, function(d) { return d.date; }));
	y.domain([0, d3.max(data, function(d) { return d.close; })]);
  //console.log("x, y domains set")

  // Add the valueline path.
  chart1.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

	// Add the X Axis
	chart1.append("g")
		//.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	// Add the Y Axis
	chart1.append("g")
		//.attr("class", "y axis")
		.call(yAxis);
});
