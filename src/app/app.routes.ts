import { Routes } from '@angular/router';
import { SIDEBAR_ROUTES } from './navigation/sidebar/sidebar.routes';
import { unAuthGuard } from './guard/unauth.guard';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [unAuthGuard],
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
    data: { title: 'Authentication' },
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./navigation/sidebar/sidebar.component').then(
        (m) => m.SidebarComponent
      ),
    children: [...SIDEBAR_ROUTES],
    data: { title: 'Dasboard' },
  },
];
