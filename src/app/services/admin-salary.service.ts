import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class AdminSalaryService {
  private refreshSubject = new Subject<void>();
  public salaryRefresh$ = this.refreshSubject.asObservable();
  public isLoading = signal(false);

  constructor(private http: HttpClient) {}

  // Salary Cycles (Read-only)
  getSalaryCycles(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.salary.GET_SALARY_CYCLES}`,
      { params }
    );
  }

  getSalaryCycleById(id: string): Observable<any> {
    return this.http.get(
      `${
        environment.baseUrl
      }${ApiEndpoints.salary.GET_SALARY_CYCLE_BY_ID.replace(':id', id)}`
    );
  }

  getSalaryCycleStats(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.salary.GET_SALARY_CYCLE_STATS}`,
      { params }
    );
  }

  // Agency Commissions (Read-only)
  getAgencyCommissions(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.salary.GET_AGENCY_COMMISSIONS}`,
      { params }
    );
  }

  getAgencyCommissionById(id: string): Observable<any> {
    return this.http.get(
      `${
        environment.baseUrl
      }/${ApiEndpoints.salary.GET_AGENCY_COMMISSION_BY_ID.replace(':id', id)}`
    );
  }

  getAgencyCommissionStats(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined) {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.salary.GET_AGENCY_COMMISSION_STATS}`,
      { params }
    );
  }

  // Admin Actions
  recalculateSalaryCycle(
    id: string,
    data: {
      reason: string;
      diamondAdjustment?: number;
      hourAdjustment?: number;
    }
  ): Observable<any> {
    return this.http.post(
      `${
        environment.baseUrl
      }/${ApiEndpoints.salary.RECALCULATE_SALARY_CYCLE.replace(':id', id)}`,
      data
    );
  }

  holdSalaryCycle(id: string, reason: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.salary.HOLD_SALARY_CYCLE.replace(
        ':id',
        id
      )}`,
      { reason }
    );
  }

  releaseSalaryCycle(id: string): Observable<any> {
    return this.http.post(
      `${
        environment.baseUrl
      }/${ApiEndpoints.salary.RELEASE_SALARY_CYCLE.replace(':id', id)}`,
      {}
    );
  }

  forcePayoutSalaryCycle(id: string, reason: string): Observable<any> {
    return this.http.post(
      `${
        environment.baseUrl
      }/${ApiEndpoints.salary.FORCE_PAYOUT_SALARY_CYCLE.replace(':id', id)}`,
      { reason }
    );
  }

  reverseSalaryPayment(id: string, reason: string): Observable<any> {
    return this.http.post(
      `${
        environment.baseUrl
      }/${ApiEndpoints.salary.REVERSE_SALARY_PAYMENT.replace(':id', id)}`,
      { reason }
    );
  }

  // Wallet Lock/Unlock Actions
  unlockFunds(transactionId: string, reason: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.salary.UNLOCK_FUNDS.replace(
        ':id',
        transactionId
      )}`,
      { reason }
    );
  }

  relockFunds(transactionId: string, reason: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.salary.RELOCK_FUNDS.replace(
        ':id',
        transactionId
      )}`,
      { reason }
    );
  }

  getWalletLockStatus(userId: string): Observable<any> {
    return this.http.get(
      `${
        environment.baseUrl
      }/${ApiEndpoints.salary.GET_WALLET_LOCK_STATUS.replace(
        ':userId',
        userId
      )}`
    );
  }

  triggerRefresh(): void {
    this.refreshSubject.next();
  }
}
