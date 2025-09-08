import { Routes } from '@angular/router';

export const ADMINS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./sub-admin.component').then((m) => m.SubAdminComponent),
    data: { breadcrumb: 'Sub Admins' },
  },
];
