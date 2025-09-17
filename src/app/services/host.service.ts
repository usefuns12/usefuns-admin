import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class HostService {
  hostFormSubject: Subject<any> = new Subject<any>();
  hostForm$ = this.hostFormSubject.asObservable();
  hostListSubject: Subject<any> = new Subject<any>();
  hostList$ = this.hostListSubject.asObservable();
  loader = signal(false);

  constructor(private http: HttpClient) {}

  /** ----------------- CRUD APIs ----------------- **/

  getHosts = (page?: number, limit?: number): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.host.GET_HOSTS}`
    );
  };

  addHost = (payload: any): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.host.ADD_HOST}`,
      payload
    );
  };

  updateHost = (payload: any): Observable<any> => {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.host.UPDATE_HOST}/${payload.id}`,
      payload
    );
  };

  deleteHost = (id: string): Observable<any> => {
    return this.http.delete(
      `${environment.baseUrl}/${ApiEndpoints.host.DELETE_HOST}/${id}`
    );
  };

  /** ----------------- Event Emitters ----------------- **/

  updateHostForm() {
    this.hostFormSubject.next(true);
  }

  updateHostData() {
    this.hostListSubject.next(true);
  }
}
