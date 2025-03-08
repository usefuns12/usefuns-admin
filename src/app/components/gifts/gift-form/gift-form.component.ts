import { Component, Inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GIFT_TOKEN } from '../../../utils/injector-tokens.token';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ImgCropperComponent } from '../../dialogs/img-cropper/img-cropper.component';
import { ToastrService } from 'ngx-toastr';
import { Downloader, Parser, Player } from 'svga.lite';
import { NgSelectModule } from '@ng-select/ng-select';
import { CountryService } from '../../../services/country.service';
import { GiftService } from '../../../services/gift.service';
import { DrawerService } from '../../../services/drawer.service';

@Component({
  selector: 'app-gift-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgSelectModule,
  ],
  templateUrl: './gift-form.component.html',
  styleUrl: './gift-form.component.scss',
})
export class GiftFormComponent {
  giftForm: FormGroup;
  gift: any;
  mode: string;
  countries: any[] = [];
  categories: any[] = [];
  resource: string;
  isResourceSVGA = false;
  thumbnail: string;
  private resourceBlob: Blob | null;
  private thumbnailBlob: Blob | null;
  resourceChanged = signal(false);
  thumbnailChanged = signal(false);
  isLoading: boolean = false;

  constructor(
    @Inject(GIFT_TOKEN) giftToken: any,
    private fb: FormBuilder,
    private apiService: GiftService,
    private drawerService: DrawerService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private countryService: CountryService
  ) {
    this.mode = giftToken.mode;
    this.gift = giftToken.gift;
    this.giftForm = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      countryCode: new FormControl(null),
      categoryId: new FormControl(null, [Validators.required]),
      diamonds: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
    });

    this.apiService.getCategories().subscribe((resp) => {
      this.categories = resp.data;

      if (this.mode === 'edit') {
        this.patchFormValues();
      }
    });
  }


  patchFormValues() {
    this.giftForm.patchValue({
      name: this.gift.name,
      categoryId: this.gift.category._id,
      countryCode: this.gift.countryCode,
      diamonds: this.gift.diamonds
    });

    this.resource = this.gift.resource;
    this.isResourceSVGA = this.resource.endsWith('.svga');
    if (this.isResourceSVGA) {
      this.showSVGA(this.resource);
    }
    if (this.gift.thumbnail) {
      this.thumbnail = this.gift.thumbnail;
    }
  }

  openImageDialog(type: string) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept =
      'image/png, image/jpeg, image/jpg, image/svg+xml, image/gif, image/svga';

    fileInput.multiple = false;
    fileInput.onchange = ($event) => {
      const target = $event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const fileType = file.type;
        const fileName = file.name.toLowerCase();
        const isSvga = fileName.endsWith('.svga');
        if (type === 'thumbnail' && (fileType === 'image/gif' || isSvga)) {
          this.toastr.error(
            'Invalid file type! Only PNG, JPEG, JPG, and SVG are allowed for thumbnails.'
          );
          return;
        }

        if (fileType === 'image/gif' || isSvga) {
          this.resource = URL.createObjectURL(file);
          if (isSvga) {
            this.isResourceSVGA = true;
            this.showSVGA(this.resource);
          }
          this.resourceBlob = file;
          this.resourceChanged.set(true);
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result as string;
          const dialogRef = this.dialog.open(ImgCropperComponent, {
            width: '60%',
            disableClose: true,
            data: { imageEvent: base64Image, imgType: type },
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              if (result.imgType === 'resource') {
                this.isResourceSVGA = false;
                document
                  .getElementsByClassName('canvas-container')?.[0]
                  .firstChild?.remove();
                this.resource = result.croppedImage.objectUrl;
                this.resourceBlob = result.croppedImage.blob;
                this.resourceChanged.set(true);
              } else {
                this.thumbnail = result.croppedImage.objectUrl;
                this.thumbnailBlob = result.croppedImage.blob;
                this.thumbnailChanged.set(true);
              }
            }
          });
        };

        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
  }

  async showSVGA(resourceUrl: string) {
    const canvasContainer =
      document.getElementsByClassName('canvas-container')?.[0];
    const canvas = document.createElement('canvas');
    canvas.setAttribute('style', 'width: 150px; margin-bottom: 16px');
    canvasContainer.append(canvas);
    const downloader = new Downloader();
    const parser = new Parser();
    const player = new Player(canvas);
    const fileData = await downloader.get(resourceUrl);
    const svgaData = await parser.do(fileData);
    player.set({
      loop: true,
      cacheFrames: false,
      intersectionObserverRender: false,
    });

    await player.mount(svgaData);
    player.start();
  }

  restoreImage(type: string) {
    if (type === 'resource') {
      this.resource = this.gift?.resource;
      document
        .getElementsByClassName('canvas-container')?.[0]
        .firstChild?.remove();
      if (this.gift?.isSVGA) {
        this.isResourceSVGA = true;
        this.showSVGA(this.resource);
      } else {
        this.isResourceSVGA = false;
      }
      this.resetResourceFlags();
    } else {
      this.thumbnail = this.gift?.thumbnail;
      this.resetThumbnailFlags();
    }
  }

  resetResourceFlags() {
    this.resourceBlob = null;
    this.resourceChanged.set(false);
  }

  resetThumbnailFlags() {
    this.thumbnailBlob = null;
    this.thumbnailChanged.set(false);
  }

  addGift() {
    this.isLoading = true;
    const postData = this.giftForm.value;
    const formData = new FormData();

    formData.append('name', postData.name);
    formData.append('categoryId', postData.categoryId);
    formData.append('diamonds', postData.diamonds);
    formData.append('countryCode', postData.countryCode);


    if (this.resource && !this.isResourceSVGA) {
      formData.append('resource', this.resourceBlob as Blob, 'resource');
    } else {
      formData.append('resource', this.resourceBlob as Blob);
    }

    if (this.thumbnail) {
      formData.append('thumbnail', this.thumbnailBlob as Blob, 'thumbnail');
    }

    this.apiService.addGift(formData).subscribe(
      (resp) => {
        this.isLoading = false;
        this.drawerService.updateDrawer();
        this.apiService.updateGifts();
        this.toastr.success(resp.message);
      },
      (err) => {
        console.error(err);
        this.isLoading = false;
        this.toastr.error(err);
      }
    );
  }

  getModifiedValues(): any {
    const modifiedValues: any = {};
    const currentValues = this.giftForm.value;

    Object.keys(currentValues).forEach((key) => {
      if (currentValues[key] !== this.gift[key]) {
        modifiedValues[key] = currentValues[key];
      }
    });

    return modifiedValues;
  }

  updateGift() {
    this.isLoading = true;
    const modifiedValues = this.getModifiedValues();
    const formData = new FormData();

    if (Object.keys(modifiedValues).length) {
      Object.keys(modifiedValues).forEach((key) => {
        formData.append(key, modifiedValues[key]);
      });
    }

    if (this.resourceBlob) {
      formData.append('resource', this.resourceBlob as Blob, 'resource');
    }

    if (this.thumbnailBlob) {
      formData.append('thumbnail', this.thumbnailBlob as Blob, 'thumbnail');
    }

    formData.append('_id', this.gift._id);
    this.apiService.updateGift(formData).subscribe(
      (resp) => {
        this.isLoading = false;
        this.drawerService.updateDrawer();
        this.apiService.updateGifts();
        this.toastr.success(resp.message);
      },
      (err) => {
        this.isLoading = false;
        this.toastr.error(err);
      }
    );
  }
}
