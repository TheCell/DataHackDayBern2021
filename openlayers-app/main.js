import './style.css';
import {Map, View} from 'ol';
import Vector from 'ol/source/vector';
import GeoJSON from 'ol/format/GeoJSON';
import Circle from 'ol/geom/Circle';
import Feature from 'ol/Feature';
import Projection from 'ol/proj/Projection';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import SourceVector from 'ol/source/vector';
import LayerVector from 'ol/layer/vector';
import VectorSource from 'ol/source/Vector';
import ImageLayer from 'ol/layer/Image';
import TileWMS from 'ol/source/TileWMS';
import VectorImageLayer from 'ol/layer/VectorImage';
import proj4 from 'proj4';
import OSM from 'ol/source/OSM';
import MousePosition from 'ol/control/MousePosition';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {ScaleLine, defaults as defaultControls} from 'ol/control';
import {
  addCoordinateTransforms,
  addProjection,
  transform,
} from 'ol/proj';
import {fromLonLat} from 'ol/proj';
import {createStringXY} from 'ol/coordinate';
import {register} from 'ol/proj/proj4';

// By default OpenLayers does not know about the EPSG:21781 (Swiss) projection.
// So we create a projection instance for EPSG:21781 and pass it to
// ol/proj~addProjection to make it available to the library for lookup by its

const image = new CircleStyle({
  radius: 5,
  fill: null,
  stroke: new Stroke({color: 'red', width: 1}),
});

const styles = {
  'Point': new Style({
    image: image,
  }),
  'LineString': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1,
    }),
  }),
  'MultiLineString': new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1,
    }),
  }),
  'MultiPoint': new Style({
    image: image,
  }),
  'MultiPolygon': new Style({
    stroke: new Stroke({
      color: 'yellow',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.1)',
    }),
  }),
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'blue',
      lineDash: [4],
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)',
    }),
  }),
  'GeometryCollection': new Style({
    stroke: new Stroke({
      color: 'magenta',
      width: 2,
    }),
    fill: new Fill({
      color: 'magenta',
    }),
    image: new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: 'magenta',
      }),
    }),
  }),
  'Circle': new Style({
    stroke: new Stroke({
      color: 'red',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(255,0,0,0.2)',
    }),
  }),
};

const geojsonObject = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
    'properties': {
      'name': 'EPSG:3857',
    },
  },
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [0, 0],
      },
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [4e6, -2e6],
          [8e6, 2e6],
        ],
      },
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [4e6, 2e6],
          [8e6, -2e6],
        ],
      },
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [
            [-5e6, -1e6],
            [-3e6, -1e6],
            [-4e6, 1e6],
            [-5e6, -1e6],
          ],
        ],
      },
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiLineString',
        'coordinates': [
          [
            [-1e6, -7.5e5],
            [-1e6, 7.5e5],
          ],
          [
            [1e6, -7.5e5],
            [1e6, 7.5e5],
          ],
          [
            [-7.5e5, -1e6],
            [7.5e5, -1e6],
          ],
          [
            [-7.5e5, 1e6],
            [7.5e5, 1e6],
          ],
        ],
      },
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'MultiPolygon',
        'coordinates': [
          [
            [
              [-5e6, 6e6],
              [-3e6, 6e6],
              [-3e6, 8e6],
              [-5e6, 8e6],
              [-5e6, 6e6],
            ],
          ],
          [
            [
              [-2e6, 6e6],
              [0, 6e6],
              [0, 8e6],
              [-2e6, 8e6],
              [-2e6, 6e6],
            ],
          ],
          [
            [
              [1e6, 6e6],
              [3e6, 6e6],
              [3e6, 8e6],
              [1e6, 8e6],
              [1e6, 6e6],
            ],
          ],
        ],
      },
    },
    {
      'type': 'Feature',
      'geometry': {
        'type': 'GeometryCollection',
        'geometries': [
          {
            'type': 'LineString',
            'coordinates': [
              [-5e6, -5e6],
              [0, -5e6],
            ],
          },
          {
            'type': 'Point',
            'coordinates': [4e6, -5e6],
          },
          {
            'type': 'Polygon',
            'coordinates': [
              [
                [1e6, -6e6],
                [3e6, -6e6],
                [2e6, -4e6],
                [1e6, -6e6],
              ],
            ],
          },
        ],
      },
    },
  ],
};

const styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()];
};

const vectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(geojsonObject),
});

vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));

proj4.defs("EPSG:2056","+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs");

proj4.defs(
  'EPSG:21781',
  '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 ' +
    '+x_0=600000 +y_0=200000 +ellps=bessel ' +
    '+towgs84=660.077,13.551,369.344,2.484,1.783,2.939,5.66 +units=m +no_defs'
);
register(proj4);

const swissCoord = transform([8.23, 46.86], 'EPSG:2056', 'EPSG:3857');

const projection = new Projection({
  code: 'EPSG:21781',
  // The extent is used to determine zoom level 0. Recommended values for a
  // projection's validity extent can be found at https://epsg.io/.
  extent: [485869.5728, 76443.1884, 837076.5648, 299941.7864],
  units: 'm',
});
addProjection(projection);

// We also declare EPSG:21781/EPSG:4326 transform functions. These functions
// are necessary for the ScaleLine control and when calling ol/proj~transform
// for setting the view's initial center (see below).

addCoordinateTransforms(
  'EPSG:4326',
  projection,
  function (coordinate) {
    return [
      WGStoCHy(coordinate[1], coordinate[0]),
      WGStoCHx(coordinate[1], coordinate[0]),
    ];
  },
  function (coordinate) {
    return [
      CHtoWGSlng(coordinate[0], coordinate[1]),
      CHtoWGSlat(coordinate[0], coordinate[1]),
    ];
  }
);

const extent = [420000, 30000, 900000, 350000];
const layers = [
  new TileLayer({
    extent: extent,
    source: new TileWMS({
      url: 'https://wms.geo.admin.ch/',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://shop.swisstopo.admin.ch/en/products/maps/national/lk1000"' +
        'target="_blank">Pixelmap 1:1000000 / geo.admin.ch</a>',
      params: {
        'LAYERS': 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
        'FORMAT': 'image/jpeg',
      },
      serverType: 'mapserver',
    }),
  }),
  new TileLayer({
    extent: extent,
    source: new TileWMS({
      url: 'https://wms.geo.admin.ch/',
      crossOrigin: 'anonymous',
      attributions:
        '© <a href="https://www.hydrodaten.admin.ch/en/notes-on-the-flood-alert-maps.html"' +
        'target="_blank">Flood Alert / geo.admin.ch</a>',
      params: {'LAYERS': 'ch.bafu.hydroweb-warnkarte_national'},
      serverType: 'mapserver',
    }),
  }),
  new VectorLayer({
    source: vectorSource,
    style: styleFunction,
  }),
];


// new VectorImageLayer({
//   imageRatio: 2,
//   source: new VectorSource({
//     // url: './data/kanton_bern_gemeinden_epsg_2056.geojson',
//     url: './data/wfs.geo.bs.ch.geojson',
//     format: new GeoJSON(),
//   }),
//   style: function (feature) {
//     style.getText().setText(feature.get('name'));
//     return style;
//   },
// }),

console.log(layers);

const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4),
  projection: 'EPSG:4326',
  // comment the following two lines to have the mouse position
  // be placed within the map.
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position'),
});

const map = new Map({
  controls: defaultControls().extend([
    new ScaleLine({
      units: 'metric',
    }), mousePositionControl
  ]),
  layers: layers,
  target: 'map',
  view: new View({
    projection: projection,
    center: transform([8.23, 46.86], 'EPSG:4326', 'EPSG:21781'),
    extent: extent,
    zoom: 2,
  }),
});

// map.on('pointermove', function (evt) {
//   console.log(evt);
// });
// map.on('moveend', onMoveEnd.bind(this));
// this.map.on('dblclick', this.onDoubleClick.bind(this));
// this.map.on('pointermove', this.onPointerMove.bind(this));

// function onMoveEnd() {
//   const view = this.map?.getView();
//   if (!view) {
//     return;
//   }

//   const location = {
//     center: view.getCenter() ?? [],
//     zoom: view.getZoom() ?? 0,
//     rotation: view.getRotation()
//   };

