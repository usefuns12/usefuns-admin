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
import { CountryAdminService } from '../../../services/country-admin.service';
import { CountryManagerService } from '../../../services/country-managers.service';
import { CountryService } from '../../../services/country.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-country-admin-form',
  templateUrl: './country-admin-form.component.html',
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule, NgSelectModule],
})
export class CountryAdminFormComponent implements OnInit {
  form: FormGroup;
  mode: 'add' | 'edit';
  isLoading = false;

  users: any[] = [];
  filteredUsers: any[] = [];
  managers: any[] = [];
  countries: any[] = [];

  private readonly staticRoleId = '68a6b5b05ed2a73734c3c461'; // CountryManager role

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private countryService: CountryService,
    private countryAdminService: CountryAdminService,
    private countryManagerService: CountryManagerService,
    public dialogRef: MatDialogRef<CountryAdminFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode;
    this.form = this.fb.group({
      customerId: [null, Validators.required],
      parents: [null, Validators.required], // country manager(s)
      countryCode: [null, Validators.required],
      password: [null, Validators.required],
    });

    if (this.mode === 'edit') {
      this.form.patchValue({
        customerId: data.admin.customerRef?._id,
        parents: data.admin.parents[0]?._id || [],
        countryCode: data.admin.country || null,
      });
    }
  }

  ngOnInit(): void {
    this.getUsers();
    this.getManagers();
    this.getCountries();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((resp) => {
      this.users = resp.data;
      this.filteredUsers = [...this.users];
    });
  }

  getManagers(): void {
    this.countryManagerService.getCountryManagers().subscribe((resp) => {
      this.managers = resp?.data?.map((manager: any) => ({
        _id: manager._id,
        name: manager?.customerRef?.name,
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
      parents: [this.form.value.parents],
      password: this.form.value.password,
      country: this.form.value.countryCode,
    };

    if (this.mode === 'add') {
      console.log('Add payload:', payload);
      this.countryAdminService.addCountryAdmin(payload).subscribe({
        next: (res: any) =>
          this.dialogRef.close({ refresh: true, message: res.message }),
        error: () => (this.isLoading = false),
      });
    } else {
      // Add 'id' property to payload for update
      const updatePayload = { ...payload, id: this.data.admin._id };
      this.countryAdminService.updateCountryAdmin(updatePayload).subscribe({
        next: (res: any) =>
          this.dialogRef.close({ refresh: true, message: res.message }),
        error: () => (this.isLoading = false),
      });
    }
  }
}
