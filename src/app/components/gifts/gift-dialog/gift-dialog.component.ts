import { Component, Inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { GiftService } from '../../../services/gift.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-gift-dialog',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './gift-dialog.component.html',
  styleUrl: './gift-dialog.component.scss',
})
export class GiftDialogComponent {
  giftId: string;
  name: string;
  loader = signal(false);
  title: string;
  mode: string;
  categories: any[] = [];
  categoryForm: FormGroup;
  selectedCat: any;

  constructor(
    public dialogRef: MatDialogRef<GiftDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: GiftService
  ) {
    this.giftId = data.giftId;
    this.name = data.name;
    this.categoryForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
    });
    this.setMode(data.mode);
  }

  setMode(mode: string, category: any = null) {
    this.mode = mode;
    if (mode === 'show') {
      this.title = 'Categories';
      this.getCategories();
    } else if (mode === 'add') {
      this.title = 'Add category';
    } else if (mode === 'remove') {
      this.title = 'Remove category';
      this.selectedCat = category;
    } else if (mode === 'removeGift') {
      this.title = 'Remove gift';
    } else if (mode === 'update') {
      this.title = 'Update category';
      this.selectedCat = category;
      this.categoryForm.patchValue({ name: category.name });
    }
  }

  getCategories() {
    this.apiService.getCategories().subscribe(
      (resp) => {
        this.loader.set(false);
        this.categories = resp.data;
      },
      (err) => {
        console.error(err);
        this.loader.set(false);
      }
    );
  }

  updateCategory(action: string) {
    this.loader.set(true);
    let postData: any = {};
    if (this.selectedCat) {
      postData._id = this.selectedCat._id;
      postData.name = this.categoryForm.value.name;
    }
    const apiSubscription =
      action === 'add'
        ? this.apiService.addCategory(this.categoryForm.value)
        : this.apiService.updateCategory(postData);
    apiSubscription.subscribe(
      (resp) => {
        this.loader.set(false);
        if (action === 'add') {
          this.dialogRef.close({ success: true, message: resp.message });
        } else {
          this.setMode('show');
          this.selectedCat = null;
        }
      },
      (err) => {
        console.error(err);
        this.loader.set(false);
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  removeCategory(): void {
    this.loader.set(true);
    this.apiService.removeCategory(this.selectedCat._id).subscribe(
      (resp) => {
        this.loader.set(false);
        this.setMode('show');
        this.selectedCat = null;
      },
      (err) => {
        console.error(err);
        this.loader.set(false);
      }
    );
  }

  removeGift(): void {
    this.loader.set(true);
    this.apiService.removeGift(this.giftId).subscribe(
      (resp) => {
        this.loader.set(false);
        this.dialogRef.close({ success: true, message: resp.message });
        this.apiService.updateGifts();
      },
      (err) => {
        console.error(err);
        this.loader.set(false);
        this.dialogRef.close({ success: false, message: err });
      }
    );
  }
}
