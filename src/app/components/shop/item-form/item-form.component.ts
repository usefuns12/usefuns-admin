import { Component, Inject, OnInit, signal } from '@angular/core';
import { ShopItemService } from '../../../services/shop-item.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ITEM_TOKEN } from '../../../utils/injector-tokens.token';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ImgCropperComponent } from '../../dialogs/img-cropper/img-cropper.component';
import { ToastrService } from 'ngx-toastr';
import { Downloader, Parser, Player } from 'svga.lite';
import { NgSelectModule } from '@ng-select/ng-select';
import { CountryService } from '../../../services/country.service';
import { DrawerService } from '../../../services/drawer.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-item-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgSelectModule,
  ],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.scss',
})
export class ItemFormComponent implements OnInit {
  itemForm: FormGroup;
  item: any;
  mode: string;
  countries: any[] = [];
  itemTypeOptions = [
    { name: 'Select type', value: 'select' },
    { name: 'Chat Bubble', value: 'chatBubble' },
    { name: 'Extra Seat', value: 'extraSeat' },
    { name: 'Frame', value: 'frame' },
    { name: 'Lock Room', value: 'lockRoom' },
    { name: 'Relationship', value: 'relationship' },
    { name: 'Special Id', value: 'specialId' },
    { name: 'Theme', value: 'theme' },
    { name: 'Vehicle', value: 'vehicle' },
  ];
  resource: string;
  isResourceSVGA = false;
  thumbnail: string;
  private resourceBlob: Blob | null;
  private thumbnailBlob: Blob | null;
  resourceChanged = signal(false);
  thumbnailChanged = signal(false);
  isLoading: boolean = false;
  isCountryReset: boolean = false;
  assist: boolean;
  assistItemForm: FormGroup;
  itemType: string;
  itemId: string;
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
  users: any[] = [];
  items: any[] = [];
  filteredItems: any[] = [];

