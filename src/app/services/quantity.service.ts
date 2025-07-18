import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class QuantityService {
  quantitySubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  quantity$ = this.quantitySubject.asObservable();

  constructor(private http: HttpClient) {}

  getQuantities = (): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.quantity.GET_ALL}`
    );
  };

  addQuantity = (postData: any): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.quantity.ADD}`,
      postData
    );
  };

  updateQuantity = (postData: any): Observable<any> => {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.quantity.UPDATE}`,
      postData
    );
  };

  deleteQuantity = (id: string): Observable<any> => {
    return this.http.delete(
      `${environment.baseUrl}/${ApiEndpoints.quantity.DELETE}/${id}`
    );
  };

  updateQuantities() {
    this.quantitySubject.next(true);
  }
}
