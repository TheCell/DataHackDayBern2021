let lv95 = {
    epsg: 'EPSG:2056',
    def: '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
    resolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5],
    origin: [2420000, 1350000]
}

let crsEPSG2056Def = {
    type: 'name',
    properties: {name: 'urn:ogc:def:crs:EPSG::2056'}
}

// let EPSG2056 = new L.Proj.CRS(lv95.epsg, lv95.def, {
//     resolutions: lv95.resolutions,
//     origin: lv95.origin
// })

// Create map and attach id to element with id "mapid"
var map = L.map('mapid', {
    // Use LV95 (EPSG:2056) projection
    crs: L.CRS.EPSG2056,
  });
  
  // Add Swiss layer with default options
  var swissLayer = L.tileLayer.swiss().addTo(map);
  
  // Center the map on Switzerland
  map.fitSwitzerland();
  
  // Add a marker with a popup in Bern
  L.marker(L.CRS.EPSG2056.unproject(L.point(2600000, 1200000))).addTo(map)
    .bindPopup('Bern')
    .openPopup();