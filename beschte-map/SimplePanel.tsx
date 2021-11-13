import React, {useEffect, useRef} from 'react';
import {DataFrameView, PanelProps} from '@grafana/data';
import {getLocationSrv} from '@grafana/runtime';
import {GeojsonMapOptions} from 'types';
import {css, cx} from 'emotion';
import L, {LatLngBounds, Layer, LeafletEvent} from 'leaflet';
import 'proj4';
import 'proj4leaflet';
import {Map} from 'react-leaflet';
import {stylesFactory} from "@grafana/ui";

import './vendor/Leaflet.TileLayer.Swiss.umd.js'
import 'leaflet/dist/leaflet.css';
import './leaflet.css';
import './marker'
import {Feature, GeometryObject} from 'geojson';
import {swissTopoLayers} from "./swissTopoLayers";

interface Props extends PanelProps<GeojsonMapOptions> {
}

export const SimplePanel: React.FC<Props> = ({options, data, width, height, replaceVariables}) => {
    const styles = getStyles();
    const mapRef = useRef<Map | null>(null);

    let gemeindeGeoJSON = require('./maps/20210401_gemeinde_bern_epsg2056_simplified.json');
    let bezirkeGeoJSON = require('./maps/20210401_bezirke_bern_epsg2056_simplified.json');

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

    //To make sure that the data is projected correctly, define the CRS explicitly on the GeoJSON.
    gemeindeGeoJSON.crs = crsEPSG2056Def
    bezirkeGeoJSON.crs = crsEPSG2056Def

    let EPSG2056 = new L.Proj.CRS(lv95.epsg, lv95.def, {
        resolutions: lv95.resolutions,
        origin: lv95.origin
    })

    //TODO : get series according to refId e.g. Gemeinde
    //data.series.find(f => f.refId == 'Gemeinde')
    //data is based on data source input/query
    //data is given by the grafana properties
    const frame = data.series[0];   //take only first series
    const dataView = new DataFrameView(frame).toArray();

    const getGemeindeRow = function (bfs_nummer: number) {
        let rows = dataView.find(f => f[options.data.gemeinde.identifier_field] == bfs_nummer);
        return rows ? rows : null;
    };

    const getBezirkRow = function (bfs_nummer: number) {
        let rows = dataView.find(f => f[options.data.bezirk.identifier_field] == bfs_nummer);
        return rows ? rows : null;
    };

    //TODO both function return the same; in future distinguishe shomehow, which type is given by the data source
    const getAllGemeindeRows = () => {
        return dataView;
    }

    const getAllBezirkeRows = () => {
        return dataView;
    }

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

    //https://github.com/rkaravia/Leaflet.TileLayer.Swiss
    // @ts-ignore
    let swissLayer = L.tileLayer.swiss({
        attribution: options.map.tileAttribution,
        // Coordinate reference system. EPSG2056 and EPSG21781 are available.
        crs: EPSG2056,
        // Image format (jpeg or png). Only one format is available per layer.
        format: swissTopoLayers[options.map.tileLayer].format,
        // Layer name.
        layer: swissTopoLayers[options.map.tileLayer].layer,
        // Minimum zoom. Levels below 14 exist for technical reasons,
        // but you probably do not want to use them.
        minZoom: swissTopoLayers[options.map.tileLayer].minZoom,
        // Maximum zoom. Availability of zoom levels depends on the layer.
        maxNativeZoom: swissTopoLayers[options.map.tileLayer].maxNativeZoom,
        // Timestamp. Most (but not all) layers have a 'current' timestamp.
        // Some layers have multiple versions with different timestamps.
        timestamp: swissTopoLayers[options.map.tileLayer].timestamp,
        // Map tile URL. Appropriate defaults are chosen based on the crs option.
        url: swissTopoLayers[options.map.tileLayer].url
    });

    const onEachGemeindeFeature = (feature: Feature<GeometryObject>, layer: Layer) => {
        //no Tooltip Text defined
        if (!options.data.gemeinde.matchedData.showTooltip && !options.data.gemeinde.nonMatchedData.showTooltip) {
            return;
        }

        let gemeinde_bfs_nummer = feature?.properties?.bfs_nummer;
        let gemeindeData = getGemeindeRow(gemeinde_bfs_nummer);

        let toolTipText;

        //For non matched Gemeinde
        if (gemeindeData == null) {
            if (!options.data.gemeinde.nonMatchedData.showTooltip) {
                return;
            }
            toolTipText = template(options.data.gemeinde.nonMatchedData.tooltipText, feature?.properties);
        } else {
            //Matched Gemeinde
            if (options.data.gemeinde.matchedData.showTooltip) {
                //Replace all {{key}} occurences with the corresponding field of the datasource
                toolTipText = template(options.data.gemeinde.matchedData.tooltipText, gemeindeData);
            }
        }

        let toolTip = `<Tooltip>${toolTipText}</Tooltip>`;
        layer.bindTooltip(toolTip);    //tooltip => onHover; popup => onClick
    };

    const onEachBezirkFeature = (feature: Feature<GeometryObject>, layer: Layer) => {
        //no Tooltip Text defined
        if (!options.data.bezirk.matchedData.showTooltip && !options.data.bezirk.nonMatchedData.showTooltip) {
            return;
        }

        let bezirk_bfs_nummer = feature?.properties?.bezirksnum;
        let bezirkData = getBezirkRow(bezirk_bfs_nummer);

        let toolTipText;

        //For non matched Bezirk
        if (bezirkData == null) {
            if (!options.data.bezirk.nonMatchedData.showTooltip) {
                return;
            }
            toolTipText = template(options.data.bezirk.nonMatchedData.tooltipText, feature?.properties);
        } else {
            //Matched Bezirk
            if (options.data.bezirk.matchedData.showTooltip) {
                //Replace all {{key}} occurences with the corresponding field of the datasource
                toolTipText = template(options.data.bezirk.matchedData.tooltipText, bezirkData);
            }
        }

        let toolTip = `<Tooltip>${toolTipText}</Tooltip>`;
        layer.bindTooltip(toolTip);    //tooltip => onHover; popup => onClick
    };

    useEffect(() => {
        if (mapRef.current !== null) {
            const bounds = mapRef.current.leafletElement.getBounds();
            mapRef.current?.leafletElement.addLayer(swissLayer);

            //show gemeinde geojson
            //======================================================================================
            if (options.map.type == 'gemeinde') {
                let allGemeindeRows = getAllGemeindeRows();
                let allGemeindeValues = allGemeindeRows
                    .filter(f => !isNaN(f[options.data.gemeinde.value_field]))
                    .filter(f => f[options.data.gemeinde.value_field] != undefined)
                    .filter(f => f[options.data.gemeinde.value_field] != null)
                    .map(f => f[options.data.gemeinde.value_field]);

                let customMinValueGemeinde = parseFloat(String(options.data.gemeinde.customMinValue));
                let customMaxValueGemeinde = parseFloat(String(options.data.gemeinde.customMaxValue));

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
                    style: geoJSONStyleGemeinde(minGemeindeValue, maxGemeindeValue)
                });
                mapRef.current?.leafletElement.addLayer(gemeindeLayer);
            }

            //show bezirk geojson
            //======================================================================================
            if (options.map.type == 'bezirk') {

                let allBezirkRows = getAllBezirkeRows();

                let allBezirkValues = allBezirkRows
                    .filter(f => !isNaN(f[options.data.bezirk.value_field]))
                    .filter(f => f[options.data.bezirk.value_field] != undefined)
                    .filter(f => f[options.data.bezirk.value_field] != null)
                    .map(f => f[options.data.bezirk.value_field]);

                let customMinValueBezirk = parseFloat(String(options.data.bezirk.customMinValue));
                let customMaxValueBezirk = parseFloat(String(options.data.bezirk.customMaxValue));

                let minBezirkValue;
                let maxBezirkValue;

                //No custom Min Value defined => calculate
                if (isNaN(customMinValueBezirk) || customMinValueBezirk == undefined) {
                    minBezirkValue = Math.min.apply(Math, allBezirkValues);
                } else {
                    minBezirkValue = customMinValueBezirk;
                }

                //No custom Max Value defined => calculate
                if (isNaN(customMaxValueBezirk) || customMaxValueBezirk == undefined) {
                    maxBezirkValue = Math.max.apply(Math, allBezirkValues);
                } else {
                    maxBezirkValue = customMaxValueBezirk;
                }

                let bezirkLayer = L.Proj.geoJson(bezirkeGeoJSON, {
                    onEachFeature: onEachBezirkFeature,
                    style: geoJSONStyleBezirk(minBezirkValue, maxBezirkValue)
                });
                mapRef.current?.leafletElement.addLayer(bezirkLayer);
            }


            /*L.marker(EPSG2056.unproject(L.point(2600000, 1200000))).addTo(mapRef.current.leafletElement)
                .bindPopup('Bern')
                .openPopup();*/

            updateMap(bounds);
        }
        // eslint-disable-next-line
    }, []);

    const onMapMoveEnd = (event: LeafletEvent) => {
        if (mapRef.current !== null) {
            mapRef.current.leafletElement.invalidateSize();
        }
        updateMap(event.target.getBounds());
    };

    const updateQueryVariables = (minLat: number, minLon: number, maxLat: number, maxLon: number) => {
        //sets boundries in query parameter in url
        //can be used, to set bfs_nummer of selected gemeinde/bezirke
        //=> can then be used in other panels, to create drilldowns/filters
        getLocationSrv().update({
            query: {
                'var-minLat': minLat,
                'var-maxLat': maxLat,
                'var-minLon': minLon,
                'var-maxLon': maxLon,
            },
            partial: true,
            replace: true,
        });
    };

    const updateMap = (bounds: LatLngBounds) => {
        const minLat = bounds.getSouthWest().lat;
        const minLon = bounds.getSouthWest().lng;
        const maxLat = bounds.getNorthEast().lat;
        const maxLon = bounds.getNorthEast().lng;
        if (options.map.useBoundsInQuery) {
            updateQueryVariables(minLat, minLon, maxLat, maxLon);
        }
    };

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

    const geoJSONStyleGemeinde = (minValue: number, maxValue: number) => (feat: Feature | undefined) => {
        let gemeinde_bfs_nummer = feat?.properties?.bfs_nummer;
        let gemeindeRow = getGemeindeRow(gemeinde_bfs_nummer);

        //row doesn't exists for this gemeinde
        if (gemeindeRow == null) {
            return {
                fillColor: options.data.gemeinde.nonMatchedData.style.fillColor,
                color: options.data.gemeinde.nonMatchedData.style.strokeColor,
                weight: options.data.gemeinde.nonMatchedData.style.strokeWidth,
                fillOpacity: options.data.gemeinde.nonMatchedData.style.fillOpacity
            };
        }
        //for rows existing for this gemeinde => calculate color depending on min and max value

        let valueForGemeinde = gemeindeRow[options.data.gemeinde.value_field];
        //https://stackoverflow.com/questions/25835591/how-to-calculate-percentage-between-the-range-of-two-values-a-third-value-is/25835683
        let factor = lerp(valueForGemeinde, minValue, maxValue);

        let calculatedColor = pickHex(
            hexToRgb(options.data.gemeinde.matchedData.style.maxFillColor)!,
            hexToRgb(options.data.gemeinde.matchedData.style.minFillColor)!,
            factor);

        return {
            fillColor: calculatedColor,
            color: options.data.gemeinde.matchedData.style.strokeColor,
            weight: options.data.gemeinde.matchedData.style.strokeWidth,
            fillOpacity: options.data.gemeinde.matchedData.style.fillOpacity
        };
    };

    const geoJSONStyleBezirk = (minValue: number, maxValue: number) => (feat: Feature | undefined) => {
        let bezirk_bfs_nummer = feat?.properties?.bezirksnum;
        let bezirkRow = getBezirkRow(bezirk_bfs_nummer);

        //row doesn't exists for this bezirk
        if (bezirkRow == null) {
            return {
                fillColor: options.data.bezirk.nonMatchedData.style.fillColor,
                color: options.data.bezirk.nonMatchedData.style.strokeColor,
                weight: options.data.bezirk.nonMatchedData.style.strokeWidth,
                fillOpacity: options.data.bezirk.nonMatchedData.style.fillOpacity
            };
        }
        //for rows existing for this bezirk => calculate color depending on min and max value

        let valueForBezirk = bezirkRow[options.data.bezirk.value_field];
        //https://stackoverflow.com/questions/25835591/how-to-calculate-percentage-between-the-range-of-two-values-a-third-value-is/25835683
        let factor = lerp(valueForBezirk, minValue, maxValue);

        let calculatedColor = pickHex(
            hexToRgb(options.data.bezirk.matchedData.style.maxFillColor)!,
            hexToRgb(options.data.bezirk.matchedData.style.minFillColor)!,
            factor);

        return {
            fillColor: calculatedColor,
            color: options.data.bezirk.matchedData.style.strokeColor,
            weight: options.data.bezirk.matchedData.style.strokeWidth,
            fillOpacity: options.data.bezirk.matchedData.style.fillOpacity
        };
    };

    return (
        <div
            className={cx(
                styles.wrapper,
                css`
          width: ${width}px;
          height: ${height}px;
        `
            )}
        >
            <Map
                ref={mapRef}
                center={EPSG2056.unproject(L.point(options.map.centerLatitude, options.map.centerLongitude))} //Bern
                zoom={options.map.zoom}
                zoomSnap={0.5}
                crs={EPSG2056}
                onmoveend={(event: LeafletEvent) => {
                    onMapMoveEnd(event);
                }}
            >
            </Map>
        </div>
    );
};

const getStyles = stylesFactory(() => {
    return {
        wrapper: css`
      position: relative;
    `,
    };
});
