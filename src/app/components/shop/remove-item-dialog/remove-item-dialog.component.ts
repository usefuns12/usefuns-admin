import { Component, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BanUserDialogComponent } from '../../user-list/ban-user-dialog/ban-user-dialog.component';
import { ShopItemService } from '../../../services/shop-item.service';

@Component({
  selector: 'app-remove-item-dialog',
  imports: [MatDialogModule],
  templateUrl: './remove-item-dialog.component.html',
  styleUrl: './remove-item-dialog.component.scss',
})
export class RemoveItemDialogComponent {
  itemId: string;
  name: string;
  loader = signal(false);

  constructor(
    public dialogRef: MatDialogRef<BanUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ShopItemService
  ) {
    this.itemId = data.itemId;
    this.name = data.name;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  removeItem(): void {
    this.loader.set(true);
    this.apiService.removeItems(this.itemId).subscribe(
      (resp) => {
        this.loader.set(false);
        this.dialogRef.close({ success: true, message: resp.message });
        this.apiService.updateShopItems();
      },
      (err) => {
        console.error(err);
        this.loader.set(false);
        this.dialogRef.close({ success: false, message: err });
      }
    );
  }
}
