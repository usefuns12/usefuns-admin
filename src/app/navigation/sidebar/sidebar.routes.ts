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
    data: { breadcrumb: 'Users' },
  },
  {
    path: 'shop',
    loadChildren: () =>
      import('../../components/shop/shop.routes').then((m) => m.SHOP_ROUTES),
    data: { breadcrumb: 'Shop' },
  },
  {
    path: 'gifts',
    loadChildren: () =>
      import('../../components/gifts/gifts.routes').then((m) => m.GIFT_ROUTES),
    data: { breadcrumb: 'Gift' },
  },
  {
    path: 'quantities',
    loadChildren: () =>
      import('../../components/quantity/quantity.routes').then(
        (m) => m.QUANTITY_ROUTES
      ),
    data: { breadcrumb: 'Quantities' },
  },

  {
    path: 'country-managers',
    loadChildren: () =>
      import('../../components/country-manager/country-manager.routes').then(
        (m) => m.COUNTRY_MANAGERS_ROUTES
      ),
    data: { breadcrumb: 'Country Managers' },
  },
  {
    path: 'country-admin',
    loadChildren: () =>
      import('../../components/country-admin/country-admin.routes').then(
        (m) => m.COUNTRY_ADMINS_ROUTES
      ),
    data: { breadcrumb: 'Country Admins' },
  },
  {
    path: 'admins',
    loadChildren: () =>
      import('../../components/admin/admin.routes').then(
        (m) => m.ADMINS_ROUTES
      ),
    data: { breadcrumb: 'Admins' },
  },
  {
    path: 'sub-admins',
    loadChildren: () =>
      import('../../components/sub-admin/sub-admin.routes').then(
        (m) => m.ADMINS_ROUTES
      ),
    data: { breadcrumb: 'Sub Admins' },
  },
  {
    path: 'carousels',
    loadChildren: () =>
      import('../../components/carousels/carousels.routes').then(
        (m) => m.CAROUSEL_ROUTES
      ),
    data: { breadcrumb: 'Carousel' },
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('../../components/report-list/report-list.routes').then(
        (m) => m.REPORT_ROUTES
      ),
    data: { breadcrumb: 'Reports' },
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('../../components/api-config/api-config.routes').then(
        (m) => m.APICONFIG_ROUTES
      ),
    data: { breadcrumb: 'Settings' },
  },
];
