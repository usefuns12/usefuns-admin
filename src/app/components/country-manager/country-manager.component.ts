import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { CountryManagerService } from '../../services/country-managers.service';
import { ConfirmDeleteComponent } from './confirm-delete.component';
import { CountryManagerFormComponent } from './country-manager-form/country-manager-form.component';

@Component({
  selector: 'app-country-managers',
  standalone: true,
  templateUrl: './country-manager.component.html',
  imports: [CommonModule, MatTooltipModule, FontAwesomeModule],
})
export class CountryManagerComponent implements OnInit {
  managers: any[] = [];
  isLoading = false;

  constructor(
    private countryManagerService: CountryManagerService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getManagers();
  }

  getManagers(): void {
    this.isLoading = true;
    this.countryManagerService.getCountryManagers().subscribe({
      next: (resp: any) => {
        this.managers = resp.data;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  openDialog(
    mode: 'add' | 'edit' | 'removeManager',
    manager: any = null
  ): void {
    if (mode === 'removeManager') {
      const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
        width: '350px',
        data: {
          title: 'Delete Country Manager',
          message: 'Are you sure you want to delete this manager?',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.countryManagerService
            .deleteCountryManager(manager._id)
            .subscribe({
              next: (resp: any) => {
                this.getManagers();
                this.toastr.success(resp.message);
              },
              error: (err: any) => this.toastr.error(err.message),
            });
        }
      });

      return;
    }

    const dialogRef = this.dialog.open(CountryManagerFormComponent, {
      width: '500px',
      disableClose: true,
      data: { mode, manager },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.refresh) {
        this.getManagers();
        this.toastr.success(result.message);
      }
    });
  }
}
