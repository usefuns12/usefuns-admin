import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
class PermissionsService {
  constructor(private router: Router, private jwtHelper: JwtHelperService) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (!token && this.jwtHelper.isTokenExpired(token)) {
      return true;
    }

    this.router.navigate(['']);
    return false;
  }
}

export const unAuthGuard: CanActivateFn = (route, state) => {
  return inject(PermissionsService).canActivate();
};
