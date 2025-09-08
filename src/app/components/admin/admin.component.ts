import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../services/admin.service';
import { ConfirmDeleteComponent } from '../admin/confirm-delete.component';
import { AdminFormComponent } from './admin-form/admin-form.component';

@Component({
  selector: 'app-admins',
  standalone: true,
  templateUrl: './admin.component.html',
  imports: [CommonModule, MatTooltipModule, FontAwesomeModule],
})
export class AdminComponent implements OnInit {
  admins: any[] = [];
  isLoading = false;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAdmins();
  }

  getAdmins(): void {
    this.isLoading = true;
    this.adminService.getAdmin().subscribe({
      next: (resp: any) => {
        this.admins = resp.data || [];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  openDialog(mode: 'add' | 'edit' | 'removeAdmin', admin: any = null): void {
    if (mode === 'removeAdmin') {
      const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
        width: '350px',
        data: {
          title: 'Delete Admin',
          message: 'Are you sure you want to delete this admin?',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.adminService.deleteAdmin(admin._id).subscribe({
            next: (resp: any) => {
              this.getAdmins();
              this.toastr.success(resp.message);
            },
            error: (err: any) => this.toastr.error(err.message),
          });
        }
      });
      return;
    }

    const dialogRef = this.dialog.open(AdminFormComponent, {
      width: '500px',
      disableClose: true,
      data: { mode, admin },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.refresh) {
        this.getAdmins();
        this.toastr.success(result.message);
      }
    });
  }
}
