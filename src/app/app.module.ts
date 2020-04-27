import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './components/bar/bar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LostCredentialsComponent } from './components/lost-credentials/lost-credentials.component';
import { ODataModule, ODataSettings } from 'angular-odata';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SapODataSettings } from './models/MonitorDataSet/sapodatasettings';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginBarComponent } from './components/login-bar/login-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { environment } from '../environments/environment';

export function oDataSettingsFactory() {
  return new SapODataSettings({
    //baseUrl: "https://services.odata.org/V4/TripPinServiceRW/",
    // baseUrl: "http://192.168.0.83:8000/sap/opu/odata/sap/ZKAN_APP_SRV/MonitorDataSet/?$format=json",
    baseUrl: environment.destination,
    metadataUrl: "?$format=json",
    errorHandler: (error: HttpErrorResponse) => {
      return throwError(error);
    }
  });
}

@NgModule({
  declarations: [
    AppComponent,
    BarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    LostCredentialsComponent,
    LoginBarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ODataModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: ODataSettings, useFactory: oDataSettingsFactory }],
  bootstrap: [AppComponent]
})
export class AppModule { }
