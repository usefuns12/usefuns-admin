import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private refreshSubject = new Subject<void>();
  public alertRefresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) {}

  listAlerts(filters?: any): Observable<any> {
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
      `${environment.baseUrl}/${ApiEndpoints.alert.LIST_ALERTS}`,
      { params }
    );
  }

  getAlert(id: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.alert.GET_ALERT.replace(
        ':id',
        id
      )}`
    );
  }

  getAlertStats(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.alert.GET_ALERT_STATS}`
    );
  }

  getEntityAlerts(referenceType: string, referenceId: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.alert.GET_ENTITY_ALERTS.replace(
        ':referenceType',
        referenceType
      ).replace(':referenceId', referenceId)}`
    );
  }

  acknowledgeAlert(id: string, note?: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.alert.ACKNOWLEDGE_ALERT.replace(
        ':id',
        id
      )}`,
      { note }
    );
  }

  resolveAlert(id: string, data: any): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.alert.RESOLVE_ALERT.replace(
        ':id',
        id
      )}`,
      data
    );
  }

  escalateAlert(id: string, data: any): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.alert.ESCALATE_ALERT.replace(
        ':id',
        id
      )}`,
      data
    );
  }

  bulkAcknowledge(alertIds: string[], note?: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.alert.BULK_ACKNOWLEDGE}`,
      { alertIds, note }
    );
  }

  bulkResolve(
    alertIds: string[],
    note: string,
    actions?: string[]
  ): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.alert.BULK_RESOLVE}`,
      { alertIds, note, actions }
    );
  }

  triggerRefresh(): void {
    this.refreshSubject.next();
  }
}
