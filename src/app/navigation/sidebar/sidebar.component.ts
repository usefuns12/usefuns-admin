import { Component, computed, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

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
        animate('200ms ease-in-out', style({ opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({ opacity: 0, height: '0px' }))
      ])
    ])
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    FontAwesomeModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {

  menuItems: MenuItem[] = [
    {
      icon: 'user',
      label: 'Users',
      route: ''
    },
    {
      icon: 'headset',
      label: 'Rooms',
      route: ''
    },
    {
      icon: 'gem',
      label: 'Shop Items',
      route: '',
      subItems: [
        {
          icon: 'crop-simple',
          label: 'Frames',
          route: ''
        },
        {
          icon: 'comment',
          label: 'Chat Bubbles',
          route: ''
        },
        {
          icon: 'image',
          label: 'Themes',
          route: ''
        }
      ]
    }
  ];

  collapsed = signal(false);
  nestedMenuOpen = signal(false);
  sidebarCollapsedWidth = computed(() => this.collapsed() ? 'collapsed' : '');

  constructor() {}

  toggleNestedMenu(item: MenuItem) {
    if(!item.subItems?.length) {
      return;
    }

    this.nestedMenuOpen.set(!this.nestedMenuOpen());
  }
}
