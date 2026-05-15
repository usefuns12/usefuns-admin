import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SalaryService } from '../../services/salary.service';
import { ConfirmDeleteComponent } from '../admin/confirm-delete.component';

@Component({
  selector: 'app-salary',
  standalone: true,
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss'],
  imports: [CommonModule],
})
export class SalaryComponent implements OnInit {
  activeTab: 'cycles' | 'commissions' = 'cycles';
  salaryCycles: any[] = [];
  agencyCommissions: any[] = [];
  cycleStats: any = {};
  commissionStats: any = {};
  isLoading = false;

  constructor(
    private salaryService: SalaryService,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.salaryService.salaryRefresh$.subscribe(() => {
      this.loadData();
    });
  }

  loadData(): void {
    this.isLoading = true;
    this.getSalaryCycles();
    this.getSalaryCycleStats();
    this.getAgencyCommissions();
    this.getCommissionStats();
  }

  getSalaryCycles(): void {
    this.salaryService.getSalaryCycles().subscribe({
      next: (resp: any) => {
        this.salaryCycles = resp.data?.cycles || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error(err.error?.message || 'Failed to load salary cycles');
        this.isLoading = false;
      },
    });
  }

  getSalaryCycleStats(): void {
    this.salaryService.getSalaryCycleStats().subscribe({
      next: (resp: any) => {
        this.cycleStats = resp.data?.overall || {};
      },
      error: () => {},
    });
  }

  getAgencyCommissions(): void {
    this.salaryService.getAgencyCommissions().subscribe({
      next: (resp: any) => {
        this.agencyCommissions = resp.data?.cycles || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error(err.error?.message || 'Failed to load commissions');
        this.isLoading = false;
      },
    });
  }

  getCommissionStats(): void {
    this.salaryService.getCommissionStats().subscribe({
      next: (resp: any) => {
        this.commissionStats = resp.data || {};
      },
      error: () => {},
    });
  }

  handleRecalculate(cycle: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '350px',
      data: {
        title: 'Recalculate Salary Cycle?',
        message: 'Are you sure you want to recalculate this salary cycle?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.salaryService.recalculateSalaryCycle(cycle._id).subscribe({
          next: (resp: any) => {
            this.loadData();
            this.toastr.success(resp.message || 'Salary cycle recalculated');
          },
          error: (err: any) =>
            this.toastr.error(err.error?.message || 'Failed to recalculate'),
        });
      }
    });
  }

  handleHold(cycle: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '350px',
      data: {
        title: 'Hold Salary Cycle?',
        message: 'Are you sure you want to hold this salary cycle?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.salaryService.holdSalaryCycle(cycle._id).subscribe({
          next: (resp: any) => {
            this.loadData();
            this.toastr.success(resp.message || 'Salary cycle held');
          },
          error: (err: any) =>
            this.toastr.error(err.error?.message || 'Failed to hold'),
        });
      }
    });
  }

  handleRelease(cycle: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '350px',
      data: {
        title: 'Release Salary Cycle?',
        message: 'Are you sure you want to release this salary cycle?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.salaryService.releaseSalaryCycle(cycle._id).subscribe({
          next: (resp: any) => {
            this.loadData();
            this.toastr.success(resp.message || 'Salary cycle released');
          },
          error: (err: any) =>
            this.toastr.error(err.error?.message || 'Failed to release'),
        });
      }
    });
  }

  handleForcePayout(cycle: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {
        title: 'Force Payout?',
        message:
          'Are you sure you want to force payout for this cycle? This action is critical!',
        buttonText: 'Confirm',
        buttonClass: 'btn-primary',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.salaryService.forcePayoutCycle(cycle._id).subscribe({
          next: (resp: any) => {
            this.loadData();
            this.toastr.success(resp.message || 'Payout forced');
          },
          error: (err: any) =>
            this.toastr.error(err.error?.message || 'Failed to force payout'),
        });
      }
    });
  }

  handleReverse(cycle: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
      data: {
        title: 'Reverse Payment?',
        message:
          'Are you sure you want to reverse payment for this cycle? This action cannot be undone!',
        buttonText: 'Reverse',
        buttonClass: 'btn-danger',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.salaryService.reversePayment(cycle._id).subscribe({
          next: (resp: any) => {
            this.loadData();
            this.toastr.success(resp.message || 'Payment reversed');
          },
          error: (err: any) =>
            this.toastr.error(err.error?.message || 'Failed to reverse'),
        });
      }
    });
  }

  handleUnlock(commission: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '350px',
      data: {
        title: 'Unlock Funds?',
        message: 'Are you sure you want to unlock these funds?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.salaryService.unlockFunds(commission._id).subscribe({
          next: (resp: any) => {
            this.loadData();
            this.toastr.success(resp.message || 'Funds unlocked');
          },
          error: (err: any) =>
            this.toastr.error(err.error?.message || 'Failed to unlock'),
        });
      }
    });
  }
}
