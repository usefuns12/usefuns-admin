import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class CountryAdminService {
  countryAdminFormSubject: Subject<any> = new Subject<any>();
  countryAdminForm$ = this.countryAdminFormSubject.asObservable();
  countryAdminListSubject: Subject<any> = new Subject<any>();
  countryAdminList$ = this.countryAdminListSubject.asObservable();
  loader = signal(false);

  constructor(private http: HttpClient) {}

  /** ----------------- CRUD APIs ----------------- **/

  getCountryAdmins = (page?: number, limit?: number): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.countryAdmins.GET_COUNTRY_ADMINS}`
    );
  };

  getCountryAdminByCountryManager = (
    countryManagerId: string
  ): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.countryAdmins.GET_COUNTRY_ADMINS_BY_MANAGER}?countryManagerId=${countryManagerId}`
    );
  };

  addCountryAdmin = (payload: any): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.countryAdmins.ADD_COUNTRY_ADMIN}`,
      payload
    );
  };

  updateCountryAdmin = (payload: any): Observable<any> => {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.countryAdmins.UPDATE_COUNTRY_ADMIN}/${payload.id}`,
      payload
    );
  };

  deleteCountryAdmin = (id: string): Observable<any> => {
    return this.http.delete(
      `${environment.baseUrl}/${ApiEndpoints.countryAdmins.DELETE_COUNTRY_ADMIN}/${id}`
    );
  };

  /** ----------------- Event Emitters ----------------- **/

  updateCountryAdminForm() {
    this.countryAdminFormSubject.next(true);
  }

  updateCountryAdminData() {
    this.countryAdminListSubject.next(true);
  }
}
