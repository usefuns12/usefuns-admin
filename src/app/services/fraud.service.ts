import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root',
})
export class FraudService {
  private refreshSubject = new Subject<void>();
  public fraudRefresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) {}

  listFraudActions(filters?: any): Observable<any> {
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
      `${environment.baseUrl}/${ApiEndpoints.fraud.LIST_FRAUD_ACTIONS}`,
      { params }
    );
  }

  getFraudAction(id: string): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.fraud.GET_FRAUD_ACTION.replace(
        ':id',
        id
      )}`
    );
  }

  getTargetFraudActions(
    targetType: string,
    targetRef: string
  ): Observable<any> {
    return this.http.get(
      `${
        environment.baseUrl
      }/${ApiEndpoints.fraud.GET_TARGET_FRAUD_ACTIONS.replace(
        ':targetType',
        targetType
      ).replace(':targetRef', targetRef)}`
    );
  }

  getFraudStats(): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.fraud.GET_FRAUD_STATS}`
    );
  }

  createFraudAction(data: any): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.fraud.CREATE_FRAUD_ACTION}`,
      data
    );
  }

  releaseFraudAction(id: string, reason: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.fraud.RELEASE_FRAUD_ACTION.replace(
        ':id',
        id
      )}`,
      { reason }
    );
  }

  extendFraudAction(id: string, data: any): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.fraud.EXTEND_FRAUD_ACTION.replace(
        ':id',
        id
      )}`,
      data
    );
  }

  convertToPermanent(id: string, reason: string): Observable<any> {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.fraud.CONVERT_TO_PERMANENT.replace(
        ':id',
        id
      )}`,
      { reason }
    );
  }

  triggerRefresh(): void {
    this.refreshSubject.next();
  }
}
