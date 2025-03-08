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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { Subscription } from 'rxjs';
import { Downloader, Parser, Player } from 'svga.lite';
import { GiftFormComponent } from './gift-form/gift-form.component';
import { GiftDialogComponent } from './gift-dialog/gift-dialog.component';
import { GiftService } from '../../services/gift.service';

@Component({
  selector: 'app-gifts',
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    FontAwesomeModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './gifts.component.html',
  styleUrl: './gifts.component.scss',
})
export class GiftsComponent {
  gifts: any[] = [];
  filteredGifts: any[] = [];
  isLoading: boolean;
  giftSubscription: Subscription;
  selectedCurrentItem: string;
  @ViewChildren('svgaCanvas') svgaCanvases!: QueryList<ElementRef>;

  constructor(
    private sidebar: SidebarComponent,
    private apiService: GiftService,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.giftSubscription = this.apiService.gift$.subscribe(() =>
      this.getGifts()
    );
  }

  openDrawer(item: string | null = null) {
    this.sidebar.openDrawer(
      item ? 'Edit gift' : 'Add new gift',
      GiftFormComponent,
      item
    );
  }

  getGifts() {
    this.isLoading = true;
    this.apiService.getGifts().subscribe(
      (resp) => {
        this.gifts = resp.data;
        this.gifts = this.gifts.map((item) => ({
          ...item,
          isSVGA: item.resource.endsWith('.svga'),
        }));
        this.filteredGifts = this.gifts.filter(
          (gift) =>
            true
        );
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  ngAfterViewInit(): void {
    this.svgaCanvases.changes.subscribe((canvases: QueryList<ElementRef>) => {
      if (canvases.length > 0) {
        const svgaItems = this.filteredGifts.filter((gift) => gift.isSVGA);
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
  }

  openDialog(mode: string, gift: any = null) {
    let data: any = {};
    if (mode === 'removeGift') {
      data = {
        giftId: gift._id,
        name: gift.name,
      };
    }
    data.mode = mode;
    const dialogRef = this.dialog.open(GiftDialogComponent, {
      width: '50%',
      disableClose: true,
      data: data,
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
    this.filteredGifts = this.gifts.filter(
      (gift) => gift.itemType === this.selectedCurrentItem
    );
  }

  openFullImage(src: string) {
    window.open(src, '_blank');
  }

  ngOnDestroy(): void {
    this.giftSubscription.unsubscribe();
  }
}
