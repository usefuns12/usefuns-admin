import { Routes } from '@angular/router';

export const SIDEBAR_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadChildren: () =>
      import('../../components/user-list/user.routes').then(
        (m) => m.USER_ROUTES
      ),
    data: { breadcrumb: 'Users' }
  },
];
