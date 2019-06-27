

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var projection = d3.geoMercator()
    .center([-60,.5])
    .scale(2000)
    .translate([ width, height ])

d3.json("graph/map.geojson", function(data){
    svg.append("g")
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("fill","#75a344")
      .attr("d", d3.geoPath()
      .projection(projection)
      )
})
