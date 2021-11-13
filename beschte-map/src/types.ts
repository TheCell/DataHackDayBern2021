export type TileLayerOption =
    'ch.swisstopo.pixelkarte-farbe'
    | 'ch.swisstopo.pixelkarte-grau'
    | 'ch.swisstopo.pixelkarte-farbe-winter'
    | 'ch.swisstopo.pixelkarte-farbe-pk25.noscale'
    | 'ch.swisstopo.pixelkarte-farbe-pk50.noscale'
    | 'ch.swisstopo.pixelkarte-farbe-pk100.noscale'
    | 'ch.swisstopo.pixelkarte-farbe-pk200.noscale'
    | 'ch.swisstopo.pixelkarte-farbe-pk500.noscale'
    | 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale';

export type MapType = 'gemeinde' | 'bezirk';

export interface GeojsonMapOptions {
    text: string;
    map: Map;
    data: DataOptions;
}

interface Map {
    type: MapType;
    centerLatitude: number;
    centerLongitude: number;
    zoomToDataBounds: boolean;
    zoom: number;
    useBoundsInQuery: boolean;
    tileLayer: TileLayerOption;
    tileAttribution: string;
}

interface DataOptions {
    gemeinde: {
        identifier_field: string, value_field: string,
        customMinValue: number, customMaxValue: number,
        matchedData: {
            showTooltip: boolean, tooltipText: string,
            style: AreaGradientOptions
        };
        nonMatchedData: {
            showTooltip: boolean, tooltipText: string,
            style: AreaOptions
        };
    }
    bezirk: {
        identifier_field: string, value_field: string,
        customMinValue: number, customMaxValue: number,
        matchedData: {
            showTooltip: boolean, tooltipText: string,
            style: AreaGradientOptions
        },
        nonMatchedData: {
            showTooltip: boolean, tooltipText: string,
            style: AreaOptions
        }
    }
}

//Defines Gradient via Min and Max Color
interface AreaGradientOptions {
    minFillColor: string;
    maxFillColor: string;
    strokeColor: string;
    strokeWidth: number;
    fillOpacity: number;
}

//Normal Color Fill
interface AreaOptions {
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
    fillOpacity: number;
}
