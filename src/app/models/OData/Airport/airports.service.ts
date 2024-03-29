import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ODataEntityService, ODataEntityAnnotations, ODataEntitiesAnnotations, ODataValueAnnotations, ODataEntityResource, HttpOptions } from 'angular-odata';

import { Airport } from './airport.entity';


@Injectable()
export class AirportsService extends ODataEntityService<Airport> {
  static path: string = 'Airports';
  static type: string = 'Airport';
  
  // Actions
  
  // Functions
  public getNearestAirport(lat: number, lon: number, options?: HttpOptions): Observable<[Airport, ODataEntityAnnotations]> {
    let args = Object.entries({ lat, lon })
      .filter(pair => pair[1] !== null)
      .reduce((acc, val) => (acc[val[0]] = val[1], acc), {});
    var res = this.client.function<Airport>('GetNearestAirport', 'Airport');
    return res.call(args, 'entity', options);
  }
  
  // Navigations
  
}
