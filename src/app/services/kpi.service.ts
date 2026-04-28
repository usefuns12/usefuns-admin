import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class KpiService {
  kpiRefresh$ = new Subject<boolean>();
  loader = signal(false);

  constructor(private http: HttpClient) {}

  /** KPI Dashboard APIs **/

  getDashboardSummary(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.kpi.GET_DASHBOARD_SUMMARY}`
    );
  }

  getSystemHealth(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.kpi.GET_SYSTEM_HEALTH}`
    );
  }

  getWalletHealth(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.kpi.GET_WALLET_HEALTH}`
    );
  }

  getSalaryCycleHealth(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.kpi.GET_SALARY_CYCLE_HEALTH}`
    );
  }

  getGiftAnomalies(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.kpi.GET_GIFT_ANOMALIES}`
    );
  }

  triggerRefresh(): void {
    this.kpiRefresh$.next(true);
  }
}
