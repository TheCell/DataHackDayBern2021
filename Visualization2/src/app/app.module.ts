import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestMapComponent } from './test-map/test-map.component';
import { OlMapComponent } from './ol-map/ol-map.component';
import { AuthModule } from './auth/auth/auth.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ApiModule } from './api/api.module';
import { FeatureManagementComponent } from './feature-management/feature-management.component';

@NgModule({
  declarations: [
    AppComponent,
    TestMapComponent,
    OlMapComponent,
    FeatureManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthModule,
    ApiModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
