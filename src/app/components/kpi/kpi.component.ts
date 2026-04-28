import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { KpiService } from '../../services/kpi.service';

@Component({
  selector: 'app-kpi',
  standalone: true,
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss'],
  imports: [CommonModule, FontAwesomeModule],
})
export class KpiComponent implements OnInit {
  activeTab: 'dashboard' | 'system' | 'wallets' | 'salary' | 'gifts' =
    'dashboard';
  isLoading = false;

  // Dashboard data
  dashboardSummary: any = {};
  systemHealth: any = {};
  walletHealth: any = {};
  salaryCycleHealth: any = {};
  giftAnomalies: any = {};

  constructor(private kpiService: KpiService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadData();
    this.kpiService.kpiRefresh$.subscribe(() => {
      this.loadData();
    });
  }

  loadData(): void {
    this.isLoading = true;
    // Load based on active tab
    switch (this.activeTab) {
      case 'dashboard':
        this.getDashboardSummary();
        break;
      case 'system':
        this.getSystemHealth();
        break;
      case 'wallets':
        this.getWalletHealth();
        break;
      case 'salary':
        this.getSalaryCycleHealth();
        break;
      case 'gifts':
        this.getGiftAnomalies();
        break;
    }
  }

  getDashboardSummary(): void {
    this.kpiService.getDashboardSummary().subscribe({
      next: (resp: any) => {
        this.dashboardSummary = resp.data || {};
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error(err.error?.message || 'Failed to load dashboard');
        this.isLoading = false;
      },
    });
  }

  getSystemHealth(): void {
    this.kpiService.getSystemHealth().subscribe({
      next: (resp: any) => {
        this.systemHealth = resp.data || {};
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error(err.error?.message || 'Failed to load system health');
        this.isLoading = false;
      },
    });
  }

  getWalletHealth(): void {
    this.kpiService.getWalletHealth().subscribe({
      next: (resp: any) => {
        this.walletHealth = resp.data || {};
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error(err.error?.message || 'Failed to load wallet health');
        this.isLoading = false;
      },
    });
  }

  getSalaryCycleHealth(): void {
    this.kpiService.getSalaryCycleHealth().subscribe({
      next: (resp: any) => {
        this.salaryCycleHealth = resp.data || {};
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error(
          err.error?.message || 'Failed to load salary cycle health'
        );
        this.isLoading = false;
      },
    });
  }

  getGiftAnomalies(): void {
    this.kpiService.getGiftAnomalies().subscribe({
      next: (resp: any) => {
        this.giftAnomalies = resp.data || {};
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error(
          err.error?.message || 'Failed to load gift anomalies'
        );
        this.isLoading = false;
      },
    });
  }

  switchTab(
    tab: 'dashboard' | 'system' | 'wallets' | 'salary' | 'gifts'
  ): void {
    this.activeTab = tab;
    this.loadData();
  }

  refreshData(): void {
    this.loadData();
  }

  getNextBoundary(value: number): number {
    const boundaries = [0, 100, 500, 1000, 5000, 10000, 100000];
    const index = boundaries.indexOf(value);
    return index >= 0 && index < boundaries.length - 1
      ? boundaries[index + 1]
      : value;
  }
}
