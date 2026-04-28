import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class CustomerServiceRoomService {
  loader = signal(false);

  constructor(private http: HttpClient) {}

  getCountryAdminRooms(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.rooms.GET_COUNTRY_ADMIN_ROOMS}`
    );
  }

  convertToCustomerServiceRoom(roomId: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.rooms.CONVERT_CUSTOMER_SERVICE_ROOM}`,
      { roomId }
    );
  }
}
