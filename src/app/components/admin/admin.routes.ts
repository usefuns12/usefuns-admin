import { Routes } from '@angular/router';

export const ADMINS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin.component').then((m) => m.AdminComponent),
    data: { breadcrumb: 'Admins' },
  },
];
