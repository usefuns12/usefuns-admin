import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { AdminSalaryService } from '../../../services/admin-salary.service';

@Component({
  selector: 'app-agency-commission-detail',
  standalone: true,
  templateUrl: './agency-commission-detail.component.html',
  styleUrls: ['./agency-commission-detail.component.scss'],
  imports: [CommonModule, FontAwesomeModule],
})
export class AgencyCommissionDetailComponent implements OnInit {
  cycle: any = null;
  isLoading = false;

  constructor(
    private adminSalaryService: AdminSalaryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCycleDetails(id);
    }
  }

  loadCycleDetails(id: string): void {
    this.isLoading = true;
    this.adminSalaryService.getAgencyCommissionById(id).subscribe({
      next: (resp: any) => {
        this.cycle = resp.data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toastr.error(
          err.error?.message || 'Failed to load commission details'
        );
        this.isLoading = false;
        this.router.navigate(['/admin-salary/agency-commissions']);
      },
    });
  }

  getStatusClass(status: string): string {
    const classes: any = {
      calculated: 'bg-info',
      paid: 'bg-success',
    };
    return classes[status] || 'bg-secondary';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  goBack(): void {
    this.router.navigate(['/admin-salary/agency-commissions']);
  }
}
