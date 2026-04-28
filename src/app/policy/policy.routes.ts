import { Routes } from '@angular/router';

export const POLICY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/policy-list/policy-list.component').then(
        (m) => m.PolicyListComponent
      ),
  },
];
