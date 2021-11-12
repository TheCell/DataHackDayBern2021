const bernLonLat = [7.44744, 46.94809];
// ol.proj.setProj4(ol.proj.proj4);
// WGS84 to your projection
// ol.proj.proj4.register(ol);
// const swissCoord = ol.proj.transform([8.23, 46.86], 'EPSG:4326', 'EPSG:21781'); //2056
const swissCoord = ol.proj.transform([8.23, 46.86], 'EPSG:2056', 'EPSG:3857'); //2056
console.log(swissCoord);

var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }), new VectorSource({
        url: './data/kanton_bern_gemeinden_epsg_2056_simplified.json',
        format: new GeoJSON(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat(bernLonLat),
      zoom: 11
    })
  });