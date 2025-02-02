import { Component, computed, Injector, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { USER_ID_TOKEN } from '../../components/user-list/user.token';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  subItems?: MenuItem[];
};

@Component({
  selector: 'app-sidebar',
  animations: [
    trigger('expandSubMenu', [
      transition(':enter', [
        style({ opacity: 0, height: '0px' }),
        animate('200ms ease-in-out', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({ opacity: 0, height: '0px' })),
      ]),
    ]),
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    FontAwesomeModule,
    MatTooltipModule,
    RouterOutlet,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      icon: 'user',
      label: 'Users',
      route: 'users',
    },
    {
      icon: 'headset',
      label: 'Rooms',
      route: 'rooms',
    },
    {
      icon: 'gem',
      label: 'Shop Items',
      route: 'shop',
      subItems: [
        {
          icon: 'crop-simple',
          label: 'Frames',
          route: '',
        },
        {
          icon: 'comment',
          label: 'Chat Bubbles',
          route: '',
        },
        {
          icon: 'image',
          label: 'Themes',
          route: '',
        },
      ],
    },
    {
      icon: 'arrow-right-from-bracket',
      label: 'Logout',
    },
  ];

  collapsed = signal(false);
  nestedMenuOpen = signal(false);
  isDrawerOpen = signal(false);
  drawerContent: any = null;
  dataInjector: any = null;
  sidebarCollapsedWidth = computed(() => (this.collapsed() ? 'collapsed' : ''));

  constructor(private router: Router) {}

  toggleNestedMenu(item: MenuItem) {
    if (!item.subItems?.length) {
      return;
    }

    this.nestedMenuOpen.set(!this.nestedMenuOpen());
  }

  openDrawer(component: any, userId: string) {
    this.drawerContent = component;
    this.dataInjector = Injector.create({
      providers: [{ provide: USER_ID_TOKEN, useValue: { userId, mode: 'view' }}],
    });
    this.isDrawerOpen.set(true);
  }

  closeDrawer() {
    this.drawerContent = null;
    this.dataInjector = null;
    this.isDrawerOpen.set(false);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['auth']);
  }
}
