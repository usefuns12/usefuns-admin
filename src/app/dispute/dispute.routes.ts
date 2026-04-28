import { Routes } from '@angular/router';

export const DISPUTE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/dispute-list/dispute-list.component').then(
        (m) => m.DisputeListComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/dispute-detail/dispute-detail.component').then(
        (m) => m.DisputeDetailComponent
      ),
  },
];
