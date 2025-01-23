import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { NetworkService } from '../network/network.service';
import { Messages } from '../../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class NetworkStatusInterceptor implements HttpInterceptor {
  private errorMessage = Messages.Error.NO_INTERNET;

  constructor(private networkService: NetworkService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.networkService.isOnline().pipe(
      switchMap((online) => {
        if (!online) {
          return throwError(this.errorMessage);
        }
        return next.handle(request);
      })
    );
  }
}
