import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { QuantityService } from '../../services/quantity.service';
import { ConfirmDeleteComponent } from './confirm-delete.component';
import { QuantityFormComponent } from './quantity-form/quantity-form.component';

@Component({
  selector: 'app-quantity',
  standalone: true,
  templateUrl: './quantity.component.html',
  imports: [CommonModule, MatTooltipModule, FontAwesomeModule],
})
export class QuantityComponent implements OnInit {
  quantities: any[] = [];
  isLoading = false;

  constructor(
    private quantityService: QuantityService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getQuantities();
  }

  getQuantities(): void {
    this.isLoading = true;
    this.quantityService.getQuantities().subscribe({
      next: (resp) => {
        this.quantities = resp.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  openDialog(
    mode: 'add' | 'edit' | 'removeQuantity',
    quantity: any = null
  ): void {
    if (mode === 'removeQuantity') {
      const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
        width: '350px',
        data: {
          title: 'Delete Quantity',
          message: 'Are you sure you want to delete this entry?',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.quantityService.deleteQuantity(quantity._id).subscribe({
            next: (resp) => {
              this.getQuantities();
              this.toastr.success(resp.message);
            },
            error: (err) => this.toastr.error(err.message),
          });
        }
      });

      return;
    }

    const dialogRef = this.dialog.open(QuantityFormComponent, {
      width: '400px',
      disableClose: true,
      data: { mode, quantity },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.refresh) {
        this.getQuantities();
        this.toastr.success(result.message);
      }
    });
  }

  deleteQuantity(id: string): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.quantityService.deleteQuantity(id).subscribe({
        next: (resp) => {
          this.getQuantities();
          this.toastr.success(resp.message);
        },
        error: (err) => this.toastr.error(err.message),
      });
    }
  }
}
