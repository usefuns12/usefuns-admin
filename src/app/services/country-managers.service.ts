import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class CountryManagerService {
  countryManagerFormSubject: Subject<any> = new Subject<any>();
  countryManagerForm$ = this.countryManagerFormSubject.asObservable();
  countryManagerListSubject: Subject<any> = new Subject<any>();
  countryManagerList$ = this.countryManagerListSubject.asObservable();
  loader = signal(false);

  constructor(private http: HttpClient) {}

  /** ----------------- CRUD APIs ----------------- **/

  getCountryManagers = (page?: number, limit?: number): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.countryManagers.GET_COUNTRY_MANAGERS}`
    );
  };

  addCountryManager = (payload: any): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.countryManagers.ADD_COUNTRY_MANAGER}`,
      payload
    );
  };

  updateCountryManager = (payload: any): Observable<any> => {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.countryManagers.UPDATE_COUNTRY_MANAGER}/${payload.id}`,
      payload
    );
  };

  deleteCountryManager = (id: string): Observable<any> => {
    return this.http.delete(
      `${environment.baseUrl}/${ApiEndpoints.countryManagers.DELETE_COUNTRY_MANAGER}/${id}`
    );
  };

  /** ----------------- Event Emitters ----------------- **/

  updateCountryManagerForm() {
    this.countryManagerFormSubject.next(true);
  }

  updateCountryManagerData() {
    this.countryManagerListSubject.next(true);
  }
}
