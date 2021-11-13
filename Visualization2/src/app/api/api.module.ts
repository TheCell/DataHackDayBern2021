import { NgModule } from '@angular/core';
import { FeaturetypeService } from './featuretype.service';
import { MapFeatureService } from './map-feature.service';

@NgModule({
  providers: [FeaturetypeService, MapFeatureService]
})
export class ApiModule { }
