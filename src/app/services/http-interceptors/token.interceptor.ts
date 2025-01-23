import {
  HttpRequest,
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError, timer } from 'rxjs';
import {
  catchError,
  retry,
} from 'rxjs/operators';
import { ApiEndpoints } from '../../utils/api-constants';
import { Messages } from '../../utils/constants';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const retryCount = 2;
  const retryWaitMilliSeconds = 1000;
  const retryStatus = 504;
  const routes = [ApiEndpoints.auth.LOGIN];
  let errorMessage = Messages.Error.ERROR_UNKNOWN;

  const requireToken = (request: HttpRequest<any>): boolean =>
    new RegExp(routes.join('|')).test(request.url);

  let token = localStorage.getItem('token');

  if (!requireToken(req) && token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    retry({
      count: retryCount,
      delay: (error, retryAttempt) => {
        if (error.status === retryStatus) {
          return timer(retryWaitMilliSeconds);
        }

        throw error;
      },
    }),
    catchError((error: HttpErrorResponse) => {
      errorMessage = error.error?.message || Messages.Error.ERROR_UNKNOWN;
      return throwError(() => errorMessage);
    })
  );
};
