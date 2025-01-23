import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from '../../../services/user.service';
import { USER_ID_TOKEN } from '../user.token';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-user-form',
  imports: [MatTabsModule, ReactiveFormsModule, NgxSkeletonLoaderModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  userDetails: any;
  userId: string;
  isLoading: boolean;

  constructor(
    @Inject(USER_ID_TOKEN) userId: string,
    private apiService: UserService
  ) {
    this.userId = userId;
    this.userForm = new FormGroup({
      name: new FormControl(null),
      userId: new FormControl({ value: null, disabled: true }),
      email: new FormControl(null),
      mobile: new FormControl(null),
      gender: new FormControl(null),
      bio: new FormControl(null),
      followers: new FormControl(null),
      following: new FormControl(null),
      level: new FormControl(null),
      userRole: new FormControl(null),
      beans: new FormControl(null),
      diamonds: new FormControl(null),
      isActiveUser: new FormControl(null),
      roomName: new FormControl(null),
      announcement: new FormControl(null),
      hostingTime: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.getUserDetails();
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
      mobile: this.userDetails.mobile,
      gender: this.userDetails.gender,
      bio: this.userDetails.bio,
      followers: this.userDetails.followers.length,
      following: this.userDetails.following.length,
      level: this.userDetails.level,
      userRole: 'Usefuns',
      beans: this.userDetails.beans,
      diamonds: this.userDetails.diamonds,
      isActiveUser: this.userDetails.isActiveUser + '',
      roomName: this.userDetails.roomDetails?.name,
      announcement: this.userDetails.roomDetails?.announcement,
      hostingTime: this.userDetails.roomDetails?.hostingTimeCurrentSession,
    });

    this.userForm.disable();
  }
}
