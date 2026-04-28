import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FraudService } from '../../../services/fraud.service';

@Component({
  selector: 'app-fraud-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="fraud-container">
      <h2>Fraud Management</h2>
      <div class="filters">
        <select [(ngModel)]="filters.targetType" (change)="applyFilters()">
          <option value="">All Target Types</option>
          <option value="user">User</option>
          <option value="host">Host</option>
          <option value="wallet">Wallet</option>
          <option value="device">Device</option>
        </select>
        <select [(ngModel)]="filters.status" (change)="applyFilters()">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="released">Released</option>
          <option value="expired">Expired</option>
          <option value="converted_permanent">Permanent</option>
        </select>
        <button (click)="loadData()">Refresh</button>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-hover table-bordered">
          <thead class="table-dark">
            <tr>
              <th>Type</th>
              <th>Target</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="fraudActions.length === 0">
              <td colspan="5" class="text-center text-muted">
                No fraud actions found
              </td>
            </tr>
            <tr *ngFor="let action of fraudActions">
              <td>{{ action.type }}</td>
              <td>{{ action.targetType }}: {{ action.targetRef }}</td>
              <td>
                <span class="badge" [class]="'badge-' + action.status">{{
                  action.status
                }}</span>
              </td>
              <td>{{ action.createdAt | date : 'short' }}</td>
              <td>
                <a [routerLink]="[action._id]" class="btn btn-sm btn-primary"
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
      .fraud-container {
        padding: 20px;
      }
      .filters {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }
      .filters select,
      .filters button {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
      }
      .filters button {
        background: #007bff;
        color: white;
        border: none;
        cursor: pointer;
      }
      .filters button:hover {
        background: #0056b3;
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
      .badge-active {
        background: #ff4444;
        color: white;
      }
      .badge-released {
        background: #28a745;
        color: white;
      }
      .badge-expired {
        background: #6c757d;
        color: white;
      }
      .badge-converted_permanent {
        background: #dc3545;
        color: white;
      }
      .pagination {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-top: 20px;
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
export class FraudListComponent implements OnInit {
  fraudActions: any[] = [];
  filters: any = { targetType: '', status: '', page: 1, limit: 20 };
  pagination: any = { page: 1, pages: 1, total: 0 };
  isLoading = false;

  constructor(
    private fraudService: FraudService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.fraudService.listFraudActions(this.filters).subscribe({
      next: (resp: any) => {
        this.fraudActions = resp.data || [];
        this.pagination = resp.pagination || {};
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error('Failed to load fraud actions');
        this.isLoading = false;
      },
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
