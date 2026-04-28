import { Routes } from '@angular/router';

export const FRAUD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/fraud-list/fraud-list.component').then(
        (m) => m.FraudListComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/fraud-detail/fraud-detail.component').then(
        (m) => m.FraudDetailComponent
      ),
  },
];
