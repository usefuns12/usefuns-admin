import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-img-cropper',
  imports: [MatDialogModule, ImageCropperComponent],
  templateUrl: './img-cropper.component.html',
  styleUrl: './img-cropper.component.scss',
})
export class ImgCropperComponent {
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    public dialogRef: MatDialogRef<ImgCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.imageChangedEvent = data.imageEvent;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  cropAndSave(): void {
    this.dialogRef.close({croppedImage: this.croppedImage, imgType: this.data.imgType});
  }
}
