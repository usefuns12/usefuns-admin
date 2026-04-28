import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { AdminSalaryService } from '../../../services/admin-salary.service';

@Component({
  selector: 'app-salary-cycle-detail',
  standalone: true,
  templateUrl: './salary-cycle-detail.component.html',
  styleUrls: ['./salary-cycle-detail.component.scss'],
  imports: [CommonModule, FormsModule, FontAwesomeModule],
})
export class SalaryCycleDetailComponent implements OnInit {
  cycle: any = null;
  isLoading = false;

  // Action modals
  showRecalculateModal = false;
  showHoldModal = false;
  showForcePayoutModal = false;
  showReverseModal = false;

  // Action forms
  recalculateForm = {
    reason: '',
    diamondAdjustment: 0,
    hourAdjustment: 0,
  };

  actionReason = '';

  constructor(
    private adminSalaryService: AdminSalaryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCycleDetails(id);
    }
  }

  loadCycleDetails(id: string): void {
    this.isLoading = true;
    this.adminSalaryService.getSalaryCycleById(id).subscribe({
      next: (resp: any) => {
        this.cycle = resp.data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error(err.error?.message || 'Failed to load cycle details');
        this.isLoading = false;
        this.router.navigate(['/admin-salary']);
      },
    });
  }

  // Action Methods
  openRecalculateModal(): void {
    this.recalculateForm = {
      reason: '',
      diamondAdjustment: 0,
      hourAdjustment: 0,
    };
    this.showRecalculateModal = true;
  }

  recalculate(): void {
    if (!this.recalculateForm.reason) {
      this.toastr.warning('Please provide a reason for recalculation');
      return;
    }

    this.adminSalaryService
      .recalculateSalaryCycle(this.cycle._id, this.recalculateForm)
      .subscribe({
        next: (resp: any) => {
          this.toastr.success('Salary cycle recalculated successfully');
          this.showRecalculateModal = false;
          this.loadCycleDetails(this.cycle._id);
        },
        error: (err: any) => {
          this.toastr.error(
            err.error?.message || 'Failed to recalculate cycle'
          );
        },
      });
  }

  openHoldModal(): void {
    this.actionReason = '';
    this.showHoldModal = true;
  }

  holdCycle(): void {
    if (!this.actionReason) {
      this.toastr.warning('Please provide a reason for holding');
      return;
    }

    this.adminSalaryService
      .holdSalaryCycle(this.cycle._id, this.actionReason)
      .subscribe({
        next: (resp: any) => {
          this.toastr.success('Salary cycle held successfully');
          this.showHoldModal = false;
          this.loadCycleDetails(this.cycle._id);
        },
        error: (err: any) => {
          this.toastr.error(err.error?.message || 'Failed to hold cycle');
        },
      });
  }

  releaseCycle(): void {
    if (confirm('Are you sure you want to release this held cycle?')) {
      this.adminSalaryService.releaseSalaryCycle(this.cycle._id).subscribe({
        next: (resp: any) => {
          this.toastr.success('Salary cycle released successfully');
          this.loadCycleDetails(this.cycle._id);
        },
        error: (err: any) => {
          this.toastr.error(err.error?.message || 'Failed to release cycle');
        },
      });
    }
  }

  openForcePayoutModal(): void {
    this.actionReason = '';
    this.showForcePayoutModal = true;
  }

  forcePayout(): void {
    if (!this.actionReason) {
      this.toastr.warning('Please provide a reason for force payout');
      return;
    }

    this.adminSalaryService
      .forcePayoutSalaryCycle(this.cycle._id, this.actionReason)
      .subscribe({
        next: (resp: any) => {
          this.toastr.success('Salary payout forced successfully');
          this.showForcePayoutModal = false;
          this.loadCycleDetails(this.cycle._id);
        },
        error: (err: any) => {
          this.toastr.error(err.error?.message || 'Failed to force payout');
        },
      });
  }

  openReverseModal(): void {
    this.actionReason = '';
    this.showReverseModal = true;
  }

  reversePayment(): void {
    if (!this.actionReason) {
      this.toastr.warning('Please provide a reason for reversal');
      return;
    }

    if (
      !confirm(
        'Are you sure you want to reverse this payment? This will deduct funds from the host wallet.'
      )
    ) {
      return;
    }

    this.adminSalaryService
      .reverseSalaryPayment(this.cycle._id, this.actionReason)
      .subscribe({
        next: (resp: any) => {
          this.toastr.success('Salary payment reversed successfully');
          this.showReverseModal = false;
          this.loadCycleDetails(this.cycle._id);
        },
        error: (err: any) => {
          this.toastr.error(err.error?.message || 'Failed to reverse payment');
        },
      });
  }

  closeModal(): void {
    this.showRecalculateModal = false;
    this.showHoldModal = false;
    this.showForcePayoutModal = false;
    this.showReverseModal = false;
  }

  getStatusClass(status: string): string {
    const classes: any = {
      calculated: 'bg-info',
      held: 'bg-warning',
      paid: 'bg-success',
      disputed: 'bg-danger',
    };
    return classes[status] || 'bg-secondary';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  goBack(): void {
    this.router.navigate(['/admin-salary']);
  }
}
