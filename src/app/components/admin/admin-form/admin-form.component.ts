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
import { AdminService } from '../../../services/admin.service';
import { CountryAdminService } from '../../../services/country-admin.service';
import { CountryManagerService } from '../../../services/country-managers.service';
import { CountryService } from '../../../services/country.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-admin-form',
  standalone: true,
  templateUrl: './admin-form.component.html',
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule, NgSelectModule],
})
export class AdminFormComponent implements OnInit {
  form: FormGroup;
  mode: 'add' | 'edit';
  isLoading = false;

  users: any[] = [];
  managers: any[] = [];
  countryAdmins: any[] = [];
  countries: any[] = [];

  private readonly staticRoleId = '68a6b5b05ed2a73734c3c464'; // Admin role

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private countryService: CountryService,
    private countryManagerService: CountryManagerService,
    private countryAdminService: CountryAdminService,
    private adminService: AdminService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AdminFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode;

    this.form = this.fb.group({
      customerId: [null, Validators.required],
      countryManagerId: [null, Validators.required],
      countryAdminId: [null, Validators.required],
      countryCode: [null, Validators.required],
      password: [null, Validators.required],
    });

    if (this.mode === 'edit') {
      this.form.patchValue({
        customerId: data.admin.customerRef?._id,
        countryManagerId: data.admin.parents[0]?._id || null,
        countryAdminId: data.admin.parents[1]?._id || null,
        countryCode: data.admin.country || null,
      });
    }
  }

  ngOnInit(): void {
    this.getUsers();
    this.getManagers();
    this.getCountries();

    // ✅ Watch for manager change to load admins dynamically
    this.form.get('countryManagerId')?.valueChanges.subscribe((managerId) => {
      if (managerId) {
        this.getAdminsByManager(managerId);
      } else {
        this.countryAdmins = [];
        this.form.patchValue({ countryAdminId: null });
      }
    });
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((resp) => {
      this.users = resp.data;
    });
  }

  getManagers(): void {
    this.countryManagerService.getCountryManagers().subscribe((resp) => {
      this.managers = resp?.data?.map((m: any) => ({
        _id: m._id,
        name: m?.customerRef?.name,
      }));
    });
  }

  getAdminsByManager(managerId: string): void {
    this.countryAdminService
      .getCountryAdminByCountryManager(managerId)
      .subscribe((resp) => {
        this.countryAdmins = resp?.data?.map((a: any) => ({
          _id: a._id,
          name: a?.customerRef?.name,
        }));
      });
  }

  getCountries(): void {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    const payload = {
      customerId: this.form.value.customerId,
      roleId: this.staticRoleId,
      parents: [
        this.form.value.countryManagerId,
        this.form.value.countryAdminId,
      ],
      password: this.form.value.password,
      country: this.form.value.countryCode,
    };

    if (this.mode === 'add') {
      this.adminService.addAdmin(payload).subscribe({
        next: (res: any) =>
          this.dialogRef.close({ refresh: true, message: res.message }),
        error: () => (this.isLoading = false),
      });
    } else {
      const updatePayload = { ...payload, id: this.data.admin._id };
      this.adminService.updateAdmin(updatePayload).subscribe({
        next: (res: any) =>
          this.dialogRef.close({ refresh: true, message: res.message }),
        error: () => (this.isLoading = false),
      });
    }
  }
}
