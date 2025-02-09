import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class ShopItemService {
  shopItemSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  shopItem$ = this.shopItemSubject.asObservable();
  drawerSubject: Subject<any> = new Subject<any>();
  drawer$ = this.drawerSubject.asObservable();

  constructor(private http: HttpClient) {}

  getItems = (): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.shop.GET_ITEMS}`
    );
  };

  addtem = (postData: FormData): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.shop.ADD_ITEM}`,
      postData
    );
  };

  updatetItem = (postData: FormData): Observable<any> => {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.shop.UPDATE_ITEM}`,
      postData
    );
  };

  removeItems = (itemId: string): Observable<any> => {
    return this.http.delete(
      `${environment.baseUrl}/${ApiEndpoints.shop.DELETE_ITEM}/${itemId}`
    );
  };

  updateShopItems() {
    this.shopItemSubject.next(true);
  }

  updateDrawer() {
    this.drawerSubject.next(true);
  }
}
