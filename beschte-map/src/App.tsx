import React, {useEffect, useRef} from 'react';
// import {DataFrameView, PanelProps} from '@grafana/data';
// import {getLocationSrv} from '@grafana/runtime';
import {GeojsonMapOptions} from './types';
// import {css, cx} from 'emotion';
import L, {LatLngBounds, Layer, LeafletEvent} from 'leaflet';
import 'proj4';
import 'proj4leaflet';
import {Map} from 'react-leaflet';
// import {stylesFactory} from "@grafana/ui";

import './vendor/Leaflet.TileLayer.Swiss.umd.js'
// import 'leaflet/dist/leaflet.css';
import './leaflet.css';
import './marker'
import {Feature, GeometryObject} from 'geojson';
import {swissTopoLayers} from "./swissTopoLayers";

interface PanelProps { }

const BeschteMap: React.FC<PanelProps> = () => {
  const mapRef = useRef<Map | null>(null);
  let valueFieldName = '';

  const data = [{ 'bfs_nummer': 942, 'value': 150, 'slider': '2020-02' },
    { 'bfs_nummer': 572, 'value': 100, 'slider': '2020-02' },
    { 'bfs_nummer': 606, 'value': 50, 'slider': '2020-02' },
    { 'bfs_nummer': 353, 'value': 0, 'slider': '2020-02' }];

  let gemeindeGeoJSON = require('./data/kanton_bern_gemeinden_epsg_2056_simplified.json');

  //https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  const hexToRgb = (hex: string) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
        [parseInt(result[1], 16),                                   //r
            parseInt(result[2], 16),                                //g
            parseInt(result[3], 16)] as [number, number, number]    //b
        : null;
}

const componentToHex = (c: number) => {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

const rgbToHex = (rgb: [number, number, number]) => {
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

//https://newbedev.com/how-to-get-color-value-from-gradient-by-percentage-with-javascript
const pickHex = (color1: [number, number, number], color2: [number, number, number], weight: number) => {
    let w1 = weight;
    let w2 = 1 - w1;
    let rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)] as [number, number, number];
    return rgbToHex(rgb);
}

//https://stackoverflow.com/questions/25835591/how-to-calculate-percentage-between-the-range-of-two-values-a-third-value-is/25835683
const lerp = (inputValue: number, minValue: number, maxValue: number) => {
    if (inputValue < minValue) {
        return 0;
    }
    if (inputValue > maxValue) {
        return 1;
    }
    return (inputValue - minValue) / (maxValue - minValue);
}

const onMapMoveEnd = (event: LeafletEvent) => {
  if (mapRef.current !== null) {
      mapRef.current.leafletElement.invalidateSize();
  }
};

const getGemeindeRow = function (bfs_nummer: number) {
  let rows = data.find(f => f['bfs_nummer'] == bfs_nummer);
  return rows ? rows : null;
};

//https://stackoverflow.com/questions/377961/efficient-javascript-string-replacement
const template = (text: string, dataObj: any) => {
  return text
      .replace(
          /{{(\w*)}}/g,
          function (m, key) {
              return dataObj.hasOwnProperty(key) ? dataObj[key] : key;
          }
      );
};

