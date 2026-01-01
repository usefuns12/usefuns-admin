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
import { UserService } from '../../../services/user.service';

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
  customers: any[] = []; // ⭐ NEW LIST

  constructor(
    private fb: FormBuilder,
    private agencyService: AgencyService,
    private adminService: AdminService,
    private subAdminService: SubAdminService,
    private userService: UserService, // ⭐ NEW SERVICE
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AgencyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode;

    this.form = this.fb.group({
      agencyId: [null, Validators.required],
      name: [null, Validators.required],
      customerRef: [null, Validators.required], // ⭐ NEW FORM CONTROL
      ownerUserId: [null, Validators.required],
    });

    if (this.mode === 'edit') {
      this.form.patchValue({
        agencyId: data.agency.agencyId,
        name: data.agency.name,
        customerRef: data.agency.customerRef?._id || null, // ⭐ PATCH CUSTOMER
        ownerUserId: data.agency.ownerUserId?._id || null,
      });
    }
  }

  ngOnInit(): void {
    this.getCustomers(); // ⭐ LOAD CUSTOMERS
    this.getOwners();
  }

  // ⭐ FETCH CUSTOMERS FOR DROPDOWN
  getCustomers() {
    this.userService.getUnAssignedUsers().subscribe({
      next: (resp: any) => {
        this.customers = resp.data?.map((c: any) => ({
          _id: c._id,
          userId: c.userId,
          name: c.name,
        }));
      },
      error: () => (this.customers = []),
    });
  }

  // FETCH ADMINS + SUB-ADMINS
  getOwners(): void {
    forkJoin({
      admins: this.adminService.getAdmin(),
      subAdmins: this.subAdminService.getSubAdmin(),
    }).subscribe({
      next: (resp) => {
        this.owners = [
          ...(resp.admins?.data || []),
          ...(resp.subAdmins?.data || []),
        ];
      },
      error: () => {
        this.owners = [];
      },
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    const payload = {
      agencyId: this.form.value.agencyId,
      name: this.form.value.name,
      customerRef: this.form.value.customerRef, // ⭐ SEND CUSTOMER REF
      ownerUserId: this.form.value.ownerUserId,
    };

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
