import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { APIKEY_TOKEN } from '../../../utils/injector-tokens.token';
import { ApiKeyService } from '../../../services/api-key.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DrawerService } from '../../../services/drawer.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-api-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  templateUrl: './api-form.component.html',
  styleUrl: './api-form.component.scss',
})
export class ApiFormComponent {
  apiKeyForm: FormGroup;
  apiKey: any;
  mode: string;
  isLoading: boolean = false;

  constructor(
    @Inject(APIKEY_TOKEN) apiKeyToken: any,
    private fb: FormBuilder,
    private apiService: ApiKeyService,
    private drawerService: DrawerService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.mode = apiKeyToken.mode;
    this.apiKey = apiKeyToken.apiKey;
    this.apiKeyForm = this.fb.group({
      service: new FormControl(null, [Validators.required]),
      secretKeys: this.fb.array([new FormControl('', [Validators.required])]),
      /* isActive: new FormControl(true), */
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit') {
      this.patchFormValues();
    }
  }

  patchFormValues() {
    this.apiKeyForm.patchValue({
      service: this.apiKey.service,
    });

    this.secretKeys.clear();
    this.apiKey.secretKeys.forEach((secret: any) => {
      this.secretKeys.push(new FormControl(secret, [Validators.required]));
    });
  }

  get secretKeys(): FormArray {
    return this.apiKeyForm.get('secretKeys') as FormArray;
  }

  addSecretKey(): void {
    this.secretKeys.push(new FormControl('', [Validators.required]));
  }

  removeSecretKey(index: number): void {
    this.secretKeys.removeAt(index);
  }

  addApiKey() {
    this.isLoading = true;
    const postData = this.apiKeyForm.value;

    this.apiService.addApiKey(postData).subscribe(
      (resp) => {
        this.isLoading = false;
        this.drawerService.updateDrawer();
        this.apiService.updateApiKeys();
        this.toastr.success(resp.message);
      },
      (err) => {
        console.error(err);
        this.isLoading = false;
        this.toastr.error(err);
      }
    );
  }

  updateApiKey() {
    this.isLoading = true;
    let postData = this.apiKeyForm.value;
    postData['_id'] = this.apiKey._id;
    
    this.apiService.updateApiKey(postData).subscribe(
      (resp) => {
        this.drawerService.updateDrawer();
        this.apiService.updateApiKeys();
        this.toastr.success(resp.message);
      },
      (err) => {
        this.isLoading = false;
        this.toastr.error(err);
      }
    );
  }
}
