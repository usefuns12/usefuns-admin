import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { GiftService } from '../../../../services/gift.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ShopItemService } from '../../../../services/shop-item.service';
import { UserService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-items-dialog',
  imports: [MatDialogModule, ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './items-dialog.component.html',
  styleUrl: './items-dialog.component.scss',
})
export class ItemsDialogComponent {
  mode: string;
  userId: string;
  itemType: string;
  itemId: string;
  loader = signal(false);
  itemtypes: any[] = [
    { name: 'Frame', value: 'frame' },
    { name: 'Chat bubble', value: 'chatBubble' },
    { name: 'Theme', value: 'theme' },
    { name: 'Vehicle', value: 'vehicle' },
    { name: 'Relationship', value: 'relationship' },
    { name: 'Special Id', value: 'specialId' },
    { name: 'Lock room', value: 'lockRoom' },
    { name: 'Extra seat', value: 'extraSeat' },
  ];
  items: any[] = [];
  filteredItems: any[] = [];
  itemForm: FormGroup;
  selectedItem: any;

  constructor(
    public dialogRef: MatDialogRef<ItemsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private itemService: ShopItemService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.userId = data.userId;
    this.mode = data.mode;
    this.itemType = data.itemType;
    this.itemId = data.itemId;
    this.itemForm = new FormGroup({
      itemType: new FormControl(null, [Validators.required]),
      item: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
    });

    this.itemForm.controls['itemType'].valueChanges.subscribe((val) => {
      this.filteredItems = this.items.filter((item) => item.itemType === val);
    });

    this.itemForm.controls['item'].valueChanges.subscribe((val) => {
      this.selectedItem = this.filteredItems.find((item) => item._id === val);
    });
    this.getShopItems();
  }

  getShopItems() {
    this.itemService.getItems().subscribe(
      (resp) => {
        this.items = resp.data;
      },
      (err) => {}
    );
  }

  addItem() {
    this.loader.set(true);
    const formData = this.itemForm.value;
    const selectedPrice = this.selectedItem.priceAndValidity.find(
      (price: any) => price._id === formData.price
    );

    const payload = {
      userId: this.userId,
      item: {
        _id: this.selectedItem._id,
        name: this.selectedItem.name,
        resource: this.selectedItem.resource,
        thumbnail: this.selectedItem.thumbnail,
        validTill: this.getExpirationTime(selectedPrice.validity),
        isDefault: this.selectedItem.isDefault,
        isOfficial: this.selectedItem.isOfficial,
      },
      itemType: formData.itemType,
      price: selectedPrice.price,
    };

    this.userService.addShopItem(payload).subscribe(
      (resp) => {
        this.loader.set(false);
        this.dialogRef.close({ success: true, message: resp.message });
        this.userService.updateUserData();
      },
      (err) => {
        this.loader.set(false);
        this.toastr.error(err);
      }
    );
  }

  getExpirationTime(days: number): string {
    const now = new Date();

    const expiration = new Date(now);
    expiration.setDate(now.getDate() + days); // Add the specified days

    expiration.setHours(23, 59, 59, 999);

    return expiration.toISOString();
  }

  removeShopItem() {
    const payload = {
      userId: this.userId,
      itemType: this.itemType,
      itemId: this.itemId,
    };

    this.userService.removeShopItem(payload).subscribe(
      (resp) => {
        this.loader.set(false);
        this.dialogRef.close({ success: true, message: resp.message });
        this.userService.updateUserData();
      },
      (err) => {
        this.loader.set(false);
        this.toastr.error(err);
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
