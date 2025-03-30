import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ToastrService } from 'ngx-toastr';
import { SidebarComponent } from '../../navigation/sidebar/sidebar.component';
import { ShopItemService } from '../../services/shop-item.service';
import { ItemFormComponent } from './item-form/item-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { Subscription } from 'rxjs';
import { RemoveItemDialogComponent } from './remove-item-dialog/remove-item-dialog.component';
import { Downloader, Parser, Player } from 'svga.lite';

@Component({
  selector: 'app-shop',
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    FontAwesomeModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit, /* AfterViewInit, */ OnDestroy {
  items: any[] = [];
  filteredItems: any[] = [];
  isLoading: boolean;
  shopItemSubscription: Subscription;
  selectedCurrentItem: string;
  itemTypeOptions = [
    { name: 'Chat Bubble', value: 'chatBubble' },
    { name: 'Extra Seat', value: 'extraSeat' },
    { name: 'Frame', value: 'frame' },
    { name: 'Lock Room', value: 'lockRoom' },
    { name: 'Relationship', value: 'relationship' },
    /* { name: 'Special Id', value: 'specialId' }, */
    { name: 'Theme', value: 'theme' },
    { name: 'Vehicle', value: 'vehicle' },
  ];
  //@ViewChildren('svgaCanvas') svgaCanvases!: QueryList<ElementRef>;

  constructor(
    private sidebar: SidebarComponent,
    private apiService: ShopItemService,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.shopItemSubscription = this.apiService.shopItem$.subscribe(() =>
      this.getItems()
    );
  }

  openDrawer(item: string | null = null) {
    this.sidebar.openDrawer(
      item ? 'Edit item' : 'Add new item',
      ItemFormComponent,
      item
    );
  }

  openAssistDrawer() {
    this.sidebar.openDrawer(
      'Assist items',
      ItemFormComponent,
      null
    );
  }

  getItems() {
    this.isLoading = true;
    this.apiService.getItems().subscribe(
      (resp) => {
        this.items = resp.data;
        /* this.items = this.items.map((item) => ({
          ...item,
          isSVGA: item.resource.endsWith('.svga'),
        })); */
        this.filteredItems = this.items.filter(
          (item) => item.itemType ===  (this.selectedCurrentItem ? this.selectedCurrentItem : 'chatBubble')
        );
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  /* ngAfterViewInit(): void {
    this.svgaCanvases.changes.subscribe((canvases: QueryList<ElementRef>) => {
      if (canvases.length > 0) {
        const svgaItems = this.filteredItems.filter((item) => item.isSVGA);
        canvases.forEach((canvas, index) => {
          this.initSVGA(canvas.nativeElement, svgaItems[index].resource);
        });
      }
    });
  }

  async initSVGA(canvas: HTMLCanvasElement, resourceUrl: string) {
    canvas.setAttribute('style', 'width: 100px;');
    const downloader = new Downloader();
    const parser = new Parser();
    const player = new Player(canvas);
    const fileData = await downloader.get(resourceUrl);
    const svgaData = await parser.do(fileData);

    player.set({
      loop: true,
      cacheFrames: true,
      intersectionObserverRender: false,
    });

    await player.mount(svgaData);
    player.start();
  } */

  removeItem(item: any) {
    const dialogRef = this.dialog.open(RemoveItemDialogComponent, {
      width: '50%',
      disableClose: true,
      data: {
        itemId: item._id,
        name: item.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.success) {
          this.toastrService.success(result.message);
        } else {
          this.toastrService.error(result.message);
        }
      }
    });
  }

  onChipSelectionChange(event: MatChipListboxChange) {
    this.selectedCurrentItem = event.value;
    this.filteredItems = this.items.filter(
      (item) => item.itemType === this.selectedCurrentItem
    );
  }

  openFullImage(src: string) {
    window.open(src, '_blank');
  }

  ngOnDestroy(): void {
    this.shopItemSubscription.unsubscribe();
  }
}
