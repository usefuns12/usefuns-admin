import { Routes } from '@angular/router';

export const kpiRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./kpi.component').then((m) => m.KpiComponent),
  },
];
