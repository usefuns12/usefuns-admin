import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SidebarComponent } from '../../navigation/sidebar/sidebar.component';
import { ApiFormComponent } from './api-form/api-form.component';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiKeyService } from '../../services/api-key.service';
import { ApiDialogComponent } from './api-dialog/api-dialog.component';

@Component({
  selector: 'app-api-config',
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    FontAwesomeModule,
    MatTooltipModule,
  ],
  templateUrl: './api-config.component.html',
  styleUrl: './api-config.component.scss',
})
export class ApiConfigComponent {
  apiKeys: any[] = [];
  filteredApiKeys: any[] = [];
  isLoading: boolean;
  apiSubscription: Subscription;
  selectedCurrentItem: string;

  constructor(
    private sidebar: SidebarComponent,
    private apiService: ApiKeyService,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.apiSubscription = this.apiService.apiKey$.subscribe(() =>
      this.getApiKeys()
    );
  }

  openDrawer(item: string | null = null) {
    this.sidebar.openDrawer(
      item ? 'Edit API key' : 'Add new API key',
      ApiFormComponent,
      item
    );
  }

  getApiKeys() {
    this.isLoading = true;
    this.apiService.getApiKeys().subscribe(
      (resp) => {
        this.apiKeys = resp.data;
        this.filteredApiKeys = this.apiKeys.filter((c) => true);
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  openDialog(apiKey: any) {
    const dialogRef = this.dialog.open(ApiDialogComponent, {
      width: '50%',
      disableClose: true,
      data: { apiKeyId: apiKey._id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.success) {
          this.toastrService.success(result.message);
        } else {
          this.toastrService.error(result.message);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.apiSubscription.unsubscribe();
  }
}
