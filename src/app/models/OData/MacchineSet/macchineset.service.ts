import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import buildQuery from 'odata-query';
import { AccountService } from '@app/services/account.service';
import { User } from '@app/models/user';
import { Observable } from 'rxjs';
import { Item } from '@app/models/item';
import { Macchina } from './macchineset.entity';

@Injectable({
    providedIn: 'root'
  })
export class MacchineSetService {

    constructor(private http: HttpClient,private accountService : AccountService) {
        
    }

    /*public fetchAllMachines() {
        const u : User = this.accountService.userValue;
        if (u && u.token) {
            this.getAllMachines(u.username,u.token,u.lang).subscribe(resp => {
                const results : Array<Item> = new Array<Item>();
                if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
                    console.log('fetchAllMachines');
                    resp.body.d.results.forEach(m => {
                        const item = new Item();
                        item.code = m.Matnr;
                        item.description = m.Maktx;
                        item.family = m.Family;
                        results.push(item);
                    });
                }
                return results;
            });
        }
        
      }*/
  
      public getAllMachines() : Observable<any>{
          /* URL: http://192.168.0.83:8000/sap/opu/odata/sap/ZSD_SP_SRV/UserDataSet?&$format=json&$filter=Email eq 'roberto.mazzocato@eservices.it' and Token eq '000D3A2544DE1EDAAD8D7B3C3456628D' and Langu eq 'I' */
          // Se può essere utile: https://github.com/techniq/odata-query/blob/master/README.md
          const u : User = this.accountService.userValue;
          const filter = { Email: u.username, Token: u.token, Langu : u.lang };
          const format = 'json';
          const outFilter = buildQuery({ format, filter });
          console.log('filter:' + outFilter);
  
          let headers = new HttpHeaders({
            'Content-Type': 'application/json' });
          let options = { headers: headers, observe: "response" as 'body'};
          return this.http.get<HttpResponse<any>>(
            '/destinations/ZSD_SP_SRV/MacchineSet' + outFilter, options);
      }
}