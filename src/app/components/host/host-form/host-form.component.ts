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
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { AgencyService } from '../../../services/agency.service';
import { HostService } from '../../../services/host.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-host-form',
  standalone: true,
  templateUrl: './host-form.component.html',
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule, NgSelectModule],
})
export class HostFormComponent implements OnInit {
  form: FormGroup;
  mode: 'add' | 'edit';
  isLoading = false;

  users: any[] = [];
  agencies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private hostService: HostService,
    private userService: UserService,
    private agencyService: AgencyService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<HostFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode;

    this.form = this.fb.group({
      customerRef: [null, Validators.required],
      agencyId: [null, Validators.required],
      password: [
        null,
        this.mode === 'add' ? Validators.required : Validators.nullValidator,
      ],
    });

    if (this.mode === 'edit') {
      this.form.patchValue({
        customerRef: data.host.customerRef?._id,
        agencyId: data.host.agencyId?._id,
      });
    }
  }

  ngOnInit(): void {
    this.getCustomers();
    this.getAgencies();
  }

  getCustomers(): void {
    this.userService.getUsers().subscribe({
      next: (resp) => (this.users = resp.data || []),
      error: (err) => console.error('Error fetching users:', err),
    });
  }

  getAgencies(): void {
    this.agencyService.getAgencies().subscribe({
      next: (resp) => (this.agencies = resp.data || []),
      error: (err) => console.error('Error fetching agencies:', err),
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    const payload = this.form.value;

    if (this.mode === 'add') {
      this.hostService.addHost(payload).subscribe({
        next: (res: any) =>
          this.dialogRef.close({ refresh: true, message: res.message }),
        error: () => (this.isLoading = false),
      });
    } else {
      const updatePayload = { ...payload, id: this.data.host._id };
      this.hostService.updateHost(updatePayload).subscribe({
        next: (res: any) =>
          this.dialogRef.close({ refresh: true, message: res.message }),
        error: () => (this.isLoading = false),
      });
    }
  }
}
