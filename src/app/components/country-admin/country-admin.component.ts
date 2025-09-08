import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { CountryAdminService } from '../../services/country-admin.service';
import { ConfirmDeleteComponent } from './confirm-delete.component';
import { CountryAdminFormComponent } from './country-admin-form/country-admin-form.component';

@Component({
  selector: 'app-country-admins',
  standalone: true,
  templateUrl: './country-admin.component.html',
  imports: [CommonModule, MatTooltipModule, FontAwesomeModule],
})
export class CountryAdminComponent implements OnInit {
  admins: any[] = [];
  isLoading = false;

  constructor(
    private countryAdminService: CountryAdminService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAdmins();
  }

  getAdmins(): void {
    this.isLoading = true;
    this.countryAdminService.getCountryAdmins().subscribe({
      next: (resp) => {
        this.admins = resp.data;
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
          title: 'Delete Country Admin',
          message: 'Are you sure you want to delete this admin?',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.countryAdminService.deleteCountryAdmin(admin._id).subscribe({
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

    const dialogRef = this.dialog.open(CountryAdminFormComponent, {
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