const onEachGemeindeFeature = (feature: Feature<GeometryObject>, layer: Layer) => {
  //no Tooltip Text defined
  // if (!options.data.gemeinde.matchedData.showTooltip && !options.data.gemeinde.nonMatchedData.showTooltip) {
  //     return;
  // }

  let gemeinde_bfs_nummer = feature?.properties?.bfs_nummer;
  let gemeindeData = getGemeindeRow(gemeinde_bfs_nummer);

  let toolTipText;

  //For non matched Gemeinde
  if (gemeindeData == null) {
      // if (!options.data.gemeinde.nonMatchedData.showTooltip) {
      //     return;
      // }
      toolTipText = template('gemeinde:{bfs_nummer}', feature?.properties);
  } else {
      //Matched Gemeinde
      toolTipText = template('gemeinde:{bfs_nummer}<br>Wert:{value}', gemeindeData);

      // if (options.data.gemeinde.matchedData.showTooltip) {
      //     //Replace all {{key}} occurences with the corresponding field of the datasource
      //     toolTipText = template(options.data.gemeinde.matchedData.tooltipText, gemeindeData);
      // }
  }

  let toolTip = `<Tooltip>${toolTipText}</Tooltip>`;
  layer.bindTooltip(toolTip);    //tooltip => onHover; popup => onClick
};

  //https://github.com/idris-maps/leaflet-custom-projection
  let lv95 = {
    epsg: 'EPSG:2056',
    def: '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
    resolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5],
    origin: [2420000, 1350000] as [number, number]
  }

  let crsEPSG2056Def = {
      type: 'name',
      properties: {name: 'urn:ogc:def:crs:EPSG::2056'}
  }

  gemeindeGeoJSON.crs = crsEPSG2056Def

  let EPSG2056 = new L.Proj.CRS(lv95.epsg, lv95.def, {
    resolutions: lv95.resolutions,
    origin: lv95.origin
  })

  //https://github.com/rkaravia/Leaflet.TileLayer.Swiss
  // @ts-ignore
  let swissLayer = L.tileLayer.swiss({
    attribution: 'beschte-map',
    // Coordinate reference system. EPSG2056 and EPSG21781 are available.
    crs: EPSG2056,
    // Image format (jpeg or png). Only one format is available per layer.
    format: swissTopoLayers['ch.swisstopo.pixelkarte-farbe'].format,
    // Layer name.
    layer: swissTopoLayers['ch.swisstopo.pixelkarte-farbe'].layer,
    // Minimum zoom. Levels below 14 exist for technical reasons,
    // but you probably do not want to use them.
    minZoom: swissTopoLayers['ch.swisstopo.pixelkarte-farbe'].minZoom,
    // Maximum zoom. Availability of zoom levels depends on the layer.
    maxNativeZoom: swissTopoLayers['ch.swisstopo.pixelkarte-farbe'].maxNativeZoom,
    // Timestamp. Most (but not all) layers have a 'current' timestamp.
    // Some layers have multiple versions with different timestamps.
    timestamp: swissTopoLayers['ch.swisstopo.pixelkarte-farbe'].timestamp,
    // Map tile URL. Appropriate defaults are chosen based on the crs option.
    url: swissTopoLayers['ch.swisstopo.pixelkarte-farbe'].url
  });

  useEffect(() => {
    if (mapRef.current !== null) {
        // const bounds = mapRef.current.leafletElement.getBounds();
        // console.log(bounds);
        mapRef.current?.leafletElement.addLayer(swissLayer);
        // return;

        //show gemeinde geojson
        //======================================================================================
        // let allGemeindeRows = getAllGemeindeRows();
        let allGemeindeValues = data
            .filter(f => !isNaN(f['value']))
            .filter(f => f['value'] != undefined)
            .filter(f => f['value'] != null)
            .map(f => f['value']);

        let customMinValueGemeinde = NaN;
        let customMaxValueGemeinde = NaN;

        let minGemeindeValue;
        let maxGemeindeValue;

        //No custom Min Value defined => calculate
        if (isNaN(customMinValueGemeinde) || customMinValueGemeinde == undefined) {
            minGemeindeValue = Math.min.apply(Math, allGemeindeValues);
        } else {
            minGemeindeValue = customMinValueGemeinde;
        }

        //No custom Max Value defined => calculate
        if (isNaN(customMaxValueGemeinde) || customMaxValueGemeinde == undefined) {
            maxGemeindeValue = Math.max.apply(Math, allGemeindeValues);
        } else {
            maxGemeindeValue = customMaxValueGemeinde;
        }

        let gemeindeLayer = L.Proj.geoJson(gemeindeGeoJSON, {
            onEachFeature: onEachGemeindeFeature,
            /* @ts-ignore */
            style: geoJSONStyleGemeinde(minGemeindeValue, maxGemeindeValue)
        });
        mapRef.current?.leafletElement.addLayer(gemeindeLayer);

        /*L.marker(EPSG2056.unproject(L.point(2600000, 1200000))).addTo(mapRef.current.leafletElement)
            .bindPopup('Bern')
            .openPopup();*/

        // updateMap(bounds);
    }
    // eslint-disable-next-line
}, []);

const geoJSONStyleGemeinde = (minValue: number, maxValue: number) => (feat: Feature | undefined) => {
  let gemeinde_bfs_nummer = feat?.properties?.bfs_nummer;
  let gemeindeRow = getGemeindeRow(gemeinde_bfs_nummer);

  //row doesn't exists for this gemeinde
  if (gemeindeRow == null) {
      return {
          fillColor: '#E5E5E5',
          color: '#1A1A1A',
          weight: '1px',
          fillOpacity: '0.7'
      };
  }
  //for rows existing for this gemeinde => calculate color depending on min and max value

  let valueForGemeinde = gemeindeRow['value'];
  //https://stackoverflow.com/questions/25835591/how-to-calculate-percentage-between-the-range-of-two-values-a-third-value-is/25835683
  let factor = lerp(valueForGemeinde, minValue, maxValue);

  const maxFillColor = '#112E4A';
  const minFillColor = '#C3D9EF';

  let calculatedColor = pickHex(
      hexToRgb(maxFillColor)!,
      hexToRgb(minFillColor)!,
      factor);

  return {
      fillColor: calculatedColor,
      color: '#1A1A1A',
      weight: '1px',
      fillOpacity: '0.7'
  };
};

  return (
    <div className="mapWrapper">
        <Map
            ref={mapRef}
            center={EPSG2056.unproject(L.point(2600000, 1200000))} //Bern
            zoom={16}
            zoomSnap={0.5}
            crs={EPSG2056}
            onmoveend={(event: LeafletEvent) => {
                onMapMoveEnd(event);
            }}
        >
        </Map>
    </div>
  );
}

export default BeschteMap;
