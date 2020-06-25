import { UserDataSet } from './userdataset.entity';
import { ODataEntityService, ODataEntityAnnotations, ODataEntitiesAnnotations, ODataValueAnnotations, ODataEntityResource, HttpOptions, ODataServiceFactory } from 'angular-odata';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { UserData, User } from '@app/models/user';
import { AccountService } from '@app/services/account.service';
import buildQuery from 'odata-query';

@Injectable({
    providedIn: 'root'
  })
export class UserDataSetService {

    private userDataSetSubject: BehaviorSubject<UserDataSet>;
    public userDataSet: Observable<UserDataSet>;

    constructor(private factory: ODataServiceFactory,
        private http: HttpClient, private accountService : AccountService) { 
        this.userDataSetSubject = new BehaviorSubject<UserDataSet>(JSON.parse(localStorage.getItem('userDataSet')));
        this.userDataSet = this.userDataSetSubject.asObservable();
    }

    public saveUserDataSet(email : string, token : string, language : string) {
      this.fetchUserDatSet(email,token,language).subscribe(resp => {
        if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
          console.log('saveUserDataSet');
          this.setUserSetValue(resp.body.d.results[0].Kunnr,resp.body.d.results[0].Scenario, resp.body.d.results[0].Kunnrx);
        }
      })
    }

    private fetchUserDatSet(email : string, token : string, language : string) : Observable<any>{
        /* URL: http://192.168.0.83:8000/sap/opu/odata/sap/ZSD_SP_SRV/UserDataSet?&$format=json&$filter=Email eq 'roberto.mazzocato@eservices.it' and Token eq '000D3A2544DE1EDAAD8D7B3C3456628D' and Langu eq 'I' */
        // Se può essere utile: https://github.com/techniq/odata-query/blob/master/README.md
        let url : string = 'UserDataSet?';
        url = url.concat('&$format=json');
        url = url.concat('&$filter=Email',' eq ', email, ' and ', 'Token', ' eq ', '\'',token,'\'', ' and ', 'Langu', ' eq ','\'',language,'\'');
        // console.log('fetchUserDatSet url:' + url);
        const filter = { Email: email, Token: token, Langu : language };
        const format = 'json';
        const outFilter = buildQuery({ format, filter });
        console.log('filter:' + outFilter);

        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('WEBAPPRIC' + 'ab123456') });
        let options = { headers: headers, observe: "response" as 'body'};
        return this.http.get<HttpResponse<any>>(
          '/destinations/ZSD_SP_SRV/UserDataSet' + outFilter, options);
    }
    public get userDataSetValue(): UserDataSet {
        return this.userDataSetSubject.value;
      }
    
      public setUserSetValue(Kunnr : string, Scenario : string, Kunnrx: string) {
        const u : UserDataSet = new UserData();
        u.Kunnr = Kunnr;
        u.Scenario = Scenario;
        u.Kunnrx = Kunnrx;
        localStorage.setItem('userDataSet', JSON.stringify(u));
        this.userDataSetSubject.next(u);
      }
}