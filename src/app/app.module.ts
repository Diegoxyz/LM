import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ODataModule, ODataSettings } from 'angular-odata';
import { throwError } from 'rxjs';
import { HttpErrorResponse, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { NgxSpinnerModule } from "ngx-spinner";

export function oDataSettingsFactory() {
  return new ODataSettings({
    //baseUrl: "https://services.odata.org/V4/TripPinServiceRW/",
    // baseUrl: "http://192.168.0.83:8000/sap/opu/odata/sap/ZKAN_APP_SRV/MonitorDataSet/?$format=json",
    baseUrl: environment.oData_destination,
    metadataUrl: "?$format=json",
    errorHandler: (error: HttpErrorResponse) => {
      return throwError(error);
    }
  });
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
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
    NoopAnimationsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
    }),
    NgxSpinnerModule
  ],
  providers: [
    Title,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ODataSettings, useFactory: oDataSettingsFactory }],
  bootstrap: [AppComponent]
})
export class AppModule { }
