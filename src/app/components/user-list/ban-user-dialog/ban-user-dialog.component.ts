import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-ban-user-dialog',
  imports: [MatDialogModule, CommonModule],
  templateUrl: './ban-user-dialog.component.html',
  styleUrl: './ban-user-dialog.component.scss',
})
export class BanUserDialogComponent {
  userId: string;
  isActiveUser: boolean;
  isActiveDevice: boolean;
  isDevice: boolean;
  name: string;
  uid: number;
  loader = signal(false);

  constructor(
    public dialogRef: MatDialogRef<BanUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: UserService
  ) {
    this.userId = data.userId;
    this.isActiveUser = data.isActiveUser;
    this.isActiveDevice = data.isActiveDevice;
    this.name = data.name;
    this.uid = data.uid;
    this.isDevice = data.isDevice;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  updateUser(): void {
    this.loader.set(true);
    const formData = new FormData();
    formData.append('isActiveUser', (!this.isActiveUser).toString());
    this.apiService.updateUser(this.userId, formData).subscribe(
      (resp) => {
        this.loader.set(false);
        this.dialogRef.close({ success: true, message: resp.message });
      },
      (err) => {
        console.error(err);
        this.loader.set(false);
        this.dialogRef.close({ success: false, message: err });
      }
    );
  }

  banDevice() {
    this.loader.set(true);
    const payload = {
      isActiveDevice: !this.isActiveDevice,
    };

    this.apiService.banDevice(this.userId, payload).subscribe(
      (resp) => {
        this.loader.set(false);
        this.dialogRef.close({ success: true, message: resp.message });
      },
      (err) => {
        console.error(err);
        this.loader.set(false);
        this.dialogRef.close({ success: false, message: err });
      }
    );
  }
}
