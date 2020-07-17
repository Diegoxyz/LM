import buildQuery from 'odata-query';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AccountService } from './account.service';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
  })
  export class UtilityService {

    constructor(private http: HttpClient, private accountService : AccountService, private translateService : TranslateService) { }

    public getNations() : Observable<HttpResponse<any>> {
        return this.getCountries();
    }
    /**
     * Restituisce: 
     *  "Langu": "IT",
     *  "Land1": "AN", 
     *  "Land1x": "Antille Oland."
     */
    public getCountries(): Observable<HttpResponse<any>> {
        const filter = { Langu : this.accountService.getLanguage().toUpperCase() };
        const format = 'json';
        const outFilter = buildQuery({ format, filter });
        console.log('getCountries filter:' + outFilter);


        let headers = new HttpHeaders({
            'Content-Type': 'application/json' });
        let options = { headers: headers, observe: "response" as 'body'};
        return this.http.get<HttpResponse<any>>(
            environment.oData_destination + 'LandSet' + outFilter, options);
    }
    
    /**
     * Returns:
     *  "Langu": "IT",
        "Land1": "IT",
        "Regio": "AG",
        "Regiox": "Agrigento"
     * @param countryCode Land1 da getNations()
     */
    public getRegions(countryCode : string) : Observable<HttpResponse<any>> {
        const filter = { Langu : this.accountService.getLanguage().toUpperCase(), Land1: countryCode };
        const format = 'json';
        const outFilter = buildQuery({ format, filter });
        console.log('getRegions filter:' + outFilter);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json' });
        let options = { headers: headers, observe: "response" as 'body'};
        return this.http.get<HttpResponse<any>>(
            environment.oData_destination + 'RegionSet' + outFilter, options);

    }

    public getSAPErrorMessage(response : any) : string {
        let errorMessage : string = undefined;
        if (response.headers) {
            const sapMessage = response.headers.get('sap-message');
            console.log('confirm-order : sapMessage:' + sapMessage);
            if (sapMessage !== undefined && sapMessage !== null) {
              const docSapMessage : Document = (new window.DOMParser()).parseFromString(sapMessage, 'text/xml');
                errorMessage = this.translateService.instant('unknownError');
                if (docSapMessage.hasChildNodes()) {
                  if (docSapMessage.firstChild.childNodes.length >= 2) {
                    errorMessage = docSapMessage.firstChild.childNodes[1].textContent;
                  }
                }
            }
          }
        return errorMessage;
    }
  }