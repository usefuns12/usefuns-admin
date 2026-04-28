import { Routes } from '@angular/router';

export const CUSTOMER_SERVICE_ROOM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./customer-service-room.component').then(
        (m) => m.CustomerServiceRoomComponent
      ),
    data: { breadcrumb: 'Customer Service Rooms' },
  },
];
