import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NetworkStatusInterceptor } from './network-status.interceptor';
import { TokenInterceptor } from './token.interceptor';
import { UnauthInterceptor } from './unauth.interceptor';

export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: NetworkStatusInterceptor,
    multi: true,
  },
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: UnauthInterceptor, multi: true },
];
