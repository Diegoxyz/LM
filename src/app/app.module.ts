import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ODataModule, ODataSettings } from 'angular-odata';
import { throwError } from 'rxjs';
import { HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

export function oDataSettingsFactory() {
  return new ODataSettings({
    //baseUrl: "https://services.odata.org/V4/TripPinServiceRW/",
    // baseUrl: "http://192.168.0.83:8000/sap/opu/odata/sap/ZKAN_APP_SRV/MonitorDataSet/?$format=json",
    baseUrl: environment.destination_ZSD_SP_SRV,
    metadataUrl: "?$format=json",
    errorHandler: (error: HttpErrorResponse) => {
      return throwError(error);
    }
  });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ODataModule,
    ReactiveFormsModule,
    NgbModule,
    NoopAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ODataSettings, useFactory: oDataSettingsFactory }],
  bootstrap: [AppComponent]
})
export class AppModule { }
