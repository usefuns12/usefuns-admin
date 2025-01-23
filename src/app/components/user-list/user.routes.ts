import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-list.component').then((m) => m.UserListComponent),
  },
  {
    path: 'edit',
    loadComponent: () =>
      import('./user-edit/user-edit.component').then(
        (m) => m.UserEditComponent
      ),
  },
];
