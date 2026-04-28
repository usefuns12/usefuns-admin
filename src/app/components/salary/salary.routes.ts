import { Routes } from '@angular/router';

export const SALARY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./salary.component').then((m) => m.SalaryComponent),
    data: { breadcrumb: 'Salary Management' },
  },
];
