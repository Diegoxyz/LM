import buildQuery from 'odata-query';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AccountService } from './account.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class UtilityService {

    constructor(private http: HttpClient, private accountService : AccountService) { }

    /**
     * Restituisce: 
     *  "Langu": "IT",
     *  "Land1": "AN", 
     *  "Land1x": "Antille Oland."
     */
    public getNations(): Observable<HttpResponse<any>> {
        const filter = { Langu : this.accountService.getLanguage() };
        const format = 'json';
        const outFilter = buildQuery({ format, filter });
        console.log('getNations filter:' + outFilter);


        let headers = new HttpHeaders({
            'Content-Type': 'application/json' });
        let options = { headers: headers, observe: "response" as 'body'};
        return this.http.get<HttpResponse<any>>(
        '/destinations/ZSD_SP_SRV/LandSet' + outFilter, options);
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
        const filter = { Langu : this.accountService.getLanguage(), Land1: countryCode };
        const format = 'json';
        const outFilter = buildQuery({ format, filter });
        console.log('getRegions filter:' + outFilter);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json' });
        let options = { headers: headers, observe: "response" as 'body'};
        return this.http.get<HttpResponse<any>>(
        '/destinations/ZSD_SP_SRV/RegionSet' + outFilter, options);

    }

  }