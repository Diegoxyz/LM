import { Injectable } from '@angular/core';
import { ODataClient, ODATA_ETAG, ODataServiceFactory, ODataConfig, HttpOptions, ODataEntitiesAnnotations, ODataEntityAnnotations, ODataEntityResource, ODataEntitySetResource } from 'angular-odata';
import { Airport } from '../models/OData/Airport/airport.entity';
import { Observable, of } from 'rxjs';
import { LoginSet } from '../models/OData/LoginSet/loginset.entity';
import { UserDataSet } from '../models/OData/UserDataSet/userdataset.entity';
import { UserReqSet } from '../models/OData/UserReq/userdataset.entity';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private factory: ODataServiceFactory, private httpClient: HttpClient) { }

  /*public queries(): Observable<[MonitorDataSet[], ODataEntitiesAnnotations]> {
    let monitorService = this.factory.create<MonitorDataSet>("MonitorDataSet");
    console.log(monitorService.property);
    console.log(monitorService.navigationProperty);
    let dataSets = monitorService.entities();
    let params = new HttpParams();
    params.append('$format','true');
    const httpOptions : HttpOptions = {
      params : {
        '$format': 'json'
      }
    };
    dataSets.get(httpOptions).subscribe(dataset => console.log('d', dataset));
    return dataSets.get(httpOptions);
  }*/

  private setHttpOptions(headers?: Map<string,string>,params?: Map<string, string>) : HttpOptions{
    // let httpOptions : HttpOptions = { params : {}, headers : {}, withCredentials : false};
    
    // Params
    let httpParams : HttpParams = this.getDefaultParameters();
    if (params && params.size > 0) {
      params.forEach((k,v) => {
        httpParams.set(v,k);
      });
      
    }
    // httpOptions.params = httpParams;

    // Headers
    let httpHeaders : HttpHeaders = new HttpHeaders();
    if (headers && headers.size > 0 ) {
      headers.forEach((k,v) => {
        httpHeaders.set(v,k);
      });
    }
    // httpOptions.headers = httpHeaders;

    const httpOptions : HttpOptions = { params : { '$format' : 'json'}, headers : {'X-CSRF-Token':'Fetch'}, withCredentials : false};
    return httpOptions;
  }

  private getDefaultParameters(): HttpParams {
    const httpParams : HttpParams = new HttpParams();
    httpParams.set('$format','json');
    return httpParams;
  }

  public getCSRFToken(): string {
    let token : string = '';
    this.httpClient.get('/destinations/ZSD_SP_SRV/LoginSet',{
      observe: "response", headers: {
        'X-CSRF-Token':'Fetch'
      }
    }).subscribe(response => {
      if (response && response.headers) {
        if (response.headers) {
          console.log('X-CSRF-Token:' + response.headers.get('X-CSRF-Token'));
          token = response.headers.get('X-CSRF-Token');
        }
      }
    });
    return token;
  }
  public login(username: string, password: string) {
   // const csrftoken : string = this.getCSRFToken();
    // TODO
    let loginService = this.factory.create<LoginSet>("LoginSet");
    console.log('after login service');
    let loginDataSets = loginService.entities();
    console.log('after loginList');
    // let httpOptions : HttpOptions = { params : { '$format' : 'json'}, headers : {'X-CSRF-Token':'Fetch'}};
   /* let httpOptions : HttpOptions = { 
      params : {'$format' : 'json' },
      headers : {
        'Content-Type':'application/json',
        'X-CSRF-Token':csrftoken
      }};
    console.log('httpOptions:' + httpOptions); */
    /*loginDataSets.get(httpOptions)
       .subscribe(([l, annots]) => {
         console.log("Login: ", l, "Annotations: ", annots);
        });*/
        let newLoginSet : LoginSet = {
          Username : username,
          Password : password,
          Token    : '',
          Langu    : ''
        }

        this.httpClient.get('/destinations/ZSD_SP_SRV/LoginSet',{
          observe: "response", headers: {
            'X-CSRF-Token':'Fetch'
          }
        }).subscribe(response => {
          if (response && response.headers) {
            if (response.headers) {
              console.log('X-CSRF-Token:' + response.headers.get('X-CSRF-Token'));
              const csrftoken : string = response.headers.get('X-CSRF-Token');
          
              let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrftoken });
              let options = { headers: headers };
              /*this.httpClient.post<LoginSet>('/destinations/ZSD_SP_SRV/LoginSet',{username : username,
                password : password,
                token : ''},
                options
                ).subscribe(response => {
                  console.log('response:' || response);
                  if (response) {
                    console.log('response.token:' + response.token);
                  }
              });*/

              console.log('newLoginSet:' + newLoginSet);
              console.log('loginService:' + loginService);
              /*loginService.create(newLoginSet).subscribe(next => {
                console.log('next:' + next);
                if (next) {
                  console.log('o.values:' + next.values());
                  console.log('length:' + next.values.length);
                  if (next.values.length === 0) {
                    console.log('User not found');
                  } else if (next.values.length === 1) {
                    // Ok
                    console.log('values to string:' + next.values.toString());
                  } else {
                    console.log('Too many values, it should not happen');
                  }
                }
              }, error => {
                if (error) {
                  console.log('Error:' + error);
                }
              }, () => {
                // TODO Do something if required
              });*/
              console.log('loginDataSet');
              loginDataSets.post(newLoginSet,options).subscribe(
                o => {
                  o.forEach((v : LoginSet) => {
                    console.log('v:' + v);
                    if (v) {
                      console.log('v.token:' + v.Token);
                    }
                  })
                  console.log('entries:' + o.entries[0]);
                },
              
                ([loginSet, annots ])=> { 
                  console.log('type:' + annots.type);
                  console.log(annots.properties);
                  console.log(annots.id);
                  console.log('post login set:' + loginSet);
                  console.log('loginSet.token:' + loginSet.Token);
                  console.log('loginSet.username:' + loginSet.Username);
                  newLoginSet.Token = loginSet.token;
                  console.log('newLoginSet.token:' + newLoginSet.Token);
                  }
              );
            }
          }
        });
    

    

    
    // let newLoginSet : LoginSet;
    // newEntity.post(newLoginSet, this.getDefaultOptions());
    // loginService.save(newEntity).subscribe(o => {console.log(o)});
  }

  public queries(): Observable<[LoginSet[], ODataEntitiesAnnotations]> {

    let userDataSetService = this.factory.create<UserDataSet>("UserDataSet");
    console.log(userDataSetService.property);
    console.log(userDataSetService.navigationProperty);
    let userDataSets = userDataSetService.entities();
    userDataSets.get(this.setHttpOptions()).subscribe(dataset => console.log('userDataSet', dataset));

    let userReqService = this.factory.create<UserReqSet>("UserReqSet");
    console.log(userReqService.property);
    console.log(userReqService.navigationProperty);
    let userReqSets = userReqService.entities();
    userReqSets.get(this.setHttpOptions()).subscribe(dataset => console.log('userReqSet', dataset));

    let loginService = this.factory.create<LoginSet>("LoginSet");
    console.log(loginService.property);
    console.log(loginService.navigationProperty);
    let loginDataSets = loginService.entities();
    loginDataSets.get(this.setHttpOptions()).subscribe(dataset => console.log('loginDataSet', dataset));

    return loginDataSets.get(this.setHttpOptions());
  }

  public airportQueries(): void {
    // Use OData Service Factory
    let airportsService = this.factory.create<Airport>("Airports");
    let airports = airportsService.entities();
    // Fetch set
    airports.all()
      .subscribe(aports => console.log("All: ", aports));
     // Fetch by key
     let airport = airports.entity("CYYZ");
     airport.get()
       .subscribe(([aport, annots]) => console.log("Airport: ", aport, "Annotations: ", annots));
  }
}