//   console.log(location);
// }



/*
 * Swiss projection transform functions downloaded from
 * https://www.swisstopo.admin.ch/en/knowledge-facts/surveying-geodesy/reference-systems/map-projections.html
 */

// Convert WGS lat/long (° dec) to CH y
function WGStoCHy(lat, lng) {
  // Converts degrees dec to sex
  lat = DECtoSEX(lat);
  lng = DECtoSEX(lng);

  // Converts degrees to seconds (sex)
  lat = DEGtoSEC(lat);
  lng = DEGtoSEC(lng);

  // Axillary values (% Bern)
  const lat_aux = (lat - 169028.66) / 10000;
  const lng_aux = (lng - 26782.5) / 10000;

  // Process Y
  const y =
    600072.37 +
    211455.93 * lng_aux -
    10938.51 * lng_aux * lat_aux -
    0.36 * lng_aux * Math.pow(lat_aux, 2) -
    44.54 * Math.pow(lng_aux, 3);

  return y;
}

// Convert WGS lat/long (° dec) to CH x
function WGStoCHx(lat, lng) {
  // Converts degrees dec to sex
  lat = DECtoSEX(lat);
  lng = DECtoSEX(lng);

  // Converts degrees to seconds (sex)
  lat = DEGtoSEC(lat);
  lng = DEGtoSEC(lng);

  // Axillary values (% Bern)
  const lat_aux = (lat - 169028.66) / 10000;
  const lng_aux = (lng - 26782.5) / 10000;

  // Process X
  const x =
    200147.07 +
    308807.95 * lat_aux +
    3745.25 * Math.pow(lng_aux, 2) +
    76.63 * Math.pow(lat_aux, 2) -
    194.56 * Math.pow(lng_aux, 2) * lat_aux +
    119.79 * Math.pow(lat_aux, 3);

  return x;
}

// Convert CH y/x to WGS lat
function CHtoWGSlat(y, x) {
  // Converts military to civil and to unit = 1000km
  // Axillary values (% Bern)
  const y_aux = (y - 600000) / 1000000;
  const x_aux = (x - 200000) / 1000000;

  // Process lat
  let lat =
    16.9023892 +
    3.238272 * x_aux -
    0.270978 * Math.pow(y_aux, 2) -
    0.002528 * Math.pow(x_aux, 2) -
    0.0447 * Math.pow(y_aux, 2) * x_aux -
    0.014 * Math.pow(x_aux, 3);

  // Unit 10000" to 1 " and converts seconds to degrees (dec)
  lat = (lat * 100) / 36;

  return lat;
}

// Convert CH y/x to WGS long
function CHtoWGSlng(y, x) {
  // Converts military to civil and to unit = 1000km
  // Axillary values (% Bern)
  const y_aux = (y - 600000) / 1000000;
  const x_aux = (x - 200000) / 1000000;

  // Process long
  let lng =
    2.6779094 +
    4.728982 * y_aux +
    0.791484 * y_aux * x_aux +
    0.1306 * y_aux * Math.pow(x_aux, 2) -
    0.0436 * Math.pow(y_aux, 3);

  // Unit 10000" to 1 " and converts seconds to degrees (dec)
  lng = (lng * 100) / 36;

  return lng;
}

// Convert DEC angle to SEX DMS
function DECtoSEX(angle) {
  // Extract DMS
  const deg = parseInt(angle, 10);
  const min = parseInt((angle - deg) * 60, 10);
  const sec = ((angle - deg) * 60 - min) * 60;

  // Result in degrees sex (dd.mmss)
  return deg + min / 100 + sec / 10000;
}

// Convert Degrees angle to seconds
function DEGtoSEC(angle) {
  // Extract DMS
  const deg = parseInt(angle, 10);
  let min = parseInt((angle - deg) * 100, 10);
  let sec = ((angle - deg) * 100 - min) * 100;

  // Avoid rounding problems with seconds=0
  const parts = String(angle).split('.');
  if (parts.length == 2 && parts[1].length == 2) {
    min = Number(parts[1]);
    sec = 0;
  }

  // Result in degrees sex (dd.mmss)
  return sec + min * 60 + deg * 3600;
}