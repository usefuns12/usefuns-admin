import { Routes } from '@angular/router';

export const APICONFIG_ROUTES: Routes = [
  {
    path: 'apiConfig',
    loadComponent: () =>
      import('./api-config.component').then((m) => m.ApiConfigComponent),
    data: {breadcrumb: 'API Config'}
  },
];
