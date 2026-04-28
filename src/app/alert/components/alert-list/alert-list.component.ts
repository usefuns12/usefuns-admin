import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <h2>Alert Management</h2>
      <div class="stats row mb-4" *ngIf="stats">
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body text-center">
              <h6 class="card-title mb-2">Open</h6>
              <h3 class="text-warning fw-bold">{{ getStatCount('open') }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body text-center">
              <h6 class="card-title mb-2">Acknowledged</h6>
              <h3 class="text-info fw-bold">
                {{ getStatCount('acknowledged') }}
              </h3>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 mb-3">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body text-center">
              <h6 class="card-title mb-2">Resolved</h6>
              <h3 class="text-success fw-bold">
                {{ getStatCount('resolved') }}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div class="filters">
        <select [(ngModel)]="filters.status" (change)="applyFilters()">
          <option value="open">Open</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
          <option value="all">All</option>
        </select>
        <select [(ngModel)]="filters.severity" (change)="applyFilters()">
          <option value="">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-hover table-bordered">
          <thead class="table-dark">
            <tr>
              <th>Type</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Message</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="alerts.length === 0">
              <td colspan="6" class="text-center text-muted">
                No alerts found
              </td>
            </tr>
            <tr *ngFor="let alert of alerts">
              <td>{{ alert.type }}</td>
              <td>
                <span class="badge severity-{{ alert.severity }}">{{
                  alert.severity
                }}</span>
              </td>
              <td>{{ alert.status }}</td>
              <td>{{ alert.message?.substring(0, 50) }}...</td>
              <td>{{ alert.createdAt | date : 'short' }}</td>
              <td>
                <a [routerLink]="[alert._id]" class="btn btn-sm btn-primary"
                  >View</a
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button (click)="prevPage()" [disabled]="isFirstPage()">
          Previous
        </button>
        <span>Page {{ pagination.current }} of {{ pagination.pages }}</span>
        <button (click)="nextPage()" [disabled]="isLastPage()">Next</button>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
      }
      .stats {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
      }
      .stat-card {
        background: white;
        padding: 15px;
        border-radius: 8px;
      }
      .filters {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }
      .filters select {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }
      .table {
        width: 100%;
        background: white;
        margin-top: 20px;
      }
      .severity-critical {
        background: #dc3545;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
      }
      .severity-high {
        background: #ff6b6b;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
      }
      .severity-medium {
        background: #ffc107;
        color: black;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
      }
      .severity-low {
        background: #28a745;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
      }
      .pagination {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        align-items: center;
        justify-content: center;
      }
      .pagination button {
        padding: 8px 16px;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
        border-radius: 4px;
      }
      .pagination button:disabled {
        background: #f0f0f0;
        color: #999;
        cursor: not-allowed;
      }
      .pagination button:not(:disabled):hover {
        background: #007bff;
        color: white;
        border-color: #007bff;
      }
    `,
  ],
})
export class AlertListComponent implements OnInit {
  alerts: any[] = [];
  stats: any = null;
  filters: any = { status: 'open', severity: '', page: 1, limit: 20 };
  pagination: any = { current: 1, pages: 1 };

  constructor(
    private alertService: AlertService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadStats();
  }

  loadData(): void {
    this.alertService.listAlerts(this.filters).subscribe({
      next: (resp: any) => {
        this.alerts = resp.data?.alerts || [];
        this.pagination = resp.data?.pagination || {};
      },
      error: () => this.toastr.error('Failed to load alerts'),
    });
  }

  loadStats(): void {
    this.alertService.getAlertStats().subscribe({
      next: (resp: any) => {
        // API returns data.byStatus, bySeverity, byType directly
        this.stats = resp.data || {};
      },
    });
  }

  getStatCount(status: string): number {
    // API returns byStatus as array with _id and count properties
    if (!this.stats?.byStatus || !Array.isArray(this.stats.byStatus)) return 0;
    const stat = this.stats.byStatus.find((s: any) => s._id === status);
    return stat?.count || 0;
  }

  getCurrentPage(): number {
    return parseInt(this.pagination.current as string) || 1;
  }

  isFirstPage(): boolean {
    return this.getCurrentPage() === 1;
  }

  isLastPage(): boolean {
    return this.getCurrentPage() >= this.pagination.pages;
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.loadData();
  }

  nextPage(): void {
    const currentPage = parseInt(this.pagination.current as string) || 1;
    if (currentPage < this.pagination.pages) {
      this.filters.page = currentPage + 1;
      this.loadData();
    }
  }

  prevPage(): void {
    const currentPage = parseInt(this.pagination.current as string) || 1;
    if (currentPage > 1) {
      this.filters.page = currentPage - 1;
      this.loadData();
    }
  }
}
