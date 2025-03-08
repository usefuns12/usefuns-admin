import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root'
})
export class GiftService {
  giftSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  gift$ = this.giftSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCategories = (): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.gift.GET_CATEGORIES}`
    );
  };

  addCategory = (postData: FormData): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.gift.ADD_CATEGORY}`,
      postData
    );
  };

  updateCategory = (postData: FormData): Observable<any> => {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.gift.UPDATE_CATEGORY}`,
      postData
    );
  };

  removeCategory = (catId: string): Observable<any> => {
    return this.http.delete(
      `${environment.baseUrl}/${ApiEndpoints.gift.DELETE_CATEGORY}/${catId}`
    );
  };

  getGifts = (): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.gift.GET_GIFTS}`
    );
  };

  addGift = (postData: FormData): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.gift.ADD_GIFT}`,
      postData
    );
  };

  updateGift = (postData: FormData): Observable<any> => {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.gift.UPDATE_GIFT}`,
      postData
    );
  };

  removeGift = (catId: string): Observable<any> => {
    return this.http.delete(
      `${environment.baseUrl}/${ApiEndpoints.gift.DELETE_GIFT}/${catId}`
    );
  };

  updateGifts() {
    this.giftSubject.next(true);
  }
}
