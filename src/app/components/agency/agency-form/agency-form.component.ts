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
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { AgencyService } from '../../../services/agency.service';
import { SubAdminService } from '../../../services/subadmin.service';

@Component({
  selector: 'app-agency-form',
  standalone: true,
  templateUrl: './agency-form.component.html',
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule, NgSelectModule],
})
export class AgencyFormComponent implements OnInit {
  form: FormGroup;
  mode: 'add' | 'edit';
  isLoading = false;

  owners: any[] = [];

  constructor(
    private fb: FormBuilder,
    private agencyService: AgencyService,
    private adminService: AdminService,
    private subAdminService: SubAdminService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AgencyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode;

    this.form = this.fb.group({
      agencyId: [null, Validators.required],
      name: [null, Validators.required],
      ownerUserId: [null, Validators.required],
    });

    if (this.mode === 'edit') {
      this.form.patchValue({
        agencyId: data.agency.agencyId,
        name: data.agency.name,
        ownerUserId: data.agency.ownerUserId._id,
      });
    }
  }

  ngOnInit(): void {
    this.getOwners();
  }

  getOwners(): void {
    // ✅ fetch admins and sub-admins separately
    forkJoin({
      admins: this.adminService.getAdmin(),
      subAdmins: this.subAdminService.getSubAdmin(),
    }).subscribe({
      next: (resp) => {
        // merge both arrays into single owners array
        this.owners = [
          ...(resp.admins?.data || []),
          ...(resp.subAdmins?.data || []),
        ];
      },
      error: (err) => {
        console.error('Error fetching owners:', err);
        this.owners = [];
      },
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    const payload = this.form.value;

    if (this.mode === 'add') {
      this.agencyService.addAgency(payload).subscribe({
        next: (res: any) =>
          this.dialogRef.close({ refresh: true, message: res.message }),
        error: () => (this.isLoading = false),
      });
    } else {
      const updatePayload = { ...payload, id: this.data.agency._id };
      this.agencyService.updateAgency(updatePayload).subscribe({
        next: (res: any) =>
          this.dialogRef.close({ refresh: true, message: res.message }),
        error: () => (this.isLoading = false),
      });
    }
  }
}
