import { Routes } from '@angular/router';

export const ALERT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/alert-list/alert-list.component').then(
        (m) => m.AlertListComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/alert-detail/alert-detail.component').then(
        (m) => m.AlertDetailComponent
      ),
  },
];
