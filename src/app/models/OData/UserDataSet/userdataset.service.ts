import { UserDataSet } from './userdataset.entity';
import { ODataEntityService, ODataEntityAnnotations, ODataEntitiesAnnotations, ODataValueAnnotations, ODataEntityResource, HttpOptions, ODataServiceFactory } from 'angular-odata';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { UserData, User } from '@app/models/user';
import { AccountService } from '@app/services/account.service';
import buildQuery from 'odata-query';
import { environment } from '@environments/environment';

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
          this.setUserSetValue(resp);
        }
      })
    }

    public fetchUserDatSet(email : string, token : string, language : string) : Observable<any>{
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
          'Content-Type': 'application/json' });
        let options = { headers: headers, observe: "response" as 'body'};
        return this.http.get<HttpResponse<any>>(
          environment.oData_destination + 'UserDataSet' + outFilter, options);
    }
    public get userDataSetValue(): UserDataSet {
        return this.userDataSetSubject.value;
      }
    
      public setUserSetValue(resp : any) {
        const u : UserDataSet = {
          "Kunnr" : resp.body.d.results[0].Kunnr,
          "Scenario" : resp.body.d.results[0].Scenario,
          "Kunnrx" : resp.body.d.results[0].Kunnrx,
          "Stras" : resp.body.d.results[0].Stras,
          "Langu" : resp.body.d.results[0].Langu,
          "Pstlz" : resp.body.d.results[0].Pstlz,
          "KunnrRif" : resp.body.d.results[0].KunnrRif,
          "KunnrRifx" : resp.body.d.results[0].KunnrRifx,
          "Ort01" : resp.body.d.results[0].Ort01,
          "Regio" : resp.body.d.results[0].Regio,
          "Parnr" : resp.body.d.results[0].Parnr,
          "Land1" : resp.body.d.results[0].Land1,
          "Email" : resp.body.d.results[0].Email,
          "ErdatAct" : resp.body.d.results[0].ErdatAct,
          "UzeitAct" : resp.body.d.results[0].UzeitAct,
          "PswInitial" : resp.body.d.results[0].PswInitial,
          "Ruolo" : resp.body.d.results[0].Ruolo,
          "ErdatChangePsw" : resp.body.d.results[0].ErdatChangePsw,
          "UzeitChangePsw" : resp.body.d.results[0].UzeitChangePsw,
          "Token" : resp.body.d.results[0].Token
        }
        localStorage.setItem('userDataSet', JSON.stringify(u));
        this.userDataSetSubject.next(u);
      }
}