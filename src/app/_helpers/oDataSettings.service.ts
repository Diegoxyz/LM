import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { oDataSettings } from './odatasettings';

const SETTINGS_LOCATION = 
         "assets/config/odatasettings.json";

@Injectable({
    providedIn: 'root'
})
export class ODataSettingsService {
    
    constructor(private http: HttpClient) {
    }

    getSettings(): Promise<oDataSettings> {   
        return this.http.get<oDataSettings>(SETTINGS_LOCATION).toPromise();
      }
}