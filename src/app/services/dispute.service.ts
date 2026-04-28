import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class DisputeService {
  private refreshSubject = new Subject<void>();
  public disputeRefresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) {}

  listDisputes(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (
          filters[key] !== null &&
          filters[key] !== undefined &&
          filters[key] !== ''
        ) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.dispute.LIST_DISPUTES}`,
      { params }
    );
  }

  getDispute(id: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.dispute.GET_DISPUTE.replace(
        ':id',
        id
      )}`
    );
  }

  raiseDispute(data: any): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.dispute.RAISE_DISPUTE}`,
      data
    );
  }

  getMyDisputes(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params = params.set(key, filters[key]);
      });
    }
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.dispute.GET_MY_DISPUTES}`,
      { params }
    );
  }

  reviewDispute(id: string, data: any): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.dispute.REVIEW_DISPUTE.replace(
        ':id',
        id
      )}`,
      data
    );
  }

  simulateRecalculation(id: string, data: any): Observable<any> {
    return this.http.post(
      `${
        environment.baseUrl
      }/${ApiEndpoints.dispute.SIMULATE_RECALCULATION.replace(':id', id)}`,
      data
    );
  }

  resolveDispute(id: string, data: any): Observable<any> {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.dispute.RESOLVE_DISPUTE.replace(
        ':id',
        id
      )}`,
      data
    );
  }

  rejectDispute(id: string, reason: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.dispute.REJECT_DISPUTE.replace(
        ':id',
        id
      )}`,
      { reason }
    );
  }

  approveAdjustment(id: string): Observable<any> {
    return this.http.patch(
      `${environment.baseUrl}/${ApiEndpoints.dispute.APPROVE_ADJUSTMENT.replace(
        ':id',
        id
      )}`,
      {}
    );
  }

  triggerRefresh(): void {
    this.refreshSubject.next();
  }
}
