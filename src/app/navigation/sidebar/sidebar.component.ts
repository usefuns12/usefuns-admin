import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  Injector,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';
import { ApiFormComponent } from '../../components/api-config/api-form/api-form.component';
import { CarouselFormComponent } from '../../components/carousels/carousel-form/carousel-form.component';
import { GiftFormComponent } from '../../components/gifts/gift-form/gift-form.component';
import { QuantityComponent } from '../../components/quantity/quantity.component';
import { ItemFormComponent } from '../../components/shop/item-form/item-form.component';
import { UserFormComponent } from '../../components/user-list/user-form/user-form.component';
import { DrawerService } from '../../services/drawer.service';
import {
  APIKEY_TOKEN,
  CAROUSEL_TOKEN,
  GIFT_TOKEN,
  ITEM_TOKEN,
  USER_ID_TOKEN,
} from '../../utils/injector-tokens.token';

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
      icon: 'q',
      label: 'Quantities',
      route: 'quantities',
    },
    {
      icon: 'user-tie',
      label: 'Country Managers',
      route: 'country-managers',
    },
    // {
    //   icon: 'user-tie',
    //   label: 'Country Admins',
    //   route: 'country-admin',
    // },
    // {
    //   icon: 'user-tie',
    //   label: 'Admins',
    //   route: 'admins',
    // },
    // {
    //   icon: 'user-tie',
    //   label: 'Sub Admins',
    //   route: 'sub-admins',
    // },
    {
      icon: 'images',
      label: 'Carousels',
      route: 'carousels',
    },
    {
      icon: 'file-alt',
      label: 'Reports',
      route: 'reports',
    },
    {
      icon: 'gear',
      label: 'Settings',
      route: 'settings',
      subItems: [
        {
          icon: 'code',
          label: 'API Config',
          route: 'settings/apiConfig',
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
  drawerTitle: string;
  drawerSubscription: Subscription;

  constructor(
    private router: Router,
    private drawerService: DrawerService,
    public route: ActivatedRoute
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
        useValue: {
          item: Id,
          mode: Id ? 'edit' : 'add',
          assist: title === 'Assist items' ? true : false,
        },
      });
    } else if (component === GiftFormComponent) {
      providers.push({
        provide: GIFT_TOKEN,
        useValue: { gift: Id, mode: Id ? 'edit' : 'add' },
      });
    } else if (component === QuantityComponent) {
      providers.push({
        provide: ITEM_TOKEN,
        useValue: { item: Id, mode: Id ? 'edit' : 'add' },
      });
    } else if (component === CarouselFormComponent) {
      providers.push({
        provide: CAROUSEL_TOKEN,
        useValue: { carousel: Id, mode: Id ? 'edit' : 'add' },
      });
    } else if (component === ApiFormComponent) {
      providers.push({
        provide: APIKEY_TOKEN,
        useValue: { apiKey: Id, mode: Id ? 'edit' : 'add' },
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
