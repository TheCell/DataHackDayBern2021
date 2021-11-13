//https://leaflet-tilelayer-swiss.karavia.ch/layers.html
let swissTopoLayers = {
    'ch.swisstopo.pixelkarte-farbe': {
        format: 'jpeg',
        layer: 'ch.swisstopo.pixelkarte-farbe',
        minZoom: 14,
        maxNativeZoom: 27,
        timestamp: 'current',
        url: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}',
    },
    'ch.swisstopo.pixelkarte-grau': {
        format: 'jpeg',
        layer: 'ch.swisstopo.pixelkarte-grau',
        minZoom: 14,
        maxNativeZoom: 27,
        timestamp: 'current',
        url: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}',
    },
    'ch.swisstopo.pixelkarte-farbe-winter': {
        format: 'jpeg',
        layer: 'ch.swisstopo.pixelkarte-farbe-winter',
        minZoom: 14,
        maxNativeZoom: 27,
        timestamp: 'current',
        url: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}',
    },
    'ch.swisstopo.pixelkarte-farbe-pk25.noscale': {
        format: 'jpeg',
        layer: 'ch.swisstopo.pixelkarte-farbe-pk25.noscale',
        minZoom: 14,
        maxNativeZoom: 26,
        timestamp: 'current',
        url: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}',
    },
    'ch.swisstopo.pixelkarte-farbe-pk50.noscale': {
        format: 'jpeg',
        layer: 'ch.swisstopo.pixelkarte-farbe-pk50.noscale',
        minZoom: 14,
        maxNativeZoom: 26,
        timestamp: 'current',
        url: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}',
    },
    'ch.swisstopo.pixelkarte-farbe-pk100.noscale': {
        format: 'jpeg',
        layer: 'ch.swisstopo.pixelkarte-farbe-pk100.noscale',
        minZoom: 14,
        maxNativeZoom: 26,
        timestamp: 'current',
        url: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}',
    },
    'ch.swisstopo.pixelkarte-farbe-pk200.noscale': {
        format: 'jpeg',
        layer: 'ch.swisstopo.pixelkarte-farbe-pk200.noscale',
        minZoom: 14,
        maxNativeZoom: 26,
        timestamp: 'current',
        url: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}',
    },
    'ch.swisstopo.pixelkarte-farbe-pk500.noscale': {
        format: 'jpeg',
        layer: 'ch.swisstopo.pixelkarte-farbe-pk500.noscale',
        minZoom: 14,
        maxNativeZoom: 26,
        timestamp: 'current',
        url: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}',
    },
    'ch.swisstopo.pixelkarte-farbe-pk1000.noscale': {
        format: 'jpeg',
        layer: 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
        minZoom: 14,
        maxNativeZoom: 26,
        timestamp: 'current',
        url: 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}',
    }
};

export {swissTopoLayers};
