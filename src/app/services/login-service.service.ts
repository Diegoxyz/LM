import { Injectable } from '@angular/core';
import { ODataClient, ODATA_ETAG, ODataServiceFactory, ODataConfig, HttpOptions, ODataEntitiesAnnotations, ODataEntityAnnotations, ODataEntityResource } from 'angular-odata';
import { Airport } from '../models/Airport/airport.entity';
import { MonitorDataSet } from '../models/MonitorDataSet/monitordataset.entity';
import { Observable, of } from 'rxjs';
import { LoginSet } from '../models/LoginSet/loginset.entity';
import { UserDataSet } from '../models/UserDataSet/userdataset.entity';
import { UserReqSet } from '../models/UserReq/userdataset.entity';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private factory: ODataServiceFactory) { }

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

  private getDefaultOptions(): HttpOptions {
    const httpOptions : HttpOptions = {
      params : {
        '$format': 'json'
      }
    };
    return httpOptions;
  }

  public login(username: string, password: string) {
    // TODO
    let loginService = this.factory.create<LoginSet>("LoginSet");
    let loginList = loginService.entities();
    let login = loginList.entity(username);
    login.get(this.getDefaultOptions())
       .subscribe(([l, annots]) => console.log("Login: ", l, "Annotations: ", annots));

    let newEntity : ODataEntityResource<LoginSet>;
    // let newLoginSet : LoginSet;
    // newEntity.post(newLoginSet, this.getDefaultOptions());
    loginService.save(newEntity).subscribe(o => {console.log(o)});
  }

  public queries(): Observable<[LoginSet[], ODataEntitiesAnnotations]> {
    let monitorService = this.factory.create<MonitorDataSet>("MonitorDataSet");
    console.log(monitorService.property);
    console.log(monitorService.navigationProperty);
    let dataSets1 = monitorService.entities();
    const httpOptions = this.getDefaultOptions;
    dataSets1.get(this.getDefaultOptions()).subscribe(dataset => console.log('MonitorDataSet', dataset));

    let userDataSetService = this.factory.create<UserDataSet>("UserDataSet");
    console.log(userDataSetService.property);
    console.log(userDataSetService.navigationProperty);
    let userDataSets = userDataSetService.entities();
    userDataSets.get(this.getDefaultOptions()).subscribe(dataset => console.log('userDataSet', dataset));

    let userReqService = this.factory.create<UserReqSet>("UserReqSet");
    console.log(userReqService.property);
    console.log(userReqService.navigationProperty);
    let userReqSets = userReqService.entities();
    userReqSets.get(this.getDefaultOptions()).subscribe(dataset => console.log('userReqSet', dataset));

    let loginService = this.factory.create<LoginSet>("LoginSet");
    console.log(loginService.property);
    console.log(loginService.navigationProperty);
    let loginDataSets = loginService.entities();
    loginDataSets.get(this.getDefaultOptions()).subscribe(dataset => console.log('loginDataSet', dataset));

    return loginDataSets.get(this.getDefaultOptions());
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
