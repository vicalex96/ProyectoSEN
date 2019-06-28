

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
    .selectAll("line")
    .data(association)
    .enter()
    .append("line")
    .attr("x1", (d) => {
        if(d.coordenadasNodo1){
            return  projection([d.coordenadasNodo1[0], d.coordenadasNodo1[1]])[0];
        }
    })
    .attr("y1", (d) => {
        if(d.coordenadasNodo1){
            return  projection([d.coordenadasNodo1[0], d.coordenadasNodo1[1]])[1];
        }
    })
    .attr("x2",(d) => {
        if(d.coordenadasNodo2){
            return  projection([d.coordenadasNodo2[0], d.coordenadasNodo2[1]])[0];
        }
    })
    .attr("y2",(d) => {
        if(d.coordenadasNodo2){
            return  projection([d.coordenadasNodo2[0], d.coordenadasNodo2[1]])[1];
        }
    })
    .attr("stroke-width", 5)
    .attr("stroke", "black")
    .on('mouseover', function(d) {
        d3.select(this)
          .transition()
        .attr("stroke", "orange")
    d3.select('#nodoSalida').text(d.nombre_nodo1);
    d3.select('#nodoLlegada').text(d.nombre_nodo2);
    d3.select('#capacidad').text(d.capacidad + ' KW');
    d3.select('#infoAsociacion')
        .style('left', (projection([d.coordenadasNodo1[0], d.coordenadasNodo1[1]])[0] +400) + 'px')
        .style('top', (projection([d.coordenadasNodo1[0], d.coordenadasNodo1[1]])[1] +250) + 'px')
        .style('position', 'fixed')
        .style('display','inline')
        .style('background-color','#EC9B0E')
    })
    .on('mouseout', function(d){
        d3.select(this)
        .transition()
        .attr("stroke", "black")

        d3.select('#infoAsociacion')
        .style('display','none')
  })


svg.append("g")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append('circle')
    .attr("stroke", "#B5B5B5")
    .attr("stroke-width", 2)
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
        .style('left', (  projection([d.coordenadas[0], d.coordenadas[1]])[0] +415) + 'px')
        .style('top', (projection([d.coordenadas[0], d.coordenadas[1]])[1] +120) + 'px')
        .style('position', 'fixed')
        .style('display','inline')
        .style('background-color','#EC9B0E')

    })
    .on('mouseout', function(d){

      d3.select(this)
      .transition()
      .attr('r', 5);

      d3.select('#infoNodo')
      .style('display','none')
    });

})
