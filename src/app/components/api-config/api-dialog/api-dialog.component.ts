import { Component, Inject, signal } from '@angular/core';
import { ApiKeyService } from '../../../services/api-key.service';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-api-dialog',
  imports: [MatDialogModule],
  templateUrl: './api-dialog.component.html',
  styleUrl: './api-dialog.component.scss',
})
export class ApiDialogComponent {
  apiKeyId: string;
  loader = signal(false);

  constructor(
    public dialogRef: MatDialogRef<ApiDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiKeyService
  ) {
    this.apiKeyId = data.apiKeyId;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  removeItem(): void {
    this.loader.set(true);
    this.apiService.removeApiKey(this.apiKeyId).subscribe(
      (resp) => {
        this.loader.set(false);
        this.dialogRef.close({ success: true, message: resp.message });
        this.apiService.updateApiKeys();
      },
      (err) => {
        console.error(err);
        this.loader.set(false);
        this.dialogRef.close({ success: false, message: err });
      }
    );
  }
}
