import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import Point from 'ol/geom/Point';
// import proj4 from 'proj4';
// import * as proj4 from "ol/proj";
// import * as ol from "ol";
// import * as proj4 from "ol/proj/proj4";
import { forkJoin } from 'rxjs';
import { featureType } from '../api/FeatureType';
import { FeaturetypeService } from '../api/featuretype.service';
import { MapFeatureService } from '../api/map-feature.service';
import { mapFeature } from '../api/mapFeature';
import { MapLocation } from '../ol-map/map-location';
import * as proj from 'ol/proj';
import * as proj4 from 'ol/proj/proj4'
// import { register } from 'ol/proj/proj4';
// import { proj } from 'ol/proj';
// import { BaseVectorLayer } from 'ol/layer/BaseVector';
import {register}  from 'ol/proj/proj4';

@Component({
  selector: 'app-test-map',
  templateUrl: './test-map.component.html',
  styleUrls: ['./test-map.component.scss']
})
export class TestMapComponent implements OnInit {
  public featureTypes: Array<featureType> = [];
  public mapFeatures: Array<mapFeature> = [];
  public form: FormGroup;
  public layersForm: FormGroup;
  public activeLayers: Array<number> = [];

  constructor(
    private featuretypeService: FeaturetypeService,
    private mapFeatureService: MapFeatureService,
    private formBuilder: FormBuilder) {
      this.form = this.formBuilder.group({
        featureType: [0]
      });

      this.layersForm = this.formBuilder.group({
        layers: new FormArray([])
      });

      this.layersForm.valueChanges.subscribe((changes) => {
        this.activeLayers = [];
        for (let i = 0; i < changes.layers.length; i++) {
          if (changes.layers[i]) {
            this.activeLayers.push(this.featureTypes[i].Id);
          }
        }
      });
    }

  get layersFormArray(): FormArray {
    return this.layersForm.controls.layers as FormArray;
  }

  public ngOnInit(): void {

    // proj4.defs("EPSG:3857","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");
    // register(proj4)
    // this.projection = GetProjection('EPSG:3857');
    // this.projection.setExtent(this.extent);
    // proj.setProj4(proj4);

    // proj4.
    // proj4.defs("EPSG:28992", "...");
    // if (!ol.proj.get('EPSG:28992')) {
    //     console.error("Failed to register projection in OpenLayers");
    //     ...
    // }
    // var firstProjection = 'PROJCS["NAD83 / Massachusetts Mainland",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",42.68333333333333],PARAMETER["standard_parallel_2",41.71666666666667],PARAMETER["latitude_of_origin",41],PARAMETER["central_meridian",-71.5],PARAMETER["false_easting",200000],PARAMETER["false_northing",750000],AUTHORITY["EPSG","26986"],AXIS["X",EAST],AXIS["Y",NORTH]]';
    // var secondProjection = "+proj=gnom +lat_0=90 +lon_0=0 +x_0=6300000 +y_0=6300000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
    //I'm not going to redefine those two in latter examples.
    // proj4(firstProjection,secondProjection,[2,5]);
    // proj4.defs("EPSG:21781","+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=660.077,13.551,369.344,2.484,1.783,2.939,5.66 +units=m +no_defs");
    // const swissCoord = proj.transform([8.23, 46.86], 'EPSG:2056', 'EPSG:3857'); //2056
    // console.log(swissCoord);
    // forkJoin([this.featuretypeService.getFeatureTypes(), this.mapFeatureService.getMapFeatures()])
    //   .subscribe(([featureTypes, mapFeatures]: [featureType[], mapFeature[]]) => {
    //     featureTypes.forEach((featureType) => {
    //       featureType.Id = Number(featureType.Id);
    //     });
    //     this.featureTypes = featureTypes;
    //     this.mapFeatures = mapFeatures;

    //     this.featureTypes.forEach(() => this.layersFormArray.push(new FormControl(false)));
    // });
  }

  public onMapReady(things: any): void {
    // console.log('map ready', things);
  }

  public addLocation(info: Coordinate): void {
    // console.log('clickedEvent', info);
    // console.log(this.form.value);
    this.mapFeatureService.addMapFeature({
      FeatureTypeId: this.form.controls.featureType.value,
      XCoord: info[0],
      YCoord: info[1]
    }).subscribe(() => {
      // console.log("jobs done");
    }, (error) => {
      console.error(error);
    });
  }

  public onCurrentLocation(location: MapLocation): void {
    // console.log(location);
  }

  public removeLocation(id: number): void {
    // console.log('deleting point ' + id);
    this.mapFeatureService.deleteMapFeature(id).subscribe(() => {
      // console.log('deleted');
    });
  }
}
