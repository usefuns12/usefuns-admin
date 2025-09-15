import { Routes } from '@angular/router';

export const AGENCY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./agency.component').then((m) => m.AgencyComponent),
    data: { breadcrumb: 'Agencies' },
  },
];
