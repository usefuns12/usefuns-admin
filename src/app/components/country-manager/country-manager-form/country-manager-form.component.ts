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
import { CountryManagerService } from '../../../services/country-managers.service';
import { CountryService } from '../../../services/country.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-country-manager-form',
  templateUrl: './country-manager-form.component.html',
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule, NgSelectModule],
})
export class CountryManagerFormComponent implements OnInit {
  form: FormGroup;
  mode: 'add' | 'edit';
  isLoading = false;

  users: any[] = [];
  filteredUsers: any[] = [];
  countries: any[] = [];

  private readonly staticRoleId = '68a6b5b05ed2a73734c3c462'; // CountryManager roleId

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private countryService: CountryService,
    private countryManagerService: CountryManagerService,
    public dialogRef: MatDialogRef<CountryManagerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode;
    this.form = this.fb.group({
      customerId: [null, Validators.required],
      countryCode: [null, Validators.required],
      password: [null, Validators.required],
    });

    if (this.mode === 'edit') {
      this.form.patchValue({
        customerId: data.manager.customerRef?._id,
        countryCode: data.manager.country || null,
      });
    }
  }

  ngOnInit(): void {
    this.getUsers();
    this.getCountries();
  }

  getUsers(): void {
    this.userService.getUnAssignedUsers().subscribe((resp) => {
      this.users = resp.data;
      this.filteredUsers = [...this.users];
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
      parents: [], // ✅ no parents for managers
      password: this.form.value.password,
      country: this.form.value.countryCode,
    };

    if (this.mode === 'add') {
      this.countryManagerService.addCountryManager(payload).subscribe({
        next: (res: any) =>
          this.dialogRef.close({ refresh: true, message: res.message }),
        error: () => (this.isLoading = false),
      });
    } else {
      const updatePayload = { ...payload, id: this.data.manager._id };
      this.countryManagerService.updateCountryManager(updatePayload).subscribe({
        next: (res: any) =>
          this.dialogRef.close({ refresh: true, message: res.message }),
        error: () => (this.isLoading = false),
      });
    }
  }
}
