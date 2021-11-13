import {Component, NgZone, AfterViewInit, Output, Input, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import {View, Feature, Map, MapBrowserEvent } from 'ol';
import {Coordinate} from 'ol/coordinate';
import { ScaleLine, defaults as DefaultControls} from 'ol/control';
// import proj4 from 'proj4';
import VectorLayer from 'ol/layer/Vector';
import Projection from 'ol/proj/Projection';
import {register}  from 'ol/proj/proj4';
import {get as GetProjection} from 'ol/proj'
import {coordinateRelationship, Extent, getCenter} from 'ol/extent';
import TileLayer from 'ol/layer/Tile';
import OSM, {ATTRIBUTION} from 'ol/source/OSM';
import TileSource from 'ol/source/Tile';
import Static from 'ol/source/ImageStatic';
import ImageLayer from 'ol/layer/Image';
import * as olInteraction from 'ol/interaction';
import { MapLocation } from './map-location';
import Point from 'ol/geom/Point';
import {Fill, Icon, Stroke, Style} from 'ol/style';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import VectorSource from 'ol/source/Vector';
import { mapFeature } from '../api/mapFeature';
import CircleStyle from 'ol/style/Circle';
import { featureType } from '../api/FeatureType';
import { Modify, Select } from 'ol/interaction';
import { SelectEvent } from 'ol/interaction/Select';
import { altKeyOnly, click } from 'ol/events/condition';

@Component({
  selector: 'app-ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.scss']
})
export class OlMapComponent implements AfterViewInit, OnChanges {
  @Input() public center: Coordinate | undefined;
  @Input() public zoom: number | undefined;
  @Input() public mapFeatures: Array<mapFeature> = [];
  @Input() public featureTypes: Array<featureType> = [];
  @Input() public selectedFeatureType = 0;
  @Input() public activeLayers: Array<number> = [];
  @Output() public mapLocation = new EventEmitter<MapLocation>();
  @Output() public addLocation = new EventEmitter<Coordinate>();
  @Output() public removeLocation = new EventEmitter<number>();
  @Output() public mapReady = new EventEmitter<Map>();

  private extent: Extent = [0, 0, 2048, 2048];
  private projection: Projection | undefined;
  private psoLayer: ImageLayer | undefined;
  private view: View | undefined;
  private map: Map | undefined;
  private featureStyles: Array<Style> = [];
  private featureLayers: Array<VectorLayer> = [];
  private vectorSources: Array<VectorSource> = [];
  private selectAction: Select | undefined;

