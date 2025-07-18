import { Routes } from '@angular/router';

export const QUANTITY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./quantity.component').then((m) => m.QuantityComponent),
    data: { breadcrumb: 'Quantity' },
  },
];
