import {
  Component,
  computed,
  Injector,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import {
  GIFT_TOKEN,
  ITEM_TOKEN,
  USER_ID_TOKEN,
} from '../../utils/injector-tokens.token';
import { UserFormComponent } from '../../components/user-list/user-form/user-form.component';
import { ItemFormComponent } from '../../components/shop/item-form/item-form.component';
import { Subscription } from 'rxjs';
import { ShopItemService } from '../../services/shop-item.service';
import { GiftFormComponent } from '../../components/gifts/gift-form/gift-form.component';
import { DrawerService } from '../../services/drawer.service';

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
export class SidebarComponent implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [
    {
      icon: 'user',
      label: 'Users',
      route: 'users',
    },
    /* {
      icon: 'headset',
      label: 'Rooms',
      route: 'rooms',
    }, */
    {
      icon: 'gem',
      label: 'Shop Items',
      route: 'shop',
      /* subItems: [
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
      ], */
    },
    {
      icon: 'gift',
      label: 'Gifts',
      route: 'gifts',
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
  drawerTitle: string;
  drawerSubscription: Subscription;

  constructor(
    private router: Router,
    private drawerService: DrawerService
  ) {}

  ngOnInit(): void {
    this.drawerSubscription = this.drawerService.drawer$.subscribe(() =>
      this.toggleDrawer()
    );
  }

  toggleNestedMenu(item: MenuItem) {
    if (!item.subItems?.length) {
      return;
    }

    this.nestedMenuOpen.set(!this.nestedMenuOpen());
  }

  openDrawer(title: string, component: any, Id: any) {
    this.drawerTitle = title;
    this.drawerContent = component;
    const providers: any[] = [];
    if (component === UserFormComponent) {
      providers.push({
        provide: USER_ID_TOKEN,
        useValue: { userId: Id, mode: 'view' },
      });
    } else if (component === ItemFormComponent) {
      providers.push({
        provide: ITEM_TOKEN,
        useValue: { item: Id, mode: Id ? 'edit' : 'add' },
      });
    } else if (component === GiftFormComponent) {
      providers.push({
        provide: GIFT_TOKEN,
        useValue: { gift: Id, mode: Id ? 'edit' : 'add' },
      });
    }
    this.dataInjector = Injector.create({ providers });
    this.isDrawerOpen.set(true);
  }

  closeDrawer() {
    this.drawerContent = null;
    this.dataInjector = null;
    this.isDrawerOpen.set(false);
  }

  toggleDrawer() {
    document.getElementById('drawer-close-btn')?.click();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['auth']);
  }

  ngOnDestroy(): void {
    this.drawerSubscription.unsubscribe();
  }
}
