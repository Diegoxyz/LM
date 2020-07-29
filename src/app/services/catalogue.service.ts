import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AccountService } from './account.service';
import { Observable } from 'rxjs';
import { User } from '@app/models/user';
import buildQuery from 'odata-query';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class CatalogueService {

    constructor(private http: HttpClient, private accountService : AccountService) { }

    public getAllItems(lastPurchases? : string) : Observable<any> {
        const u : User = this.accountService.userValue;
        const filter = { Email: (u !== undefined && u !== null ? u.username : ''), 
            Token: (u !== undefined && u !== null ? u.token : ''), Langu : (u !== undefined && u !== null && u.lang !== undefined ? u.lang.toUpperCase() : '')};
        const format = 'json';
        const outFilter = buildQuery({ filter,format });
        console.log('CatalogueService getAllItems filter:' + outFilter + ',lastPurchases:'+lastPurchases);

        let headers = new HttpHeaders({
        'Content-Type': 'application/json' });
        let options = { headers: headers, observe: "response" as 'body'};
        if (lastPurchases) {
            return this.http.get<HttpResponse<any>>(
                environment.oData_destination + 'CatalogoLastSet' + outFilter, options);
        } else {
            return this.http.get<HttpResponse<any>>(
                environment.oData_destination + 'CatalogoSet' + outFilter, options);
        }
    }

    public getItem(matnr : string, user? : User) : Observable<any> {
        let u : User = this.accountService.userValue;
        console.log('getItem() -u1:' + u);
        if ((u === undefined || u === null) && user !== undefined) {
            u = user;
        }
        console.log('getItem() -u2:' + u);
        const matrn = 'Matnr=' + '\'' + encodeURIComponent(matnr) + '\'';
        const email = 'Email=' + '\'' + (u !== undefined && u !== null ? u.username : '') + '\'';
        const token = 'Token=' + '\'' + (u !== undefined && u !== null ? u.token : '')+ '\'';
        const langu = 'Langu=' + '\'' + (u !== undefined && u !== null && u.lang !== undefined ? u.lang.toUpperCase() : '') + '\'';

        let url = '';
        url = url.concat('(').concat(matrn).concat(',').concat(email).concat(',').concat(token).concat(',').concat(langu).concat(')');

        let headers = new HttpHeaders();
        let options = { headers: headers, observe: "response" as 'body'};
        return this.http.get<HttpResponse<any>>(
            environment.oData_destination + 'CatalogoSet' + url, options);
    }

    // Ricerca per gerarchie
    public getHierarchies() : Observable<any> {
        const u : User = this.accountService.userValue;
        const filter = { Email: (u !== undefined && u !== null ? u.username : ''), 
            Token: (u !== undefined && u !== null ? u.token : ''), Langu : (u !== undefined && u !== null ? u.lang.toUpperCase() : '')};
        const format = 'json';
        const outFilter = buildQuery({ filter,format });
        console.log('CatalogueService getAllItems filter:' + outFilter);

        let headers = new HttpHeaders({
        'Content-Type': 'application/json' });
        let options = { headers: headers, observe: "response" as 'body'};
        return this.http.get<HttpResponse<any>>(
            environment.oData_destination + 'GerarchiaSet' + outFilter, options);
    }

    /*
     * matrn: matricola del prodotto
     * preferred: preferito o no
     */
    public setPreferred(matnr : string, preferred: boolean) : Observable<any> {
        const u : User = this.accountService.userValue;

        const matrn = 'Matnr=' + '\'' + matnr + '\'' + ',';
        const email = 'Email=' + '\'' + (u !== undefined && u !== null ? u.username : '') + '\'' + ',';
        const token = 'Token=' + '\'' + (u !== undefined && u !== null ? u.token : '')+ '\'' + ',';
        const langu = 'Langu=' + '\'' + (u !== undefined && u !== null ? u.lang.toUpperCase() : '') + '\'' + ',';
        const pref = 'Pref=' + '\'' + (preferred ? 'X' : '') + '\'';
        const params ='?&$format=json';
        let url = '';
        url = url.concat('(').concat(matrn).concat(email).concat(token).concat(langu).concat(pref).concat(')').concat(params);

        let headers = new HttpHeaders();
        let options = { headers: headers, observe: "response" as 'body'};
        return this.http.get<HttpResponse<any>>(
            environment.oData_destination + 'MatnrPrefSet' + url, options);
    }
}