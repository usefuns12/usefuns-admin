import { Component, Inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CarouselService } from '../../../services/carousel.service';

@Component({
  selector: 'app-carousel-dialog',
  imports: [MatDialogModule],
  templateUrl: './carousel-dialog.component.html',
  styleUrl: './carousel-dialog.component.scss',
})
export class CarouselDialogComponent {
  carouselId: string;
  loader = signal(false);

  constructor(
    public dialogRef: MatDialogRef<CarouselDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: CarouselService
  ) {
    this.carouselId = data.carouselId;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  removeItem(): void {
    this.loader.set(true);
    this.apiService.removeCarousel(this.carouselId).subscribe(
      (resp) => {
        this.loader.set(false);
        this.dialogRef.close({ success: true, message: resp.message });
        this.apiService.updateCarousels();
      },
      (err) => {
        console.error(err);
        this.loader.set(false);
        this.dialogRef.close({ success: false, message: err });
      }
    );
  }
}
