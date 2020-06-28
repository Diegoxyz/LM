import buildQuery from 'odata-query';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';
import { User } from '@app/models/user';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  constructor(private http: HttpClient, private accountService : AccountService) { }

  public getMachineServices(matnrMacchina : string) : Observable<any>{
    /* URL: http://srv-sap-gw-dt.lamarzocco.com:8000/sap/opu/odata/sap/ZSD_SP_SRV/SezioniSet?&$format=json&$filter=Email eq 'roberto.mazzocato@eservices.it' and Token eq '000D3A2544DE1EDAADBEA94A0044C28D' and Langu eq 'I' and MatnrMacchina eq 'SC_STRADA-EE' */
    // Se può essere utile: https://github.com/techniq/odata-query/blob/master/README.md
    const u : User = this.accountService.userValue;
    const filter = { Email: u.username, Token: '000D3A2544DE1EDAADBEA94A0044C28D', Langu : 'I', MatnrMacchina : 'SC_STRADA-EE' };
    const format = 'json';
    const outFilter = buildQuery({ format, filter });
    console.log('filter:' + outFilter);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json' });
    let options = { headers: headers, observe: "response" as 'body'};
    return this.http.get<HttpResponse<any>>(
      '/destinations/ZSD_SP_SRV/SezioniSet' + outFilter, options);
}


}
