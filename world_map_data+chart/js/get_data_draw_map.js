//console.log("screen.width:", screen.width)
//console.log("screen.height:", screen.height)
var glob_error, glob_topo;

function myFunction() {
  var proj_type = document.getElementById("mySelect").value;
  document.getElementById("demo").innerHTML = "You selected: " + proj_type;
  switch (proj_type) {
    case "geoMercator":
      //console.log("geoMercator selected")
      projection = proj_geoMercator;
      svg.selectAll("*").remove();
      ready(glob_error, glob_topo)
      break;
    case "geoLoximuthal":
      //console.log("geoLoximuthal selected")
      projection = proj_geoLoximuthal;
      svg.selectAll("*").remove();
      ready(glob_error, glob_topo)
      break;
    case "geoLittrow":
      //console.log("geoLittrow selected")
      projection = proj_geoLittrow;
      svg.selectAll("*").remove();
      ready(glob_error, glob_topo)
      break;
    case "geoLaskowski":
      //console.log("geoLaskowski selected")
      projection = proj_geoLaskowski;
      svg.selectAll("*").remove();
      ready(glob_error, glob_topo)
      break;
    case "geoEquirectangular":
      //console.log("geoEquirectangular selected")
      projection = proj_geoEquirectangular;
      svg.selectAll("*").remove();
      ready(glob_error, glob_topo)
      break;
    case "geoMiller":
      //console.log("geoMiller selected")
      projection = proj_geoMiller;
      svg.selectAll("*").remove();
      ready(glob_error, glob_topo)
      break;
  }
}
var world_pop_cr_iso = []
elem_country_name = document.getElementById("country_name");
elem_country_code = document.getElementById("country_code");
elem_population   = document.getElementById("population");
elem_SandP   = document.getElementById("SandP");
//console.log("elem_country_name:", elem_country_name)
//console.log("elem_country_code:", elem_country_code)
//console.log("elem_population:", elem_population)
//console.log("elem_SandP:", elem_SandP)
// The svg
// var element = d3.select('#myjumbo').node();
// elem_width = element.getBoundingClientRect().width
// elem_height = element.getBoundingClientRect().height
// var svg = d3.select("#my_map"),
//   width = elem_width,
//   height = elem_height;

//var svg = d3.select("svg"),
var svg = d3.select("#my_map"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

//console.log("svg = ", svg)
//console.log("svg width = ", width)
//console.log("svg height = ", height)

// Map and projection
var path = d3.geoPath();
//refer > https://github.com/d3/d3-geo-projection#projections
var projection
var proj_geoMercator = d3.geoMercator()
  .scale(100)
  .center([0,20])
  .translate([width / 2, height / 2]);
projection = proj_geoMercator;
//var projection = d3.geoLoximuthal()
//var projection = d3.geoLittrow()
//var projection = d3.geoLaskowski()
//var projection = d3.geoEquirectangular()
//var projection = d3.geoMiller()
var proj_geoLoximuthal = d3.geoLoximuthal()
  .scale(100)
  .center([0,20])
  .translate([width / 2, height / 2]);
var proj_geoLittrow = d3.geoLittrow()
  .scale(100)
  .center([0,20])
  .translate([width / 2, height / 2]);
var proj_geoLaskowski = d3.geoLaskowski()
  .scale(100)
  .center([0,20])
  .translate([width / 2, height / 2]);
var proj_geoEquirectangular = d3.geoEquirectangular()
  .scale(100)
  .center([0,20])
  .translate([width / 2, height / 2]);
var proj_geoMiller = d3.geoMiller()
  .scale(100)
  .center([0,20])
  .translate([width / 2, height / 2]);


// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
  .domain([ 100000,
            1000000,
            10000000,
            30000000,
            100000000,
            500000000])
  .range(d3.schemeBlues[7]);

// Load external data and boot
d3.queue()
  //.defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .defer(d3.json, "data/world.geojson")
  //.defer(d3.csv, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) { data.set(d.code, +d.pop); })
  .defer(d3.csv, "data/world_pop_cr_iso.csv", function(d) {
    data.set(d.code, +d.pop);
    world_pop_cr_iso.push(d)
  })
  //name,code,pop
  //df_credit_ratings_iso_codes.csv colnames=Country,SandP,Moody's,Fitch,DBRS,TE,country_,name_,alpha3
  //.defer(d3.csv, "df_credit_ratings_iso_codes.csv", function(d) { data.set(d.alpha3, +d.SandP); })
  .await(ready);

function get_world_pop_cr_iso(country_code){
  //console.log("country_code:",country_code)
  //console.log("world_pop_cr_iso.length:",world_pop_cr_iso.length)
  for (i = 0; i < world_pop_cr_iso.length; i++) {
    temp_ccode = world_pop_cr_iso[i]['code']
    if (temp_ccode === country_code) {
      //console.log("get_world_pop_cr_iso:found match")
      return world_pop_cr_iso[i]
    }
  }
  //console.log("get_world_pop_cr_iso:no match")
  return false
}

function ready(error, topo) {
  //console.log("error:", error)
  //console.log("topo:", topo)
  glob_error = error
  glob_topo = topo
  //console.log("world_pop_cr_iso:\n", world_pop_cr_iso)

  let mouseOver = function(d) {
    //console.log("mouseOver")
    //console.log("data", data)
    //console.log("d=", d)
    //console.log("d keys = ", Object.keys(d))
    //console.log("d.id=", d.id)
    //console.log("d.properties.name=", d.properties.name)
    d.total = data.get(d.id) || 0;
    //console.log("d.total=", d.total)
    world_pop_cr_iso_row = get_world_pop_cr_iso(d.id)
    //console.log("get_world_pop_cr_iso output :", world_pop_cr_iso_row)
    elem_country_code.innerHTML = d.id
    elem_country_name.innerHTML = d.properties.name
    elem_population.innerHTML = "Population : "+d.total.toLocaleString()
    if (world_pop_cr_iso_row['SandP']){
      //console.log("setting elem_SandP.innerHTML, currently=",elem_SandP.innerHTML)
      elem_SandP.innerHTML = "Standard & Poors Credit Rating : "+world_pop_cr_iso_row['SandP']
    } else {
      elem_SandP.innerHTML = "Standard & Poors Credit Rating : "+"NA"
    }
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
  }

  let mouseLeave = function(d) {
    //console.log("mouseLeave")
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent")
  }

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
    }
