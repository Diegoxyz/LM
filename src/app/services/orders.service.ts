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
        order.Langu = u !== undefined && u !== null ? u.lang.toUpperCase() : '';
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

    /**
     * Get the list of orders
     * ZSD_SP_SRV/ListaOrdiniSet?$format=json&$filter=Email eq 'roberto.mazzocato@eservices.it' 
     * and Token eq '000D3A2544DE1EDAB4AD2A801720C28D' and Langu eq 'I' 
     * and Vbeln eq '' 
     * and ErdatFrom eq datetime'2020-06-25T00:00:00' 
     * and ErdatTo eq datetime'2020-07-25T00:00:00'
     */
    public getOrders(dateFrom?: string, dateTo?: string, orderNumber? : string) : Observable<any> {
        const u : User = this.accountService.userValue;
        let username : string = '';
        let token : string = '';
        let lang : string = '';
        if (u !== undefined && u !== null) {
            username = u.username;
            token = u.token;
            lang = u.lang ? u.lang.toUpperCase() : '';
        }

        const dateFormat = 'YYYY-MM-DD';
        let df : string = moment().add(-30,'days').format(dateFormat);
        if (dateFrom) {
            df = dateFrom;
        } 
        df = df + 'T00:00:00';

        let dt : string = moment().format(dateFormat);
        if (dateTo) {
            dt = dateTo;
        }
        dt = dt + 'T00:00:00';
        
        console.log('getOrders: df:' + df + ',dt:' + dt);
        let Vbeln = '';
        if (orderNumber) {
            Vbeln = orderNumber;
        }
        const format = 'json';
        const outFilter = buildQuery({ format });

        const email = 'Email eq ' + '\'' + username + '\'';
        const tkn = 'Token eq ' + '\'' + token + '\'';
        const langu = 'Langu eq ' + '\'' + lang + '\'';
        const vbeln = 'Vbeln eq ' + '\'' + Vbeln + '\'';
        const erdatFrom = 'ErdatFrom eq datetime\'' + df + '\'';
        const erdatTo = 'ErdatTo eq datetime\'' + dt + '\'';
        const url = outFilter.concat('&').concat('$filter=').concat(email).concat(' and ').concat(tkn).concat(' and ').concat(langu).concat(' and ')
                .concat(vbeln).concat(' and ').concat(erdatFrom).concat(' and ').concat(erdatTo);

        console.log('outFilter:' + outFilter, 'url:' + url);

        let headers = new HttpHeaders({
            'Content-Type': 'application/json' });
            let options = { headers: headers, observe: "response" as 'body'};
        
        return this.http.get<HttpResponse<any>>(
            environment.oData_destination + 'ListaOrdiniSet' + url, options);
    }
}