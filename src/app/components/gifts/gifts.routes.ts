import { Routes } from '@angular/router';

export const GIFT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./gifts.component').then((m) => m.GiftsComponent),
    data: {breadcrumb: 'Gift'}
  },
];
