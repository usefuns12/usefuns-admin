import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  adminFormSubject: Subject<any> = new Subject<any>();
  adminForm$ = this.adminFormSubject.asObservable();
  adminListSubject: Subject<any> = new Subject<any>();
  adminList$ = this.adminListSubject.asObservable();
  loader = signal(false);

  constructor(private http: HttpClient) {}

  /** ----------------- CRUD APIs ----------------- **/

  getAdmin = (page?: number, limit?: number): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.admin.GET_ADMINS}`
    );
  };

  getAdminByCountryAdmin = (countryAdminId: string): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.admin.GET_ADMIN_BY_COUNTRY_ADMIN}?countryAdminId=${countryAdminId}`
    );
  };

  addAdmin = (payload: any): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.admin.ADD_ADMIN}`,
      payload
    );
  };

  updateAdmin = (payload: any): Observable<any> => {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.admin.UPDATE_ADMIN}/${payload.id}`,
      payload
    );
  };

  deleteAdmin = (id: string): Observable<any> => {
    return this.http.delete(
      `${environment.baseUrl}/${ApiEndpoints.admin.DELETE_ADMIN}/${id}`
    );
  };

  /** ----------------- Event Emitters ----------------- **/

  updateAdminForm() {
    this.adminFormSubject.next(true);
  }

  updateAdminData() {
    this.adminListSubject.next(true);
  }
}
