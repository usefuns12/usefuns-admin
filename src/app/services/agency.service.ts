import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class AgencyService {
  agencyFormSubject: Subject<any> = new Subject<any>();
  agencyForm$ = this.agencyFormSubject.asObservable();
  agencyListSubject: Subject<any> = new Subject<any>();
  agencyList$ = this.agencyListSubject.asObservable();
  loader = signal(false);

  constructor(private http: HttpClient) {}

  /** ----------------- CRUD APIs ----------------- **/

  getAgencies = (page?: number, limit?: number): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.agency.GET_AGENCIES}`
    );
  };

  addAgency = (payload: any): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.agency.ADD_AGENCY}`,
      payload
    );
  };

  updateAgency = (payload: any): Observable<any> => {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.agency.UPDATE_AGENCY}/${payload.id}`,
      payload
    );
  };

  deleteAgency = (id: string): Observable<any> => {
    return this.http.delete(
      `${environment.baseUrl}/${ApiEndpoints.agency.DELETE_AGENCY}/${id}`
    );
  };

  /** ----------------- Event Emitters ----------------- **/

  updateAgencyForm() {
    this.agencyFormSubject.next(true);
  }

  updateAgencyData() {
    this.agencyListSubject.next(true);
  }
}
