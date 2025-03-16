import { Component, Inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CAROUSEL_TOKEN } from '../../../utils/injector-tokens.token';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ImgCropperComponent } from '../../dialogs/img-cropper/img-cropper.component';
import { ToastrService } from 'ngx-toastr';
import { DrawerService } from '../../../services/drawer.service';
import { CarouselService } from '../../../services/carousel.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CountryService } from '../../../services/country.service';

@Component({
  selector: 'app-carousel-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgSelectModule,
  ],
  templateUrl: './carousel-form.component.html',
  styleUrl: './carousel-form.component.scss',
})
export class CarouselFormComponent implements OnInit {
  carouselForm: FormGroup;
  carousel: any;
  countries: any[] = [];
  mode: string;
  cImage: string;
  private cImageBlob: Blob | null;
  cImageChanged = signal(false);
  isLoading: boolean = false;
  isCountryReset: boolean = false;

  constructor(
    @Inject(CAROUSEL_TOKEN) carouselToken: any,
    private fb: FormBuilder,
    private apiService: CarouselService,
    private drawerService: DrawerService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private countryService: CountryService
  ) {
    this.mode = carouselToken.mode;
    this.carousel = carouselToken.carousel;
    this.carouselForm = this.fb.group({
      actionLink: new FormControl(null),
      countryCode: new FormControl(null),
      isActive: new FormControl(true),
    });
  }

  ngOnInit(): void {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
    });

    if (this.mode === 'edit') {
      this.patchFormValues();
    }
  }

  patchFormValues() {
    this.carouselForm.patchValue({
      actionLink: this.carousel.actionLink,
      countryCode: this.carousel.countryCode,
      isActive: this.carousel.isActive,
    });

    this.cImage = this.carousel.carouselImage;
  }

  openImageDialog() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept =
      'image/png, image/jpeg, image/jpg, image/svg+xml, image/gif';

    fileInput.multiple = false;
    fileInput.onchange = ($event) => {
      const target = $event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];

        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result as string;
          const dialogRef = this.dialog.open(ImgCropperComponent, {
            width: '60%',
            disableClose: true,
            data: { imageEvent: base64Image, imgType: null },
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.cImage = result.croppedImage.objectUrl;
              this.cImageBlob = result.croppedImage.blob;
              this.cImageChanged.set(true);
            }
          });
        };

        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
  }

  restoreImage() {
    this.cImage = this.carousel?.carouselImage;
    this.resetImageFlags();
  }

  resetImageFlags() {
    this.cImageBlob = null;
    this.cImageChanged.set(false);
  }

  addCarousel() {
    this.isLoading = true;
    const postData = this.carouselForm.value;
    const formData = new FormData();

    formData.append('isOfficial', postData.isOfficial);
    if (postData.countryCode) {
      formData.append('countryCode', postData.countryCode);
    }

    if (postData.actionLink) {
      formData.append('actionLink', postData.actionLink);
    }

    if (this.cImage) {
      formData.append('file', this.cImageBlob as Blob, 'carousel');
    }

    this.apiService.addCarousel(formData).subscribe(
      (resp) => {
        this.isLoading = false;
        this.drawerService.updateDrawer();
        this.apiService.updateCarousels();
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
    const currentValues = this.carouselForm.value;

    Object.keys(currentValues).forEach((key) => {
      if (currentValues[key] !== this.carousel[key]) {
        modifiedValues[key] = currentValues[key];
      }
    });

    return modifiedValues;
  }

  updateCarousel() {
    this.isLoading = true;
    const modifiedValues = this.getModifiedValues();
    const formData = new FormData();

    if (Object.keys(modifiedValues).length) {
      Object.keys(modifiedValues).forEach((key) => {
        formData.append(key, modifiedValues[key]);
      });
    }

    if (this.isCountryReset) {
      formData.delete('countryCode');
      formData.append('isCountryReset', 'true');
    }

    if (this.cImageBlob) {
      formData.append('file', this.cImageBlob as Blob, 'carousel');
    }

    formData.append('_id', this.carousel._id);
    this.apiService.updateCarousel(formData).subscribe(
      (resp) => {
        this.isLoading = this.isCountryReset = false;
        this.drawerService.updateDrawer();
        this.apiService.updateCarousels();
        this.toastr.success(resp.message);
      },
      (err) => {
        this.isLoading = false;
        this.toastr.error(err);
      }
    );
  }
}