  constructor(
    @Inject(ITEM_TOKEN) itemToken: any,
    private fb: FormBuilder,
    private apiService: ShopItemService,
    private drawerService: DrawerService,
    private userService: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private countryService: CountryService
  ) {
    this.mode = itemToken.mode;
    this.item = itemToken.item;
    this.assist = itemToken.assist;
    this.itemForm = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      countryCode: new FormControl(null),
      itemType: new FormControl('select'),
      priceAndValidity: this.fb.array([]),
      isOfficial: new FormControl(false),
    });

    if (this.assist) {
      this.assistItemForm = new FormGroup({
        userIds: new FormControl(null, [Validators.required]),
        itemType: new FormControl(null, [Validators.required]),
        item: new FormControl(null, [Validators.required]),
        validTill: new FormControl(null, [Validators.required]),
        isPermanent: new FormControl(null),
      });

      this.assistItemForm.controls['itemType'].valueChanges.subscribe(
        (val: string[]) => {
          this.filteredItems = this.items.filter((item) =>
            val.includes(item.itemType)
          );
        }
      );

      this.assistItemForm.controls['isPermanent'].valueChanges.subscribe(
        (val) => {
          if (val) {
            this.assistItemForm.controls['validTill'].disable({
              onlySelf: true,
            });
          } else {
            this.assistItemForm.controls['validTill'].enable({
              onlySelf: true,
            });
          }
        }
      );
      this.getUsers();
      this.getShopItems();
    }
    this.addItemPricing();
  }

  ngOnInit(): void {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
    });

    if (this.mode === 'edit') {
      this.patchFormValues();
    }
  }

  get itemPricing(): FormArray {
    return this.itemForm.get('priceAndValidity') as FormArray;
  }

  addItemPricing() {
    this.itemPricing.push(
      this.fb.group({
        price: new FormControl(null, [Validators.required]),
        validity: new FormControl(null, [Validators.required]),
      })
    );
  }

  removePricing(index: number) {
    this.itemPricing.removeAt(index);
  }

  patchFormValues() {
    this.itemForm.patchValue({
      name: this.item.name,
      itemType: this.item.itemType,
      countryCode: this.item.countryCode,
      isOfficial: this.item.isOfficial,
    });

    this.resource = this.item.resource;
    this.isResourceSVGA = this.resource.endsWith('.svga');
    if (this.isResourceSVGA) {
      this.showSVGA(this.resource);
    }
    if (this.item.thumbnail) {
      this.thumbnail = this.item.thumbnail;
    }

    this.itemPricing.clear();
    this.item.priceAndValidity.forEach((itemPrice: any, index: number) => {
      this.addItemPricing();
      this.itemPricing
        .at(index)
        .patchValue({ price: itemPrice.price, validity: itemPrice.validity });
    });
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
      this.resource = this.item?.resource;
      document
        .getElementsByClassName('canvas-container')?.[0]
        .firstChild?.remove();
      if (this.item?.isSVGA) {
        this.isResourceSVGA = true;
        this.showSVGA(this.resource);
      } else {
        this.isResourceSVGA = false;
      }
      this.resetResourceFlags();
    } else {
      this.thumbnail = this.item?.thumbnail;
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

  addItem() {
    this.isLoading = true;
    const postData = this.itemForm.value;
    const formData = new FormData();

    formData.append('name', postData.name);
    formData.append('itemType', postData.itemType);
    formData.append('isOfficial', postData.isOfficial);
    postData.priceAndValidity.forEach((item: any, index: number) => {
      formData.append(`priceAndValidity[${index}][price]`, item.price);
      formData.append(`priceAndValidity[${index}][validity]`, item.validity);
    });

    if (postData.countryCode) {
      formData.append('countryCode', postData.countryCode);
    }

    if (this.resource && !this.isResourceSVGA) {
      formData.append('resource', this.resourceBlob as Blob, 'resource');
    } else {
      formData.append('resource', this.resourceBlob as Blob);
    }

    if (this.thumbnail) {
      formData.append('thumbnail', this.thumbnailBlob as Blob, 'thumbnail');
    }

    this.apiService.addtem(formData).subscribe(
      (resp) => {
        this.isLoading = false;
        this.drawerService.updateDrawer();
        this.apiService.updateShopItems();
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
    const currentValues = this.itemForm.value;

    Object.keys(currentValues).forEach((key) => {
      if (currentValues[key] !== this.item[key]) {
        modifiedValues[key] = currentValues[key];
      }
    });

    return modifiedValues;
  }

  updateItem() {
    this.isLoading = true;
    const modifiedValues = this.getModifiedValues();
    const formData = new FormData();

    if (Object.keys(modifiedValues).length) {
      Object.keys(modifiedValues).forEach((key) => {
        formData.append(key, modifiedValues[key]);
      });
    }
    formData.delete('priceAndValidity');

    modifiedValues.priceAndValidity.forEach((item: any, index: number) => {
      formData.append(`priceAndValidity[${index}][price]`, item.price);
      formData.append(`priceAndValidity[${index}][validity]`, item.validity);
    });

    if (this.isCountryReset) {
      formData.delete('countryCode');
      formData.append('isCountryReset', 'true');
    }

    if (this.resourceBlob) {
      formData.append('resource', this.resourceBlob as Blob, 'resource');
    }

    if (this.thumbnailBlob) {
      formData.append('thumbnail', this.thumbnailBlob as Blob, 'thumbnail');
    }

    formData.append('_id', this.item._id);
    this.apiService.updatetItem(formData).subscribe(
      (resp) => {
        this.isLoading = this.isCountryReset = false;
        this.drawerService.updateDrawer();
        this.apiService.updateShopItems();
        this.toastr.success(resp.message);
      },
      (err) => {
        this.isLoading = false;
        this.toastr.error(err);
      }
    );
  }

  /****** Items assist Module ******/
  getUsers() {
    this.userService.getUsers().subscribe(
      (resp) => {
        this.users = resp.data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getShopItems() {
    this.apiService.getItems().subscribe(
      (resp) => {
        this.items = resp.data;
      },
      (err) => {}
    );
  }

  assistItem() {
    this.isLoading = true;
    const formData = this.assistItemForm.value;
    const items = formData.item.map((item: any) => {
      return {
        _id: item._id,
        name: item.name,
        resource: item.resource,
        thumbnail: item.thumbnail,
        itemType: item.itemType,
        validTill: formData.isPermanent
          ? null
          : this.getExpirationTime(formData.validTill),
        isOfficial: item.isOfficial,
        isDefault: item.isDefault,
      };
    });

    const payload = {
      userIds: formData.userIds,
      items,
    };

    this.userService.assistItems(payload).subscribe(
      (resp) => {
        this.isLoading = false;
        this.drawerService.updateDrawer();
        this.toastr.success(resp.message);
      },
      (err) => {
        this.isLoading = false;
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
}
