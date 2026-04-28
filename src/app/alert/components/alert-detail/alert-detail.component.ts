import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-alert-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Alert Details</h2>
      <div class="card" *ngIf="alert">
        <p><strong>Type:</strong> {{ alert.type }}</p>
        <p>
          <strong>Severity:</strong>
          <span class="badge severity-{{ alert.severity }}">{{
            alert.severity
          }}</span>
        </p>
        <p><strong>Status:</strong> {{ alert.status }}</p>
        <p><strong>Message:</strong> {{ alert.message }}</p>
        <p><strong>Created:</strong> {{ alert.createdAt | date : 'medium' }}</p>

        <div class="actions">
          <button
            class="btn btn-primary"
            (click)="acknowledge()"
            *ngIf="alert.status === 'open'"
          >
            Acknowledge
          </button>
          <button
            class="btn btn-success"
            (click)="showResolveModal = true"
            *ngIf="alert.status !== 'resolved'"
          >
            Resolve
          </button>
        </div>
      </div>

      <div class="modal" *ngIf="showResolveModal">
        <div class="modal-content">
          <h3>Resolve Alert</h3>
          <textarea
            [(ngModel)]="resolveNote"
            placeholder="Resolution note"
            rows="4"
          ></textarea>
          <button (click)="resolve()">Confirm</button>
          <button (click)="showResolveModal = false">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
      }
      .card {
        background: white;
        padding: 20px;
      }
      .actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
      }
      .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-content {
        background: white;
        padding: 30px;
        min-width: 400px;
      }
      textarea {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
      }
      .severity-critical {
        background: #dc3545;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
      }
    `,
  ],
})
export class AlertDetailComponent implements OnInit {
  alert: any = null;
  showResolveModal = false;
  resolveNote = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadDetail(id);
  }

  loadDetail(id: string): void {
    this.alertService.getAlert(id).subscribe({
      next: (resp: any) => {
        this.alert = resp.data;
      },
      error: () => this.toastr.error('Failed to load alert'),
    });
  }

  acknowledge(): void {
    this.alertService.acknowledgeAlert(this.alert._id).subscribe({
      next: () => {
        this.toastr.success('Alert acknowledged');
        this.loadDetail(this.alert._id);
      },
      error: () => this.toastr.error('Failed to acknowledge'),
    });
  }

  resolve(): void {
    this.alertService
      .resolveAlert(this.alert._id, { note: this.resolveNote })
      .subscribe({
        next: () => {
          this.toastr.success('Alert resolved');
          this.router.navigate(['/alert']);
        },
        error: () => this.toastr.error('Failed to resolve'),
      });
  }
}
