import { Injectable } from '@angular/core';
import { ODataClient, ODATA_ETAG, ODataServiceFactory, ODataConfig, HttpOptions, ODataEntitiesAnnotations, ODataEntityAnnotations } from 'angular-odata';
import { HttpParams } from '@angular/common/http';
import { Airport } from '../models/Airport/airport.entity';
import { MonitorDataSet } from '../models/MonitorDataSet/monitordataset.entity';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private factory: ODataServiceFactory) { }

  public queries(): Observable<[MonitorDataSet[], ODataEntitiesAnnotations]> {
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
