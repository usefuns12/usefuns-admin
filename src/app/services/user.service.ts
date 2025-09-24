import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userFormSubject: Subject<any> = new Subject<any>();
  userForm$ = this.userFormSubject.asObservable();
  userListSubject: Subject<any> = new Subject<any>();
  userList$ = this.userListSubject.asObservable();
  loader = signal(false);

  constructor(private http: HttpClient) {}

  getUsers = (page?: number, limit?: number): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.users.GET_USERS}`
    );
  };

  getUnAssignedUsers = (): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.users.GET_UNASSIGNED_USERS}`
    );
  };

  getUserDetails = (userId: string): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.users.GET_USER_DETAILS}/${userId}`
    );
  };

  getGifts = (userId: string): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.users.GET_GIFTS}/${userId}`
    );
  };

  updateUserForm() {
    this.userFormSubject.next(true);
  }

  updateUserData() {
    this.userListSubject.next(true);
  }

  updateUser = (userId: string, userPost: FormData): Observable<any> => {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.users.UPDATE_USER}/${userId}`,
      userPost
    );
  };

  updateUserRoom = (roomId: string, roomPost: FormData): Observable<any> => {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.rooms.UPDATE_ROOM}/${roomId}`,
      roomPost
    );
  };

  searchUsers = (term: string): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.users.SEARCH_USER}/${term}`
    );
  };

  addShopItem = (payload: any): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.users.SHOP_ITEM}`,
      payload
    );
  };

  assistItems = (payload: any): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.users.ASSIST_ITEMS}`,
      payload
    );
  };

  removeShopItem = (payload: any): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.users.REMOVE_SHOP_ITEM}`,
      payload
    );
  };

  banDevice = (userId: string, payload: any): Observable<any> => {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.users.UPDATE_USER}/${userId}`,
      payload
    );
  };

  assistSpecialIdItems = (payload: any): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.users.ASSIST_SPECIAL_ID_ITEMS}`,
      payload
    );
  };
}
