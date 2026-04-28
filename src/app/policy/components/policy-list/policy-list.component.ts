import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PolicyService } from '../../../services/policy.service';

@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.scss'],
})
export class PolicyListComponent implements OnInit {
  policies: any[] = [];
  isLoading = false;
  salaryStats: any[] = [];
  commissionStats: any[] = [];
  showSalaryPolicyModal = false;
  showCommissionPolicyModal = false;

  // Salary Policy Form
  salaryPolicyForm: any = {
    minDays: 15,
    maxDays: 31,
    diamondTarget: 10000,
    vipFullSalaryOnTarget: true,
    hourSlabs: [
      { minHours: 0, percentage: 0 },
      { minHours: 50, percentage: 40 },
      { minHours: 100, percentage: 60 },
      { minHours: 150, percentage: 80 },
      { minHours: 200, percentage: 100 },
    ],
  };

  // Commission Policy Form
  commissionPolicyForm: any = {
    commissionSlabs: [
      { minTotalUcoins: 0, percentage: 0 },
      { minTotalUcoins: 10000, percentage: 5 },
      { minTotalUcoins: 50000, percentage: 10 },
      { minTotalUcoins: 100000, percentage: 15 },
    ],
  };

  constructor(
    private policyService: PolicyService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPolicies();
    this.loadStats();
  }

  loadPolicies(): void {
    this.isLoading = true;
    // Use stats endpoint since GET_ALL_POLICIES returns 404
    this.policyService.getSalaryStats().subscribe({
      next: (resp: any) => {
        // Stats endpoint returns policies in response
        this.policies = resp.policies || [];
        this.isLoading = false;

        // Populate forms with existing data
        const salaryPolicy = this.policies.find((p) => p.type === 'hostSalary');
        if (salaryPolicy?.hostSalary) {
          this.salaryPolicyForm = { ...salaryPolicy.hostSalary };
        }

        const commissionPolicy = this.policies.find(
          (p) => p.type === 'agencyCommission'
        );
        if (commissionPolicy?.agencyCommission) {
          this.commissionPolicyForm.commissionSlabs =
            commissionPolicy.agencyCommission;
        }
      },
      error: (err: any) => {
        this.toastr.error(err.error?.message || 'Failed to load policies');
        this.isLoading = false;
      },
    });
  }

  loadStats(): void {
    this.policyService.getSalaryStats().subscribe({
      next: (resp: any) => {
        // Convert stats object to array if needed
        const stats = resp.stats || resp.data || [];
        this.salaryStats = Array.isArray(stats)
          ? stats
          : Object.entries(stats).map(([key, value]) => ({
              _id: key,
              count: value,
            }));
      },
      error: () => {
        this.salaryStats = [];
      },
    });

    this.policyService.getCommissionStats().subscribe({
      next: (resp: any) => {
        // Convert stats object to array if needed
        const stats = resp.stats || resp.data || [];
        this.commissionStats = Array.isArray(stats)
          ? stats
          : Object.entries(stats).map(([key, value]) => ({
              _id: key,
              count: value,
            }));
      },
      error: () => {
        this.commissionStats = [];
      },
    });
  }

  saveSalaryPolicy(): void {
    this.policyService.createHostSalaryPolicy(this.salaryPolicyForm).subscribe({
      next: (resp: any) => {
        this.toastr.success('Host salary policy updated successfully');
        this.showSalaryPolicyModal = false;
        this.loadPolicies();
      },
      error: (err: any) => {
        this.toastr.error(err.error?.message || 'Failed to update policy');
      },
    });
  }

  saveCommissionPolicy(): void {
    this.policyService
      .createCommissionPolicy(this.commissionPolicyForm)
      .subscribe({
        next: (resp: any) => {
          this.toastr.success('Agency commission policy updated successfully');
          this.showCommissionPolicyModal = false;
          this.loadPolicies();
        },
        error: (err: any) => {
          this.toastr.error(err.error?.message || 'Failed to update policy');
        },
      });
  }

  processSalaryCycles(): void {
    if (
      !confirm(
        'Are you sure you want to process all salary cycles? This may take a while.'
      )
    )
      return;

    this.policyService.processSalaryCycles().subscribe({
      next: (resp: any) => {
        this.toastr.success(
          resp.message || 'Salary cycles processed successfully'
        );
      },
      error: (err: any) => {
        this.toastr.error(
          err.error?.message || 'Failed to process salary cycles'
        );
      },
    });
  }

  payAllSalaries(): void {
    if (
      !confirm(
        'Are you sure you want to pay all pending salaries? This cannot be undone.'
      )
    )
      return;

    this.policyService.payAllSalaries().subscribe({
      next: (resp: any) => {
        this.toastr.success(
          `${resp.successful} salaries paid successfully, ${resp.failed} failed`
        );
      },
      error: (err: any) => {
        this.toastr.error(err.error?.message || 'Failed to pay salaries');
      },
    });
  }

  calculateCommissions(): void {
    if (!confirm('Are you sure you want to calculate all agency commissions?'))
      return;

    this.policyService.calculateCommissions().subscribe({
      next: (resp: any) => {
        this.toastr.success(
          resp.message || 'Commissions calculated successfully'
        );
      },
      error: (err: any) => {
        this.toastr.error(
          err.error?.message || 'Failed to calculate commissions'
        );
      },
    });
  }

  payAllCommissions(): void {
    if (
      !confirm(
        'Are you sure you want to pay all pending commissions? This cannot be undone.'
      )
    )
      return;

    this.policyService.payAllCommissions().subscribe({
      next: (resp: any) => {
        this.toastr.success(
          `${resp.successful} commissions paid successfully, ${resp.failed} failed`
        );
      },
      error: (err: any) => {
        this.toastr.error(err.error?.message || 'Failed to pay commissions');
      },
    });
  }

  addHourSlab(): void {
    this.salaryPolicyForm.hourSlabs.push({ minHours: 0, percentage: 0 });
  }

  removeHourSlab(index: number): void {
    this.salaryPolicyForm.hourSlabs.splice(index, 1);
  }

  addCommissionSlab(): void {
    this.commissionPolicyForm.commissionSlabs.push({
      minTotalUcoins: 0,
      percentage: 0,
    });
  }

  removeCommissionSlab(index: number): void {
    this.commissionPolicyForm.commissionSlabs.splice(index, 1);
  }
}
