import { Routes } from '@angular/router';

export const TREASUREBOX_LEVEL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./treasurebox-level.component').then(
        (m) => m.TreasureBoxLevelComponent,
      ),
    data: { breadcrumb: 'Treasure Box Levels' },
  },
];
