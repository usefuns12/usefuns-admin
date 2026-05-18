import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { AdminSalaryService } from '../../../services/admin-salary.service';

@Component({
  selector: 'app-salary-cycles',
  standalone: true,
  templateUrl: './salary-cycles.component.html',
  styleUrls: ['./salary-cycles.component.scss'],
  imports: [CommonModule, FormsModule, FontAwesomeModule],
})
export class SalaryCyclesComponent implements OnInit {
  cycles: any[] = [];
  stats: any = {};
  isLoading = false;

  // Filters
  filters = {
    page: 1,
    limit: 20,
    status: '',
    hostId: '',
    startDate: '',
    endDate: '',
    sortBy: 'cycleStart',
    sortOrder: 'desc',
  };

  pagination = {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  };

  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'calculated', label: 'Calculated' },
    { value: 'held', label: 'Held' },
    { value: 'paid', label: 'Paid' },
    { value: 'disputed', label: 'Disputed' },
  ];

  constructor(
    private adminSalaryService: AdminSalaryService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadStats();
  }

  loadData(): void {
    this.isLoading = true;
    this.adminSalaryService.getSalaryCycles(this.filters).subscribe({
      next: (resp: any) => {
        this.cycles = resp.data?.cycles || [];
        this.pagination = resp.data?.pagination || this.pagination;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error(err.error?.message || 'Failed to load salary cycles');
        this.isLoading = false;
      },
    });
  }

  loadStats(): void {
    const dateFilters: any = {};
    if (this.filters.startDate) dateFilters.startDate = this.filters.startDate;
    if (this.filters.endDate) dateFilters.endDate = this.filters.endDate;

    this.adminSalaryService.getSalaryCycleStats(dateFilters).subscribe({
      next: (resp: any) => {
        this.stats = resp.data || {};
      },
      error: (err: any) => {
        console.error('Failed to load stats:', err);
      },
    });
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.loadData();
    this.loadStats();
  }

  resetFilters(): void {
    this.filters = {
      page: 1,
      limit: 20,
      status: '',
      hostId: '',
      startDate: '',
      endDate: '',
      sortBy: 'cycleStart',
      sortOrder: 'desc',
    };
    this.loadData();
    this.loadStats();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.pagination.pages) {
      this.filters.page = page;
      this.loadData();
    }
  }

  viewDetails(cycleId: string): void {
    this.router.navigate(['/admin-salary/cycles', cycleId]);
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
    return new Date(date).toLocaleDateString();
  }
}
