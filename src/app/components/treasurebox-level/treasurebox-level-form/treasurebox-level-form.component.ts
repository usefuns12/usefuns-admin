import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ShopItemService } from '../../../services/shop-item.service';
import { TreasureBoxLevelService } from '../../../services/treasurebox-level.service';
import { ImgCropperComponent } from '../../dialogs/img-cropper/img-cropper.component';

@Component({
  selector: 'app-treasurebox-level-form',
  templateUrl: './treasurebox-level-form.component.html',
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule],
})
export class TreasureBoxLevelFormComponent implements OnInit {
  levelForm: FormGroup;
  mode: 'add' | 'edit';
  isLoading = false;
  errorMessage = '';
  items: any[] = [];
  selectableItems: any[] = [];
  image: string | null = null;
  private imageBlob: Blob | null = null;
  imageChanged = signal(false);
  itemTypes = [
    { label: 'Diamonds', value: 'diamonds' },
    { label: 'Beans', value: 'beans' },
    { label: 'Item', value: 'item' },
    { label: 'XP', value: 'xp' },
  ];

  constructor(
    private fb: FormBuilder,
    private treasureboxService: TreasureBoxLevelService,
    private shopItemService: ShopItemService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<TreasureBoxLevelFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.mode = data.mode;
    this.levelForm = this.fb.group({
      level: [null, [Validators.required, Validators.min(1)]],
      diamondToOpen: [null, [Validators.min(0)]],
      person1Items: this.fb.array([]),
      person2Items: this.fb.array([]),
      person3Items: this.fb.array([]),
      otherItems: this.fb.array([]),
    });

    if (this.mode === 'edit') {
      this.patchFormValues();
      this.levelForm.get('level')?.disable();
    }
  }

  ngOnInit(): void {
    this.shopItemService.getItems().subscribe({
      next: (resp) => {
        this.items = resp.data || [];
        this.selectableItems = this.items.filter(
          (item) => item.itemType !== 'specialId',
        );
      },
      error: () => {
        this.items = [];
        this.selectableItems = [];
      },
    });
  }

  get person1Items(): FormArray {
    return this.levelForm.get('person1Items') as FormArray;
  }

  get person2Items(): FormArray {
    return this.levelForm.get('person2Items') as FormArray;
  }

  get person3Items(): FormArray {
    return this.levelForm.get('person3Items') as FormArray;
  }

  get otherItems(): FormArray {
    return this.levelForm.get('otherItems') as FormArray;
  }

  addItem(target: FormArray): void {
    target.push(this.createItemGroup());
  }

  removeItem(target: FormArray, index: number): void {
    target.removeAt(index);
  }

