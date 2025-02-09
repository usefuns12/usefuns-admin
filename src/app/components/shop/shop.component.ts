import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ToastrService } from 'ngx-toastr';
import { SidebarComponent } from '../../navigation/sidebar/sidebar.component';
import { ShopItemService } from '../../services/shop-item.service';
import { ItemFormComponent } from './item-form/item-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatChipListboxChange, MatChipsModule} from '@angular/material/chips';
import { Subscription } from 'rxjs';
import { RemoveItemDialogComponent } from './remove-item-dialog/remove-item-dialog.component';

@Component({
  selector: 'app-shop',
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    FontAwesomeModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit, OnDestroy {
  items: any[] = [];
  filteredItems: any[] = [];
  isLoading: boolean;
  shopItemSubscription: Subscription;
  itemTypeOptions = [
    { name: 'Chat Bubble', value: 'chatBubble' },
    { name: 'Extra Seat', value: 'extraSeat' },
    { name: 'Frame', value: 'frame' },
    { name: 'Lock Room', value: 'lockRoom' },
    { name: 'Relationship', value: 'relationship' },
    { name: 'Special Id', value: 'specialId' },
    { name: 'Theme', value: 'theme' },
    { name: 'Vehicle', value: 'vehicle' },
  ];

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
    this.sidebar.openDrawer(item ? 'Edit item' : 'Add new item', ItemFormComponent, item);
  }

  getItems() {
    this.isLoading = true;
    this.apiService.getItems().subscribe(
      (resp) => {
        this.items = resp.data;
        this.filteredItems = this.items.filter(item => item.itemType === 'chatBubble');
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

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
    this.filteredItems = this.items.filter(item => item.itemType === event.value);
  }

  ngOnDestroy(): void {
    this.shopItemSubscription.unsubscribe();
  }
}
