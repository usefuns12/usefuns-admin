import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
// UTILS
import { ApiEndpoints } from '../../utils/api-constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login = (postData: any): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.auth.LOGIN}`,
      postData
    );
  };
}
