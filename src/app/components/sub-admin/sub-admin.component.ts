import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { SubAdminService } from '../../services/subadmin.service';
import { ConfirmDeleteComponent } from '../sub-admin/confirm-delete.component';
import { SubAdminFormComponent } from './sub-admin-form/sub-admin-form.component';

@Component({
  selector: 'app-sub-admins',
  standalone: true,
  templateUrl: './sub-admin.component.html',
  imports: [CommonModule, MatTooltipModule, FontAwesomeModule],
})
export class SubAdminComponent implements OnInit {
  subAdmins: any[] = [];
  isLoading = false;

  constructor(
    private subAdminService: SubAdminService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getSubAdmins();
  }

  getSubAdmins(): void {
    this.isLoading = true;
    this.subAdminService.getSubAdmin().subscribe({
      next: (resp: any) => {
        this.subAdmins = resp.data || [];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  openDialog(
    mode: 'add' | 'edit' | 'removeSubAdmin',
    subAdmin: any = null
  ): void {
    if (mode === 'removeSubAdmin') {
      const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
        width: '350px',
        data: {
          title: 'Delete Sub Admin',
          message: 'Are you sure you want to delete this sub admin?',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.subAdminService.deleteSubAdmin(subAdmin._id).subscribe({
            next: (resp: any) => {
              this.getSubAdmins();
              this.toastr.success(resp.message);
            },
            error: (err: any) => this.toastr.error(err.message),
          });
        }
      });
      return;
    }

    const dialogRef = this.dialog.open(SubAdminFormComponent, {
      width: '500px',
      disableClose: true,
      data: { mode, subAdmin },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.refresh) {
        this.getSubAdmins();
        this.toastr.success(result.message);
      }
    });
  }
}
