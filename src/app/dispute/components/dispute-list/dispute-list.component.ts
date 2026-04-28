import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DisputeService } from '../../../services/dispute.service';

@Component({
  selector: 'app-dispute-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <h2>Dispute Management</h2>
      <div class="filters">
        <select [(ngModel)]="filters.status" (change)="applyFilters()">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select [(ngModel)]="filters.type" (change)="applyFilters()">
          <option value="">All Types</option>
          <option value="salary">Salary</option>
          <option value="commission">Commission</option>
          <option value="withdrawal">Withdrawal</option>
        </select>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-hover table-bordered">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Raised By</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="disputes.length === 0">
              <td colspan="6" class="text-center text-muted">
                No disputes found
              </td>
            </tr>
            <tr *ngFor="let dispute of disputes">
              <td>{{ dispute._id?.slice(-6) }}</td>
              <td>{{ dispute.type }}</td>
              <td>
                <span class="badge" [class]="'badge-' + dispute.status">{{
                  dispute.status
                }}</span>
              </td>
              <td>{{ dispute.raisedBy?.name || 'N/A' }}</td>
              <td>{{ dispute.createdAt | date : 'short' }}</td>
              <td>
                <a [routerLink]="[dispute._id]" class="btn btn-sm btn-primary"
                  >View</a
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button (click)="prevPage()" [disabled]="pagination.page === 1">
          Previous
        </button>
        <span>Page {{ pagination.page }} of {{ pagination.pages }}</span>
        <button
          (click)="nextPage()"
          [disabled]="pagination.page >= pagination.pages"
        >
          Next
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
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
      .badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
      }
      .badge-pending {
        background: #ffc107;
        color: black;
      }
      .badge-under_review {
        background: #17a2b8;
        color: white;
      }
      .badge-resolved {
        background: #28a745;
        color: white;
      }
      .badge-rejected {
        background: #dc3545;
        color: white;
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
export class DisputeListComponent implements OnInit {
  disputes: any[] = [];
  filters: any = { status: '', type: '', page: 1, limit: 20 };
  pagination: any = { page: 1, pages: 1 };

  constructor(
    private disputeService: DisputeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.disputeService.listDisputes(this.filters).subscribe({
      next: (resp: any) => {
        this.disputes = resp.data?.disputes || [];
        // API returns currentPage, totalPages, totalItems
        this.pagination = {
          page: resp.data?.pagination?.currentPage || 1,
          pages: resp.data?.pagination?.totalPages || 1,
          total: resp.data?.pagination?.totalItems || 0,
        };
      },
      error: () => this.toastr.error('Failed to load disputes'),
    });
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.loadData();
  }

  nextPage(): void {
    if (this.filters.page < this.pagination.pages) {
      this.filters.page++;
      this.loadData();
    }
  }

  prevPage(): void {
    if (this.filters.page > 1) {
      this.filters.page--;
      this.loadData();
    }
  }
}
