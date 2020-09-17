import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import buildQuery from 'odata-query';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class BinDataMatnrSetService {

    constructor(private http: HttpClient) {
        
    }

    public getImage(Matnr: string, LoioId: string) {
        const format = 'json';
        const outFilter = buildQuery({ format });

        let headers = new HttpHeaders({
            });
        let options = { headers: headers, observe: "response" as 'body'};

        let url = '';
        // (Matnr='SC_STRADA-EE',LoioId='000D3A2544DE1EDAADBD72825B3CA28D')
        const matrn = 'Matnr=' + '\'' + encodeURIComponent(Matnr) + '\'';
        const loioid = 'LoioId=' + '\'' + LoioId + '\'';
        url = url.concat('(').concat(matrn).concat(',').concat(loioid).concat(')');
        console.log('getImage - url:' + url);
        return this.http.get<HttpResponse<any>>(
            environment.oData_destination + 'BinDataMatnrSet' + url + outFilter, options);
    }

    public getPdf(Matnr: string, LoioId: string) {
        const format = 'json';
        const outFilter = buildQuery({ format });

        let headers = new HttpHeaders({
            responseType: 'blob'
            });
        let options = { headers: headers, observe: "response" as 'body'};

        let url = '';
        // (Matnr='SC_STRADA-EE',LoioId='000D3A2544DE1EDAADBD72825B3CA28D')
        const matrn = 'Matnr=' + '\'' + encodeURIComponent(Matnr) + '\'';
        const loioid = 'LoioId=' + '\'' + LoioId + '\'';
        url = url.concat('(').concat(matrn).concat(',').concat(loioid).concat(')');
        console.log('getImage - url:' + url);
        return this.http.get<HttpResponse<any>>(
            environment.oData_destination + 'BinDataMatnrSet' + url + outFilter, options);
    }
}