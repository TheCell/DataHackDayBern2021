
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

let EPSG2056 = new L.Proj.CRS(lv95.epsg, lv95.def, {
	resolutions: lv95.resolutions,
	origin: lv95.origin
})

gemeindeGeoJSON.crs = crsEPSG2056Def
bezirkeGeoJSON.crs = crsEPSG2056Def

tileLayerOption = 'ch.swisstopo.pixelkarte-farbe-pk50.noscale';
// let options = {
// 	gemeinde: {
// 		identifier_field: '',
// 		value_field: '',
// 		customMinValue: 0,
// 		customMaxValue: 0,
// 		matchedData: {
// 			showTooltip: true,
// 			tooltipText: '',
// 			style: {
// 			}
// 		}
// 	}
// };
// var swissLayer = L.tileLayer.swiss().addTo(map);

let swissLayer = L.tileLayer.swiss({
	// attribution: options.map.tileAttribution,
	// Coordinate reference system. EPSG2056 and EPSG21781 are available.
	crs: EPSG2056,
	// Image format (jpeg or png). Only one format is available per layer.
	format: swissTopoLayers[tileLayerOption].format,
	// Layer name.
	layer: swissTopoLayers[tileLayerOption].layer,
	// Minimum zoom. Levels below 14 exist for technical reasons,
	// but you probably do not want to use them.
	minZoom: swissTopoLayers[tileLayerOption].minZoom,
	// Maximum zoom. Availability of zoom levels depends on the layer.
	maxNativeZoom: swissTopoLayers[tileLayerOption].maxNativeZoom,
	// Timestamp. Most (but not all) layers have a 'current' timestamp.
	// Some layers have multiple versions with different timestamps.
	timestamp: swissTopoLayers[tileLayerOption].timestamp,
	// Map tile URL. Appropriate defaults are chosen based on the crs option.
	url: swissTopoLayers[tileLayerOption].url
});

var crs = new L.Proj.CRS('EPSG:3006',
	'+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
	{
		resolutions: [
			8192, 4096, 2048, 1024, 512, 256, 128,
			64, 32, 16, 8, 4, 2, 1, 0.5
		],
		origin: [0, 0],
		bounds: L.bounds([218128.7031, 6126002.9379], [1083427.2970, 7692850.9468])
	}),
	map = new L.Map('map', {
		crs: crs,
	});

L.tileLayer('https://api.geosition.com/tile/osm-bright-3006/{z}/{x}/{y}.png', {
	maxZoom: 14,
	minZoom: 0,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, Imagery &copy; <a href="http://www.kartena.se/">Kartena</a>'
}).addTo(map);

map.setView([7.1, 42.965], 13);
