import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarComponent } from '../../navigation/sidebar/sidebar.component';
import { UserFormComponent } from './user-form/user-form.component';
import { MatTooltip } from '@angular/material/tooltip';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BanUserDialogComponent } from './ban-user-dialog/ban-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  imports: [
    FontAwesomeModule,
    MatTooltip,
    CommonModule,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  isLoading: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sidebar: SidebarComponent,
    private apiService: UserService,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.isLoading = true;
    this.apiService.getUsers().subscribe(
      (resp) => {
        this.users = resp.data;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  openDrawer(userId: string) {
    this.sidebar.openDrawer(UserFormComponent, userId);
  }

  navigateUser(userId: string) {
    const navExtras: NavigationExtras = {
      relativeTo: this.route,
      state: { userId },
    };

    this.router.navigate(['edit'], navExtras);
  }

  banUser(user: any) {
    const dialogRef = this.dialog.open(BanUserDialogComponent, {
      width: '50%',
      disableClose: true,
      data: { userId: user._id, uid: user.userId, name: user.name, isActiveUser: user.isActiveUser },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if(result.success) {
          this.toastrService.success(result.message);
          this.getUsers();
        }
        else {
          this.toastrService.error(result.message);
        }
      }
    });
  }
}
