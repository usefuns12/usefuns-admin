import { Routes } from '@angular/router';

export const COUNTRY_MANAGERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./country-manager.component').then(
        (m) => m.CountryManagerComponent
      ),
    data: { breadcrumb: 'Country Managers' },
  },
];
