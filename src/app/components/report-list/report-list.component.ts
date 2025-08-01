import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
  imports: [NgxSkeletonLoaderModule, CommonModule],
})
export class ReportListComponent implements OnInit, OnDestroy {
  reports: any[] = [];
  filteredReports: any[] = [];
  isLoading = false;
  reportSubscription: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchReports();
  }

  fetchReports(): void {
    this.isLoading = true;
    this.reportSubscription = this.http
      .get<any>('https://protal.usefuns.com/api/reports')
      .subscribe({
        next: (res) => {
          this.reports = res.payments || [];
          this.filteredReports = this.reports;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching reports:', err);
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.reportSubscription?.unsubscribe();
  }
}
