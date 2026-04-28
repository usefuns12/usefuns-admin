import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class TreasureBoxLevelService {
  constructor(private http: HttpClient) {}

  getLevels(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.treasurebox.GET_LEVELS}`,
    );
  }

  createLevel(postData: any): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.treasurebox.CREATE_LEVEL}`,
      postData,
    );
  }

  updateLevel(postData: any): Observable<any> {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.treasurebox.UPDATE_LEVEL}`,
      postData,
    );
  }

  createLevelFormData(formData: FormData): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.treasurebox.CREATE_LEVEL}`,
      formData,
    );
  }

  updateLevelFormData(formData: FormData): Observable<any> {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.treasurebox.UPDATE_LEVEL}`,
      formData,
    );
  }
}
