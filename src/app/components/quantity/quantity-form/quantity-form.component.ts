import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { QuantityService } from '../../../services/quantity.service';

@Component({
  selector: 'app-quantity-form',
  templateUrl: './quantity-form.component.html',
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule],
})
export class QuantityFormComponent implements OnInit {
  quantityForm: FormGroup;
  mode: 'add' | 'edit';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private quantityService: QuantityService,
    public dialogRef: MatDialogRef<QuantityFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode;
    this.quantityForm = this.fb.group({
      quantity: [null, [Validators.required, Validators.min(1)]],
      cashbackAmount: [null, [Validators.required, Validators.min(0)]],
    });

    if (this.mode === 'edit') {
      this.quantityForm.patchValue(data.quantity);
    }
  }

  ngOnInit(): void {}

  submit(): void {
    if (this.quantityForm.invalid) return;

    this.isLoading = true;
    const payload = this.quantityForm.value;

    if (this.mode === 'add') {
      this.quantityService.addQuantity(payload).subscribe({
        next: (res) =>
          this.dialogRef.close({ refresh: true, message: res.message }),
        error: () => (this.isLoading = false),
      });
    } else {
      payload._id = this.data.quantity._id;
      this.quantityService.updateQuantity(payload).subscribe({
        next: (res) =>
          this.dialogRef.close({ refresh: true, message: res.message }),
        error: () => (this.isLoading = false),
      });
    }
  }
}
