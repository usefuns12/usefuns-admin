import { Routes } from '@angular/router';

export const HOST_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./host.component').then((m) => m.HostComponent),
    data: { breadcrumb: 'Hosts' },
  },
];
