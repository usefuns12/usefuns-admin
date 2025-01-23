import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers = (page?: number, limit?: number): Observable<any> => {
    return this.http.get(`${environment.baseUrl}/${ApiEndpoints.users.GET_USERS}`);
  };

  getUserDetails = (userId: string): Observable<any> => {
    return this.http.get(`${environment.baseUrl}/${ApiEndpoints.users.GET_USER_DETAILS}/${userId}`);
  };
}
