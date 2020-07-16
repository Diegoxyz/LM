import buildQuery from 'odata-query';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AccountService } from './account.service';
import { Observable } from 'rxjs';
import { User } from '@app/models/user';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class SectionMaterial {

    constructor(private http: HttpClient, private accountService : AccountService) { }

    public getSectionMaterial(matnrSezione : string) : Observable<any> {
        console.log('getSectionMaterial matnrSezione:' + matnrSezione);
        const u : User = this.accountService.userValue;
        const filter = { Email: u.username, Token: u.token, Langu : u.lang, MatnrSezione : matnrSezione };
        const format = 'json';
        const outFilter = buildQuery({ format, filter });
        console.log('getSectionMaterial filter:' + outFilter);

        let headers = new HttpHeaders({
            'Content-Type': 'application/json' });
          let options = { headers: headers, observe: "response" as 'body'};
          return this.http.get<HttpResponse<any>>(
            environment.oData_destination + 'MaterialiSezioneSet' + outFilter, options);
    }
}