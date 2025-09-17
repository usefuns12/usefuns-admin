import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { HostService } from '../../services/host.service';
import { ConfirmDeleteComponent } from '../agency/confirm-delete.component';
import { HostFormComponent } from './host-form/host-form.component';

@Component({
  selector: 'app-hosts',
  standalone: true,
  templateUrl: './host.component.html',
  imports: [CommonModule, MatTooltipModule, FontAwesomeModule],
})
export class HostComponent implements OnInit {
  hosts: any[] = [];
  isLoading = false;

  constructor(
    private hostService: HostService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getHosts();
  }

  getHosts(): void {
    this.isLoading = true;
    this.hostService.getHosts().subscribe({
      next: (resp: any) => {
        this.hosts = resp.data || [];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  openDialog(mode: 'add' | 'edit' | 'removeHost', host: any = null): void {
    if (mode === 'removeHost') {
      const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
        width: '350px',
        data: {
          title: 'Delete Host',
          message: 'Are you sure you want to delete this host?',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.hostService.deleteHost(host._id).subscribe({
            next: (resp: any) => {
              this.getHosts();
              this.toastr.success(resp.message);
            },
            error: (err: any) => this.toastr.error(err.message),
          });
        }
      });
      return;
    }

    const dialogRef = this.dialog.open(HostFormComponent, {
      width: '500px',
      disableClose: true,
      data: { mode, host },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.refresh) {
        this.getHosts();
        this.toastr.success(result.message);
      }
    });
  }
}
