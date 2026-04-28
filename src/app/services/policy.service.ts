import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  private refreshSubject = new Subject<void>();
  public policyRefresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllPolicies(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.policy.GET_ALL_POLICIES}`
    );
  }

  createHostSalaryPolicy(data: any): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.policy.CREATE_HOST_SALARY_POLICY}`,
      data
    );
  }

  updateHostSalaryPolicy(id: string, data: any): Observable<any> {
    return this.http.put(
      `${
        environment.baseUrl
      }/${ApiEndpoints.policy.UPDATE_HOST_SALARY_POLICY.replace(':id', id)}`,
      data
    );
  }

  deleteHostSalaryPolicy(id: string): Observable<any> {
    return this.http.delete(
      `${
        environment.baseUrl
      }/${ApiEndpoints.policy.DELETE_SALARY_POLICY.replace(':id', id)}`
    );
  }

  createCommissionPolicy(data: any): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.policy.CREATE_COMMISSION_POLICY}`,
      data
    );
  }

  updateCommissionPolicy(id: string, data: any): Observable<any> {
    return this.http.put(
      `${
        environment.baseUrl
      }/${ApiEndpoints.policy.UPDATE_COMMISSION_POLICY.replace(':id', id)}`,
      data
    );
  }

  processSalaryCycles(): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.policy.PROCESS_SALARY_CYCLES}`,
      {}
    );
  }

  payAllSalaries(): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.policy.PAY_ALL_SALARIES}`,
      {}
    );
  }

  calculateCommissions(): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.policy.CALCULATE_COMMISSIONS}`,
      {}
    );
  }

  payAllCommissions(): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.policy.PAY_ALL_COMMISSIONS}`,
      {}
    );
  }

  getSalaryStats(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.policy.GET_SALARY_STATS}`
    );
  }

  getCommissionStats(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.policy.GET_COMMISSION_STATS}`
    );
  }

  triggerRefresh(): void {
    this.refreshSubject.next();
  }
}
