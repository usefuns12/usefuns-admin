import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class SalaryService {
  salaryRefresh$ = new Subject<boolean>();
  loader = signal(false);

  constructor(private http: HttpClient) {}

  /** Salary Cycles APIs **/

  getSalaryCycles(
    page?: number,
    limit?: number,
    status?: string
  ): Observable<any> {
    let params = new HttpParams();
    if (page) params = params.set('page', page.toString());
    if (limit) params = params.set('limit', limit.toString());
    if (status) params = params.set('status', status);

    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.salary.GET_SALARY_CYCLES}`,
      { params }
    );
  }

  getSalaryCycleStats(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.salary.GET_SALARY_CYCLE_STATS}`
    );
  }

  getSalaryCycleById(cycleId: string): Observable<any> {
    return this.http.get(
      `${
        environment.baseUrl
      }/${ApiEndpoints.salary.GET_SALARY_CYCLE_BY_ID.replace(':id', cycleId)}`
    );
  }

  recalculateSalaryCycle(cycleId: string): Observable<any> {
    return this.http.post(
      `${
        environment.baseUrl
      }/${ApiEndpoints.salary.RECALCULATE_SALARY_CYCLE.replace(
        ':id',
        cycleId
      )}`,
      {}
    );
  }

  holdSalaryCycle(cycleId: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.salary.HOLD_SALARY_CYCLE.replace(
        ':id',
        cycleId
      )}`,
      {}
    );
  }

  releaseSalaryCycle(cycleId: string): Observable<any> {
    return this.http.post(
      `${
        environment.baseUrl
      }/${ApiEndpoints.salary.RELEASE_SALARY_CYCLE.replace(':id', cycleId)}`,
      {}
    );
  }

  forcePayoutCycle(cycleId: string): Observable<any> {
    return this.http.post(
      `${
        environment.baseUrl
      }${ApiEndpoints.salary.FORCE_PAYOUT_SALARY_CYCLE.replace(
        ':id',
        cycleId
      )}`,
      {}
    );
  }

  reversePayment(cycleId: string): Observable<any> {
    return this.http.post(
      `${
        environment.baseUrl
      }/${ApiEndpoints.salary.REVERSE_SALARY_PAYMENT.replace(':id', cycleId)}`,
      {}
    );
  }

  /** Agency Commission APIs **/

  getAgencyCommissions(page?: number, limit?: number): Observable<any> {
    let params = new HttpParams();
    if (page) params = params.set('page', page.toString());
    if (limit) params = params.set('limit', limit.toString());

    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.salary.GET_AGENCY_COMMISSIONS}`,
      { params }
    );
  }

  getCommissionStats(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.salary.GET_AGENCY_COMMISSION_STATS}`
    );
  }

  getAgencyCommissionById(commissionId: string): Observable<any> {
    return this.http.get(
      `${
        environment.baseUrl
      }/${ApiEndpoints.salary.GET_AGENCY_COMMISSION_BY_ID.replace(
        ':id',
        commissionId
      )}`
    );
  }

  /** Transaction Lock APIs **/

  unlockFunds(transactionId: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.salary.UNLOCK_FUNDS.replace(
        ':id',
        transactionId
      )}`,
      {}
    );
  }

  relockFunds(transactionId: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.salary.RELOCK_FUNDS.replace(
        ':id',
        transactionId
      )}`,
      {}
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

  /** Event Emitters **/

  refreshSalaryData() {
    this.salaryRefresh$.next(true);
  }
}
