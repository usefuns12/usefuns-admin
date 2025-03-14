import { Routes } from '@angular/router';

export const CAROUSEL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./carousels.component').then((m) => m.CarouselsComponent),
    data: {breadcrumb: 'Carousel'}
  },
];
