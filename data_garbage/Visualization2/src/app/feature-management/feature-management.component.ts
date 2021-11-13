import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { featureType } from '../api/FeatureType';
import { FeaturetypeService } from '../api/featuretype.service';

@Component({
  selector: 'app-feature-management',
  templateUrl: './feature-management.component.html',
  styleUrls: ['./feature-management.component.scss']
})
export class FeatureManagementComponent implements OnInit {
  public features: Array<featureType> = [];
  public form;

  private getFeature$: Subject<void> = new Subject();

  public constructor(
    private featuretypeService: FeaturetypeService,
    formbuilder: FormBuilder) { 
      this.form = formbuilder.group({
        Name: ['', Validators.required],
        Color: ['', Validators.required]
      });
    }

  public ngOnInit(): void {
    this.getFeature$.pipe(switchMap(() => {
      return this.featuretypeService.getFeatureTypes();
    })).subscribe((featureTypes) => {
      this.features = featureTypes;
      console.log(this.features);
    });

    this.getFeature$.next();
  }

  public onSubmit(): void {
    const newFeatureType = {
      ...this.form.value
    }

    this.form.reset();
    
    this.featuretypeService.addFeatureType(newFeatureType).subscribe(() => {
      this.getFeature$.next();
    });
  }

  public deleteFeature(id: number): void {
    this.featuretypeService.deleteFeatureType(id).subscribe((val) => {
      console.log(val);
      this.getFeature$.next();
      console.log('deleted');
    }, (error) => {
      console.error(error);
    });
  }
}
