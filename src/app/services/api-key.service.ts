import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class ApiKeyService {
  apiKeySubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  apiKey$ = this.apiKeySubject.asObservable();

  constructor(private http: HttpClient) {}

  getApiKeys = (): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.apiKey.GET_APIKEYS}`
    );
  };

  addApiKey = (postData: any): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.apiKey.ADD_APIKEY}`,
      postData
    );
  };

  updateApiKey = (postData: any): Observable<any> => {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.apiKey.UPDATE_APIKEY}`,
      postData
    );
  };

  removeApiKey = (id: string): Observable<any> => {
    return this.http.delete(
      `${environment.baseUrl}/${ApiEndpoints.apiKey.DELETE_APIKEY}/${id}`
    );
  };

  updateApiKeys() {
    this.apiKeySubject.next(true);
  }
}