  constructor(private zone: NgZone, private changeDetectorRef: ChangeDetectorRef) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.featureTypes && changes.featureTypes.currentValue) {
      this.updateFeatureTypes();
    }

    if (changes.mapFeatures && changes.mapFeatures.currentValue) {
      this.addFeatures();
    }

    if (changes.activeLayers && changes.activeLayers.currentValue) {
      if (this.map) {
        for (let i = 0; i < this.featureTypes.length; i++) {
          if (!this.featureLayers[this.featureTypes[i].Id]) {
            continue;
          }
          this.map.removeLayer(this.featureLayers[this.featureTypes[i].Id]);
          if (this.activeLayers.includes(this.featureTypes[i].Id)) {
            console.log('adding layer');
            this.map.addLayer(this.featureLayers[this.featureTypes[i].Id]);
          }
        }
      }
    }
  }

  public ngAfterViewInit(): void {
    if (!this.map) {
      this.initMap();
    } 

    this.mapReady.emit(this.map);
  }

  private initMap(): void {
    this.projection = new Projection({
      code: 'pso-image',
      units: 'pixels',
      extent: this.extent,
    });

    this.view = new View({
      projection: this.projection,
      center: getCenter(this.extent),
      zoom: 2,
      maxZoom: 8
    });

    this.psoLayer = new ImageLayer({
      source: new Static({
        url: '/assets/map/psoMap.png',
        projection: new Projection({
          code: 'psomap',
          units: 'pixels',
          extent: this.extent
        }),
        imageExtent: this.extent
      })
    });

    this.map = new Map({
      controls: [],
      layers: [this.psoLayer],
      target: 'mapid',
      view: this.view
    });

    this.map.on('moveend', this.onMoveEnd.bind(this));
    this.map.on('dblclick', this.onDoubleClick.bind(this));
    this.map.on('pointermove', this.onPointerMove.bind(this));
    const zoomInteraction = this.map.getInteractions().getArray().find((interaction) => interaction instanceof olInteraction.DoubleClickZoom );
    if (zoomInteraction) {
      this.map.removeInteraction(zoomInteraction);
    }
  }

  private onMoveEnd(): void {
    const view = this.map?.getView();
    if (!view) {
      return;
    }

    const location: MapLocation = {
      center: view.getCenter() ?? [],
      zoom: view.getZoom() ?? 0,
      rotation: view.getRotation()
    };

    this.mapLocation.next(location);
  }

  private onPointerMove(event: any): void {
    if (event.dragging) {
      return;
    }
    
    if (!this.map) {
      return;
    }

    const pixel = this.map?.getEventPixel(event.originalEvent);
    const hit = this.map.hasFeatureAtPixel(pixel);
    if (this.map)
    if (hit) {
      const target = this.map.getTarget();
    } else {
    }
  }

  private onDoubleClick(event: MapBrowserEvent): void {
    if (this.selectedFeatureType <= 0) {
      return;
    }

    const newFeature = new Feature(new Point(event.coordinate));
    newFeature.setStyle(this.featureStyles[this.selectedFeatureType]);
    
    if (this.vectorSources[this.selectedFeatureType]) {
      console.log('exists');
      this.vectorSources[this.selectedFeatureType].addFeature(newFeature);
    } else {
      this.vectorSources[this.selectedFeatureType] = new VectorSource({
        features: [newFeature]
      });

      this.featureLayers[this.selectedFeatureType] = new VectorLayer({
        source: this.vectorSources[this.selectedFeatureType]
      });
    }

    this.addFeatures();
    this.addLocation.emit(event.coordinate);
  }

  private updateFeatureTypes(): void {
    this.featureStyles = [];
    this.featureTypes.forEach((featureType: featureType) => {
      this.featureStyles[featureType.Id] = new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: featureType.Color
          })
        })
      });
    });
  }

  private addFeatures(): void {
    if (!this.map || this.mapFeatures.length === 0) {
      return;
    }
    
    const amountOfTypes = this.featureTypes.length;
    let featuresPerType = Array<Array<Feature>>();
    
    for(let i = 0; i < this.mapFeatures.length; i++) {
      const coordinates = [this.mapFeatures[i].XCoord, this.mapFeatures[i].YCoord];
      
      const newFeature = new Feature(new Point(coordinates));
      newFeature.setId(this.mapFeatures[i].Id);
      newFeature.setStyle(this.featureStyles[this.mapFeatures[i].FeatureTypeId]);

      if (!featuresPerType[this.mapFeatures[i].FeatureTypeId]) {
        featuresPerType[this.mapFeatures[i].FeatureTypeId] = new Array<Feature>();
      }
      featuresPerType[this.mapFeatures[i].FeatureTypeId].push(newFeature);
    }

    this.featureTypes.forEach((featuretype) => {
      if (!featuresPerType[featuretype.Id]) {
        return;
      }

      this.vectorSources[featuretype.Id] = new VectorSource({
        features: [...featuresPerType[featuretype.Id]]
      });

      this.featureLayers[featuretype.Id] = new VectorLayer({
        source: this.vectorSources[featuretype.Id]
      });

      // if (this.map) {
      //   this.map.addLayer(this.featureLayers[featuretype.Id]);
      // }
    });

    this.addInteraction();
  }
  
  private addInteraction(): void {
    if (this.selectAction) {
      this.map?.removeInteraction(this.selectAction);
    }

    this.selectAction = new Select({
      condition: function (MapBrowserEvent) {
        return click(MapBrowserEvent) && altKeyOnly(MapBrowserEvent);
      }
    });

    this.map?.addInteraction(this.selectAction);

    const removeEmiter = this.removeLocation;
    this.selectAction.on('select', function (e: SelectEvent) {
      e.selected.forEach((feature) => {
        let id = 0;
        if (Number(feature.getId())) {
          id = Number(feature.getId());
        }
        removeEmiter.emit(id);
      });
    });
  }
}