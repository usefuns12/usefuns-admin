import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class SubAdminService {
  subAdminFormSubject: Subject<any> = new Subject<any>();
  subAdminForm$ = this.subAdminFormSubject.asObservable();
  subAdminListSubject: Subject<any> = new Subject<any>();
  subAdminList$ = this.subAdminListSubject.asObservable();
  loader = signal(false);

  constructor(private http: HttpClient) {}

  /** ----------------- CRUD APIs ----------------- **/

  getSubAdmin = (page?: number, limit?: number): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.subAdmin.GET_SUBADMINS}`
    );
  };

  // getSubAdminByCountryAdmin = (countryAdminId: string): Observable<any> => {
  //   return this.http.get(
  //     `${environment.baseUrl}/${ApiEndpoints.subAdmin.GET_SUB_ADMIN_BY_COUNTRY_ADMIN}?countryAdminId=${countryAdminId}`
  //   );
  // };

  addSubAdmin = (payload: any): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.subAdmin.ADD_SUBADMIN}`,
      payload
    );
  };

  updateSubAdmin = (payload: any): Observable<any> => {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.subAdmin.UPDATE_SUBADMIN}/${payload.id}`,
      payload
    );
  };

  deleteSubAdmin = (id: string): Observable<any> => {
    return this.http.delete(
      `${environment.baseUrl}/${ApiEndpoints.subAdmin.DELETE_SUBADMIN}/${id}`
    );
  };

  /** ----------------- Event Emitters ----------------- **/

  updateSubAdminForm() {
    this.subAdminFormSubject.next(true);
  }

  updateSubAdminData() {
    this.subAdminListSubject.next(true);
  }
}
