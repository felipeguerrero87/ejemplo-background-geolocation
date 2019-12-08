import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { geoSupervisorModel } from '../models/geosupervisor.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  trackingURL = 'http://www.sisguard.cl:2040/api/trackSupervisor'

  constructor( private http: HttpClient) { }

  postTrack(datos: geoSupervisorModel): Observable<any>{
    console.log(datos);
    let body = JSON.stringify(datos);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.trackingURL, body, {headers});
  }
}
