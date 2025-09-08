import { Routes } from '@angular/router';

export const COUNTRY_ADMINS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./country-admin.component').then((m) => m.CountryAdminComponent),
    data: { breadcrumb: 'Country Admins' },
  },
];
