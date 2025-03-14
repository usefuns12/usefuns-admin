import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ToastrService } from 'ngx-toastr';
import { SidebarComponent } from '../../navigation/sidebar/sidebar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { CarouselService } from '../../services/carousel.service';
import { CarouselFormComponent } from './carousel-form/carousel-form.component';
import { CarouselDialogComponent } from './carousel-dialog/carousel-dialog.component';

@Component({
  selector: 'app-carousels',
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    FontAwesomeModule,
    MatTooltipModule,
  ],
  templateUrl: './carousels.component.html',
  styleUrl: './carousels.component.scss',
})
export class CarouselsComponent implements OnInit, OnDestroy {
  carousels: any[] = [];
  filteredCarousels: any[] = [];
  isLoading: boolean;
  carouselSubscription: Subscription;
  selectedCurrentItem: string;

  constructor(
    private sidebar: SidebarComponent,
    private apiService: CarouselService,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.carouselSubscription = this.apiService.carousel$.subscribe(() =>
      this.getCarousels()
    );
  }

  openDrawer(item: string | null = null) {
    this.sidebar.openDrawer(
      item ? 'Edit carousel' : 'Add new carousel',
      CarouselFormComponent,
      item
    );
  }

  getCarousels() {
    this.isLoading = true;
    this.apiService.getCarousels().subscribe(
      (resp) => {
        this.carousels = resp.data;
        this.filteredCarousels = this.carousels.filter((c) => true);
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  openDialog(carousel: any) {
    let data: any = {};
    const dialogRef = this.dialog.open(CarouselDialogComponent, {
      width: '50%',
      disableClose: true,
      data: { carouselId: carousel._id },
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

  openFullImage(src: string) {
    window.open(src, '_blank');
  }

  ngOnDestroy(): void {
    this.carouselSubscription.unsubscribe();
  }
}
