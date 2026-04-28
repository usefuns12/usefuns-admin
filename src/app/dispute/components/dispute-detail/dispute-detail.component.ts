import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DisputeService } from '../../../services/dispute.service';

@Component({
  selector: 'app-dispute-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Dispute Details</h2>
      <div class="card" *ngIf="dispute">
        <p><strong>Type:</strong> {{ dispute.type }}</p>
        <p><strong>Status:</strong> {{ dispute.status }}</p>
        <p><strong>Reason:</strong> {{ dispute.reason }}</p>
        <p><strong>Impact Amount:</strong> {{ dispute.impactAmount }} UCoins</p>

        <div class="actions">
          <button
            class="btn btn-primary"
            (click)="showResolveModal = true"
            *ngIf="dispute.status === 'pending'"
          >
            Resolve
          </button>
          <button
            class="btn btn-danger"
            (click)="showRejectModal = true"
            *ngIf="dispute.status === 'pending'"
          >
            Reject
          </button>
        </div>
      </div>

      <div class="modal" *ngIf="showResolveModal">
        <div class="modal-content">
          <h3>Resolve Dispute</h3>
          <textarea
            [(ngModel)]="resolveNote"
            placeholder="Resolution note"
            rows="4"
          ></textarea>
          <button (click)="resolve()">Confirm</button>
          <button (click)="showResolveModal = false">Cancel</button>
        </div>
      </div>

      <div class="modal" *ngIf="showRejectModal">
        <div class="modal-content">
          <h3>Reject Dispute</h3>
          <textarea
            [(ngModel)]="rejectReason"
            placeholder="Reason"
            rows="4"
          ></textarea>
          <button (click)="reject()">Confirm</button>
          <button (click)="showRejectModal = false">Cancel</button>
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
        min-width: 400px;
      }
      textarea {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
      }
    `,
  ],
})
export class DisputeDetailComponent implements OnInit {
  dispute: any = null;
  showResolveModal = false;
  showRejectModal = false;
  resolveNote = '';
  rejectReason = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private disputeService: DisputeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadDetail(id);
  }

  loadDetail(id: string): void {
    this.disputeService.getDispute(id).subscribe({
      next: (resp: any) => {
        this.dispute = resp.data;
      },
      error: () => this.toastr.error('Failed to load dispute'),
    });
  }

  resolve(): void {
    this.disputeService
      .resolveDispute(this.dispute._id, { note: this.resolveNote })
      .subscribe({
        next: () => {
          this.toastr.success('Dispute resolved');
          this.router.navigate(['/dispute']);
        },
        error: () => this.toastr.error('Failed to resolve'),
      });
  }

  reject(): void {
    this.disputeService
      .rejectDispute(this.dispute._id, this.rejectReason)
      .subscribe({
        next: () => {
          this.toastr.success('Dispute rejected');
          this.router.navigate(['/dispute']);
        },
        error: () => this.toastr.error('Failed to reject'),
      });
  }
}
