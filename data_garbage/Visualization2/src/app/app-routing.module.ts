import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureManagementComponent } from './feature-management/feature-management.component';
import { TestMapComponent } from './test-map/test-map.component';

const routes: Routes = [
  { path: 'test-map', component: TestMapComponent },
  { path: 'feature-management', component: FeatureManagementComponent },
  { path: '', redirectTo: '/test-map', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
