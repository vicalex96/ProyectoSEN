

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




svg.append("g")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append('circle')
    .attr('cx', function(d){
      if(d.coordenadas){
          return  projection([d.coordenadas[0], d.coordenadas[1]])[0];
      }
    })
    .attr('cy', function(d){
        if(d.coordenadas){
            return  projection([d.coordenadas[0], d.coordenadas[1]])[1];
        }
    })
    .attr('r', 5)
    .attr('fill', (d)=>{
         switch (d.tipo_nodo) {
          case "Termoelectrica":
              return "blue"
              break;
          case "Generacion":
              return "red"
              break;
          case "Distribucion":
              return "green"
              break;
          }
      })
      .on('mouseover', function(d) {
          d3.select(this)
            .transition()
            .attr('r', 20);
          d3.select('#nombre').text(d.nombre);
      d3.select('#tipo').text(d.tipo_nodo);
      d3.select('#longitud').text(d.coordenadas[0]);
      d3.select('#latitud').text(d.coordenadas[1]);
      d3.select('#infoNodo')
        .style('left', (  projection([d.coordenadas[0], d.coordenadas[1]])[0] +400) + 'px')
        .style('top', (projection([d.coordenadas[0], d.coordenadas[1]])[1] +120) + 'px')
        .style('position', 'fixed')
        .style('display','inline')
        .style('background-color','grey')

    })
    .on('mouseout', function(d){

      d3.select(this)
      .transition()
      .attr('r', 5);

      d3.select('#infoNodo')
      .style('display','none')
    });

})
