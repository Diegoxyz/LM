import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AccountService } from './account.service';
import { User } from '@app/models/user';
import buildQuery from 'odata-query';
import { Recipient, SaveOrder } from '@app/models/order';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class OrdersService {

    constructor(private http: HttpClient, private accountService : AccountService) { }
    
    public getDestinatariMerce() : Observable<any> {
        const u : User = this.accountService.userValue;

        let username : string = '';
        let token : string = '';
        let lang : string = '';
        if (u !== undefined && u !== null) {
            username = u.username;
            token = u.token;
            lang = u.lang;
        }

        // ZSD_SP_SRV/ShiptoSet?&$format=json&$filter=Email eq 'roberto.mazzocato@eservices.it' and Token eq '000D3A2544DE1EDAB19CC98DA937628D' and Langu eq 'I'
        const filter = { Email: username, Token: token, Langu : lang };
        const format = 'json';
        const outFilter = buildQuery({ format, filter });

        let headers = new HttpHeaders({
            'Content-Type': 'application/json' });
            let options = { headers: headers, observe: "response" as 'body'};
        
        return this.http.get<HttpResponse<any>>(
            environment.oData_destination + 'ShiptoSet' + outFilter, options);

    }

    /**
     * ZSD_SP_SRV/ShiptoSet(Kunwe='7000031')
     * @param csrftoken 
     * @param recipient 
     */
    public updateDestinatarioMerce(csrftoken : string, recipient: Recipient) : Observable<any> {
        const u : User = this.accountService.userValue;
        recipient.Email = u !== undefined ? u.username : '';
        recipient.Token = u !== undefined ? u.token : '';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrftoken });
        let options = { headers: headers, observe: "response" as 'body'};
        // ZSD_SP_SRV/ShiptoSet(Kunwe='7000031')
        let url = '';
        const Kunwe = 'Kunwe=' + '\'' + encodeURIComponent(recipient.Kunwe) + '\'';
        url = url.concat('(').concat(Kunwe).concat(')');
        return this.http.put<HttpResponse<any>>(
            environment.oData_destination + 'ShiptoSet' + url, recipient, options);
    }

    /**
     * Save order
     */
    public saveOrder(csrftoken : string, order: SaveOrder) : Observable<any> {
        const u : User = this.accountService.userValue;
        order.Email = u !== undefined ? u.username : '';
        order.Token = u !== undefined ? u.token : '';
        order.Langu = u !== undefined && u !== null ? u.lang : '';
        // 2020-08-01T00:00:00
        // const vdatu : string = moment().format('YYYY-MM-DDT00:00:00');
        // order.Vdatu = vdatu;
        order.Vbeln = '';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrftoken });
        // ZSD_SP_SRV/OrdineSet
        let options = { headers: headers, observe: "response" as 'body'};
        return this.http.post<HttpResponse<any>>(
            environment.oData_destination +  'OrdineSet', order, options);
    }
}