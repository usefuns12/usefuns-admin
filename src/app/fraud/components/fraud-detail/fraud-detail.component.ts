import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FraudService } from '../../../services/fraud.service';

@Component({
  selector: 'app-fraud-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="detail-container">
      <h2>Fraud Action Details</h2>
      <div class="card" *ngIf="fraudAction">
        <p><strong>Type:</strong> {{ fraudAction.type }}</p>
        <p>
          <strong>Target:</strong> {{ fraudAction.targetType }} -
          {{ fraudAction.targetRef }}
        </p>
        <p><strong>Status:</strong> {{ fraudAction.status }}</p>
        <p><strong>Reason:</strong> {{ fraudAction.reason }}</p>
        <p>
          <strong>Created:</strong>
          {{ fraudAction.createdAt | date : 'medium' }}
        </p>

        <div class="actions">
          <button
            class="btn btn-warning"
            (click)="showReleaseModal = true"
            *ngIf="fraudAction.status === 'active'"
          >
            Release
          </button>
          <button
            class="btn btn-danger"
            (click)="showConvertModal = true"
            *ngIf="fraudAction.status === 'active'"
          >
            Convert to Permanent
          </button>
        </div>
      </div>

      <div class="modal" *ngIf="showReleaseModal">
        <div class="modal-content">
          <h3>Release Fraud Action</h3>
          <textarea
            [(ngModel)]="releaseReason"
            placeholder="Reason for release"
            rows="4"
          ></textarea>
          <div class="modal-actions">
            <button (click)="release()">Confirm</button>
            <button (click)="showReleaseModal = false">Cancel</button>
          </div>
        </div>
      </div>

      <div class="modal" *ngIf="showConvertModal">
        <div class="modal-content">
          <h3>Convert to Permanent Block</h3>
          <textarea
            [(ngModel)]="convertReason"
            placeholder="Reason for permanent block"
            rows="4"
          ></textarea>
          <div class="modal-actions">
            <button (click)="convertToPermanent()">Confirm</button>
            <button (click)="showConvertModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .detail-container {
        padding: 20px;
      }
      .card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 20px;
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
        border-radius: 8px;
        min-width: 400px;
      }
      .modal-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
      }
      textarea {
        width: 100%;
        padding: 10px;
        margin-top: 10px;
      }
    `,
  ],
})
export class FraudDetailComponent implements OnInit {
  fraudAction: any = null;
  showReleaseModal = false;
  showConvertModal = false;
  releaseReason = '';
  convertReason = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fraudService: FraudService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadDetail(id);
  }

  loadDetail(id: string): void {
    this.fraudService.getFraudAction(id).subscribe({
      next: (resp: any) => {
        this.fraudAction = resp.data;
      },
      error: () => {
        this.toastr.error('Failed to load fraud action');
      },
    });
  }

  release(): void {
    if (!this.releaseReason) {
      this.toastr.error('Please provide a reason');
      return;
    }
    this.fraudService
      .releaseFraudAction(this.fraudAction._id, this.releaseReason)
      .subscribe({
        next: () => {
          this.toastr.success('Fraud action released');
          this.showReleaseModal = false;
          this.router.navigate(['/fraud']);
        },
        error: () => {
          this.toastr.error('Failed to release');
        },
      });
  }

  convertToPermanent(): void {
    if (!this.convertReason) {
      this.toastr.error('Please provide a reason');
      return;
    }
    this.fraudService
      .convertToPermanent(this.fraudAction._id, this.convertReason)
      .subscribe({
        next: () => {
          this.toastr.success('Converted to permanent block');
          this.showConvertModal = false;
          this.router.navigate(['/fraud']);
        },
        error: () => {
          this.toastr.error('Failed to convert');
        },
      });
  }
}
