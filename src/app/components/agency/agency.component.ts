import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { AgencyService } from '../../services/agency.service';
import { ConfirmDeleteComponent } from '../agency/confirm-delete.component';
import { AgencyFormComponent } from './agency-form/agency-form.component';

@Component({
  selector: 'app-agencies',
  standalone: true,
  templateUrl: './agency.component.html',
  imports: [CommonModule, MatTooltipModule, FontAwesomeModule],
})
export class AgencyComponent implements OnInit {
  agencies: any[] = [];
  isLoading = false;

  constructor(
    private agencyService: AgencyService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAgencies();
  }

  getAgencies(): void {
    this.isLoading = true;
    this.agencyService.getAgencies().subscribe({
      next: (resp: any) => {
        this.agencies = resp.data || [];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  openDialog(mode: 'add' | 'edit' | 'removeAgency', agency: any = null): void {
    if (mode === 'removeAgency') {
      const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
        width: '350px',
        data: {
          title: 'Delete Agency',
          message: 'Are you sure you want to delete this agency?',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.agencyService.deleteAgency(agency._id).subscribe({
            next: (resp: any) => {
              this.getAgencies();
              this.toastr.success(resp.message);
            },
            error: (err: any) => this.toastr.error(err.message),
          });
        }
      });
      return;
    }

    const dialogRef = this.dialog.open(AgencyFormComponent, {
      width: '500px',
      disableClose: true,
      data: { mode, agency },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.refresh) {
        this.getAgencies();
        this.toastr.success(result.message);
      }
    });
  }
}
