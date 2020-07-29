import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AccountService } from './account.service';
import { Observable, of } from 'rxjs';
import { User } from '@app/models/user';
import buildQuery from 'odata-query';
import { Carrello } from '@app/models/carrello';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class CarrelloService {

    constructor(private http: HttpClient, private accountService : AccountService) { }

    public getCart() : Observable<any> {
        const u : User = this.accountService.userValue;
        console.log('getCart() -u:' + u);
        if (u === undefined || u === null) {
            return of();
        }
        let username : string = '';
        let token : string = '';
        let lang : string = '';
        if (u !== undefined && u !== null) {
            username = u.username;
            token = u.token;
            lang = u.lang.toUpperCase();
        }
        
        const filter = { Email: username, Token: token, Langu : lang };
        const format = 'json';
        const outFilter = buildQuery({ format, filter });
        console.log('getCart filter:' + outFilter);

        let headers = new HttpHeaders({
        'Content-Type': 'application/json' });
        let options = { headers: headers, observe: "response" as 'body'};
        return this.http.get<HttpResponse<any>>(
            environment.oData_destination + 'CarrelloSet' + outFilter, options);
    }

    public addCart(csrftoken : string, carrello : Carrello, user? : User) : Observable<any> {
        let u : User = this.accountService.userValue;
        console.log('addCart() -u1:' + u);
        if ((u === undefined || u === null) && user !== undefined) {
            u = user;
        }
        console.log('addCart() -u2:' + u);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrftoken });
        carrello.Email = u.username;
        carrello.Token = u.token;
        let options = { headers: headers, observe: "response" as 'body'};
        return this.http.post<HttpResponse<any>>(
            environment.oData_destination +  'CarrelloSet', carrello, options);
    }



    // save === insert or update
    public updateCart(csrftoken : string, carrello : Carrello) : Observable<any> {
        const u : User = this.accountService.userValue;
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrftoken });
        carrello.Email = u.username;
        carrello.Token = u.token;
        let options = { headers: headers, observe: "response" as 'body'};
        let url = '';
        const matrn = 'Matnr=' + '\'' + encodeURIComponent(carrello.Matnr) + '\'';
        const email = 'Email=' + '\'' + u.username + '\'';
        const token = 'Token=' + '\'' + u.token + '\'';
        const langu = 'Langu=' + '\'' + (u.lang ? u.lang.toUpperCase() : '') + '\'';
        url = url.concat('(').concat(matrn).concat(',').concat(email).concat(',').concat(token).concat(',').concat(langu).concat(')');
        console.log('updateCart - url:' + url);
        return this.http.put<HttpResponse<any>>(
            environment.oData_destination + 'CarrelloSet' + url, carrello, options);
    }

    public deleteFromCarrelloByCarrello(csrftoken : string, carrello : Carrello) : Observable<any> {
        return this.deleteFromCarrello(csrftoken, carrello.Matnr);
    }
    public deleteFromCarrello(csrftoken : string, productId : string) : Observable<any> {
        const u : User = this.accountService.userValue;
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrftoken });
        let options = { headers: headers, observe: "response" as 'body'};
        let url = '';
        const prodId = encodeURIComponent(productId);
        const matrn = 'Matnr=' + '\'' + prodId + '\'';
        const email = 'Email=' + '\'' + u.username + '\'';
        const token = 'Token=' + '\'' + u.token + '\'';
        const langu = 'Langu=' + '\'' + (u.lang ? u.lang.toUpperCase() : '') + '\'';
        url = url.concat('(').concat(matrn).concat(',').concat(email).concat(',').concat(token).concat(',').concat(langu).concat(')');
        console.log('deleteFromCarrello - url:' + url);
        return this.http.delete<HttpResponse<any>>(
            environment.oData_destination + 'CarrelloSet' + url, options);
    }
  }