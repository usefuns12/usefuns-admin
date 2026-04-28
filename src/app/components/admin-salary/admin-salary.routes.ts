import { Routes } from '@angular/router';

export const ADMIN_SALARY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./salary-cycles/salary-cycles.component').then(
        (m) => m.SalaryCyclesComponent
      ),
  },
  {
    path: 'cycles/:id',
    loadComponent: () =>
      import('./salary-cycle-detail/salary-cycle-detail.component').then(
        (m) => m.SalaryCycleDetailComponent
      ),
  },
  {
    path: 'agency-commissions',
    loadComponent: () =>
      import('./agency-commissions/agency-commissions.component').then(
        (m) => m.AgencyCommissionsComponent
      ),
  },
  {
    path: 'agency-commissions/:id',
    loadComponent: () =>
      import(
        './agency-commission-detail/agency-commission-detail.component'
      ).then((m) => m.AgencyCommissionDetailComponent),
  },
];
