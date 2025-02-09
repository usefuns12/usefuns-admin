import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from '../../../services/user.service';
import { USER_ID_TOKEN } from '../../../utils/injector-tokens.token';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TimeLeftPipe } from '../../../pipes/time-left.pipe';
import moment from 'moment';
import { NgSelectModule } from '@ng-select/ng-select';
import { CountryService } from '../../../services/country.service';
import { MatDialog } from '@angular/material/dialog';
import { ImgCropperComponent } from '../../dialogs/img-cropper/img-cropper.component';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    MatTabsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    FontAwesomeModule,
    TimeLeftPipe,
    NgSelectModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  mode: string = 'view';
  userDetails: any;
  userId: string;
  isLoading: boolean;
  countries: any[] = [];
  currentIndex = signal(0);
  private originalProfileImage: string;
  private originalRoomImage: string;
  private profileBlob: Blob | null;
  private roomBlob: Blob | null;
  profileChanged = signal(false);
  roomChanged = signal(false);
  userFormSubscription: Subscription;
  loader = signal(false);

  constructor(
    @Inject(USER_ID_TOKEN) user: any,
    private fb: FormBuilder,
    private apiService: UserService,
    private countryService: CountryService,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {
    this.userId = user.userId;
    this.mode = user.mode;
    this.userForm = this.fb.group({
      name: new FormControl(null),
      userId: new FormControl({ value: null, disabled: true }),
      email: new FormControl({ value: null, disabled: true }),
      countryCode: new FormControl(null),
      mobile: new FormControl({ value: null, disabled: true }),
      gender: new FormControl({ value: null, disabled: true }),
      bio: new FormControl(null),
      followers: new FormControl({ value: null, disabled: true }),
      following: new FormControl({ value: null, disabled: true }),
      level: new FormControl(null),
      userRole: new FormControl(null),
      beans: new FormControl(null),
      diamonds: new FormControl(null),
      isActiveUser: new FormControl(null),
      roomName: new FormControl(null),
      announcement: new FormControl(null),
      hostingTime: new FormControl({ value: null, disabled: true }),
      isCommentRestricted: new FormControl(false),
    });
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
    });

    this.userFormSubscription = this.apiService.userForm$.subscribe(() => {
      this.updateUser();
    });
  }

  setIndex(index: number) {
    this.currentIndex.set(index);
  }

  getUserDetails() {
    this.isLoading = true;
    this.apiService.getUserDetails(this.userId).subscribe(
      (resp) => {
        this.userDetails = resp.data;
        this.patchFormValues();
        this.isLoading = false;
      },
      (err) => {}
    );
  }

  patchFormValues() {
    this.userForm.patchValue({
      name: this.userDetails.name,
      userId: this.userDetails.userId,
      email: this.userDetails.email,
      countryCode: this.userDetails.countryCode,
      mobile: this.userDetails.mobile,
      gender: this.userDetails.gender,
      bio: this.userDetails.bio,
      followers: this.userDetails.followers.length,
      following: this.userDetails.following.length,
      level: this.userDetails.level,
      userRole: 'User',
      beans: this.userDetails.beans,
      diamonds: this.userDetails.diamonds,
      isActiveUser: this.userDetails.isActiveUser,
      roomName: this.userDetails.roomDetails?.name,
      announcement: this.userDetails.roomDetails?.announcement,
      hostingTime: this.getFormatedTime(
        this.userDetails.roomDetails?.hostingTimeCurrentSession
      ),
      isCommentRestricted: this.userDetails.isCommentRestricted,
    });

    if (this.mode !== 'edit') {
      this.userForm.disable();
    }

    this.originalProfileImage = this.userDetails.profileImage;
    this.originalRoomImage = this.userDetails?.roomDetails?.roomImage;
  }

  getFormatedTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds} sec${seconds !== 1 ? 's' : ''}`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    } else {
      const duration = moment.duration(seconds, 'seconds');
      const hours = duration.hours();
      const minutes = duration.minutes();

      let result = `${hours} hr${hours !== 1 ? 's' : ''}`;
      if (minutes > 0) {
        result += ` ${minutes} min${minutes !== 1 ? 's' : ''}`;
      }
      return result;
    }
  }

  openImageDialog(type: string) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/png, image/jpeg, image/jpg';
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
            data: { imageEvent: base64Image, imgType: type },
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              console.log(result.croppedImage);
              if (result.imgType === 'profile') {
                this.userDetails.profileImage = result.croppedImage.objectUrl;
                this.profileBlob = result.croppedImage.blob;
                this.profileChanged.set(true);
              } else {
                this.userDetails.roomDetails.roomImage =
                  result.croppedImage.objectUrl;
                this.roomBlob = result.croppedImage.blob;
                this.roomChanged.set(true);
              }
            }
          });
        };

        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
  }

  restoreImage(type: string) {
    if (type === 'profile') {
      this.userDetails.profileImage = this.originalProfileImage;
      this.resetProfileFlags();
    } else {
      this.userDetails.roomDetails.roomImage = this.originalRoomImage;
      this.resetRoomFlags();
    }
  }

  resetProfileFlags() {
    this.profileBlob = null;
    this.profileChanged.set(false);
  }

  resetRoomFlags() {
    this.roomBlob = null;
    this.roomChanged.set(false);
  }

  updateProfile(type: string) {
    const formData = new FormData();
    if (type === 'profile') {
      formData.append('file', this.profileBlob as Blob, 'profile');
      this.loader.set(true);
      this.callUserAPI(this.userDetails._id, formData);
    } else {
      formData.append('file', this.roomBlob as Blob, 'roomProfile');
      this.loader.set(true);
      this.callRoomAPI(this.userDetails.roomDetails._id, formData);
    }
  }

  getModifiedValues(): any {
    const modifiedValues: any = {};
    const modifiedRoomValues: any = {};
    const currentValues = this.userForm.value;
    const excludeKeys = ['roomName', 'announcement', 'userRole'];

    Object.keys(currentValues).forEach((key) => {
      if (
        !excludeKeys.includes(key) &&
        currentValues[key] !== this.userDetails[key]
      ) {
        modifiedValues[key] = currentValues[key];
      }
    });

    if (currentValues.roomName !== this.userDetails.roomDetails?.name) {
      modifiedRoomValues.roomName = this.userForm.value.roomName;
    }
    if (
      currentValues.announcement !== this.userDetails.roomDetails?.announcement
    ) {
      modifiedRoomValues.announcement = this.userForm.value.announcement;
    }

    return { modifiedValues, modifiedRoomValues };
  }

  updateUser() {
    const { modifiedValues, modifiedRoomValues } = this.getModifiedValues();
    const formData = new FormData();
    const roomFormData = new FormData();

    if (
      !Object.keys(modifiedValues).length &&
      !Object.keys(modifiedRoomValues).length
    ) {
      this.toastrService.error('No changes detected.');
      return;
    }

    if (Object.keys(modifiedValues).length) {
      Object.keys(modifiedValues).forEach((key) => {
        formData.append(key, modifiedValues[key]);
      });

      this.apiService.loader.set(true);
      this.callUserAPI(this.userDetails._id, formData);
    }

    // update room
    if (Object.keys(modifiedRoomValues).length) {
      Object.keys(modifiedRoomValues).forEach((key) => {
        roomFormData.append(key, modifiedRoomValues[key]);
      });

      this.apiService.loader.set(true);
      this.callRoomAPI(this.userDetails.roomDetails._id, roomFormData);
    }
  }

  callUserAPI(userId: string, formData: FormData) {
    this.apiService.updateUser(userId, formData).subscribe(
      (resp) => {
        this.toastrService.success(resp.message);
        this.apiService.loader.set(false);
        if (this.loader()) {
          this.loader.set(false);
          this.resetProfileFlags();
          this.originalProfileImage = this.userDetails.profileImage;
        }
      },
      (err) => {
        console.error(err);
        this.toastrService.error(err);
        this.apiService.loader.set(false);
        this.loader() && this.loader.set(false);
      }
    );
  }

  callRoomAPI(roomId: string, formData: FormData) {
    this.apiService.updateUserRoom(roomId, formData).subscribe(
      (resp) => {
        this.apiService.loader.set(false);
        if (this.loader()) {
          this.loader.set(false);
          this.resetRoomFlags();
          this.originalRoomImage = this.userDetails.roomDetails.roomImage;
        }
      },
      (err) => {
        console.error(err);
        this.toastrService.error(err);
        this.apiService.loader.set(false);
        this.loader() && this.loader.set(false);
      }
    );
  }

  ngOnDestroy(): void {
    this.userFormSubscription.unsubscribe();
  }
}
