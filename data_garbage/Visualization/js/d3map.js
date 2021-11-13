var url = "https://gist.githubusercontent.com/milafrerichs/78ef5702db2dc514fc2bed465d58406b/raw/f1366ee2a83a9afb1dd2427e9cbd4cd3db8d87ca/bundeslaender_simplify200.geojson";

d3.json(url).then(function(bb) {
  var bbox = d3.select('body').node().getBoundingClientRect()
  var width = window.innerWidth;
  var height = window.innerHeight;
  var projection = d3.geoEqualEarth();
  projection.fitExtent([[20, 20], [width, height]], bb);
  var geoGenerator = d3.geoPath().projection(projection);
  var svg = d3.select("#d3map").append('svg')
      .style("width", "100%")
      .style("height", "100%");
  svg.append('g').selectAll('path')
  .data(bb.features)
  .enter()
    .append('path')
    .attr('d', geoGenerator)
    .attr('fill', '#088')
    .attr('stroke', '#000');
});