  openImageDialog(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/png, image/jpeg, image/jpg, image/svg+xml';
    fileInput.multiple = false;
    fileInput.onchange = ($event) => {
      const target = $event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const fileType = file.type;

        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result as string;
          const dialogRef = this.dialog.open(ImgCropperComponent, {
            width: '60%',
            disableClose: true,
            data: { imageEvent: base64Image, imgType: 'image' },
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.image = result.croppedImage.objectUrl;
              this.imageBlob = result.croppedImage.blob;
              this.imageChanged.set(true);
            }
          });
        };

        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
  }

  restoreImage(): void {
    const level = this.data.level || {};
    this.image = level.image || null;
    this.imageBlob = null;
    this.imageChanged.set(false);
  }

  patchFormValues(): void {
    const level = this.data.level || {};
    this.levelForm.patchValue({
      level: level.level,
      diamondToOpen: level.diamondToOpen || null,
    });

    if (level.image) {
      this.image = level.image;
    }

    this.setItemsFromLevel(this.person1Items, level.person1Items || []);
    this.setItemsFromLevel(this.person2Items, level.person2Items || []);
    this.setItemsFromLevel(this.person3Items, level.person3Items || []);
    this.setItemsFromLevel(this.otherItems, level.otherItems || []);
  }

  submit(): void {
    if (this.levelForm.invalid) return;

    this.errorMessage = '';
    const payload = this.buildPayload();

    if (!payload) return;

    this.isLoading = true;

    const formData = new FormData();
    const values = this.levelForm.getRawValue();

    formData.append('level', values.level);
    if (values.diamondToOpen) {
      formData.append('diamondToOpen', values.diamondToOpen);
    }

    if (this.imageBlob) {
      formData.append('file', this.imageBlob, 'file');
    } else if (this.image && !this.imageChanged()) {
      formData.append('image', this.image);
    }

    Object.keys(payload).forEach((key) => {
      if (key !== 'level' && key !== 'diamondToOpen') {
        formData.append(key, JSON.stringify(payload[key]));
      }
    });

    if (this.mode === 'add') {
      this.treasureboxService.createLevelFormData(formData).subscribe({
        next: (res) =>
          this.dialogRef.close({ refresh: true, message: res.message }),
        error: () => (this.isLoading = false),
      });
    } else {
      this.treasureboxService.updateLevelFormData(formData).subscribe({
        next: (res) =>
          this.dialogRef.close({ refresh: true, message: res.message }),
        error: () => (this.isLoading = false),
      });
    }
  }

  private buildPayload(): any | null {
    const person1Items = this.mapFormItems(this.person1Items, 'Person 1');
    const person2Items = this.mapFormItems(this.person2Items, 'Person 2');
    const person3Items = this.mapFormItems(this.person3Items, 'Person 3');
    const otherItems = this.mapFormItems(this.otherItems, 'Other');

    if (!person1Items || !person2Items || !person3Items || !otherItems) {
      return null;
    }

    return {
      level: this.levelForm.getRawValue().level,
      person1Items,
      person2Items,
      person3Items,
      otherItems,
    };
  }

  private createItemGroup(item: any = null): FormGroup {
    const type = item?.itemId
      ? 'item'
      : item?.diamondAmount !== undefined
        ? 'diamonds'
        : item?.beansAmount !== undefined
          ? 'beans'
          : item?.xp !== undefined
            ? 'xp'
            : 'diamonds';

    const validDays = item?.validTill;

    return this.fb.group({
      type: new FormControl(type, [Validators.required]),
      amount: new FormControl(
        item?.diamondAmount ?? item?.beansAmount ?? item?.xp ?? null,
      ),
      itemId: new FormControl(item?.itemId?._id || null),
      validDays: new FormControl(validDays),
    });
  }

  private setItemsFromLevel(target: FormArray, items: any[]): void {
    target.clear();
    items.forEach((item) => target.push(this.createItemGroup(item)));
  }

  private mapFormItems(target: FormArray, label: string): any[] | null {
    const mapped: any[] = [];

    for (const control of target.controls) {
      const group = control as FormGroup;
      const type = group.get('type')?.value;
      const amount = Number(group.get('amount')?.value);
      const itemId = group.get('itemId')?.value;
      const validDays = Number(group.get('validDays')?.value);

      if (!type) {
        this.errorMessage = `${label}: please select item type.`;
        return null;
      }

      if (type === 'item') {
        if (!itemId) {
          this.errorMessage = `${label}: please select an item.`;
          return null;
        }
        if (!validDays || validDays <= 0) {
          this.errorMessage = `${label}: validity days must be greater than 0.`;
          return null;
        }
        mapped.push({
          itemId,
          validTill: validDays,
        });
        continue;
      }

      if (!amount || amount <= 0) {
        this.errorMessage = `${label}: amount must be greater than 0.`;
        return null;
      }

      if (type === 'diamonds') {
        mapped.push({ diamondAmount: amount });
      } else if (type === 'beans') {
        mapped.push({ beansAmount: amount });
      } else if (type === 'xp') {
        mapped.push({ xp: amount });
      }
    }

    return mapped;
  }

  private addDays(days: number): Date {
    const ms = days * 24 * 60 * 60 * 1000;
    return new Date(Date.now() + ms);
  }

  // private convertValidTillToDays(validTill: any): number | null {
  //   const date = new Date(validTill);
  //   if (Number.isNaN(date.getTime())) return null;
  //   const diffMs = date.getTime() - Date.now();
  //   return Math.max(1, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
  // }
}
