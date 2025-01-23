import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarComponent } from '../../navigation/sidebar/sidebar.component';
import { UserFormComponent } from './user-form/user-form.component';
import { MatTooltip } from '@angular/material/tooltip';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-user-list',
  imports: [FontAwesomeModule, MatTooltip, CommonModule, NgxSkeletonLoaderModule],
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
    private apiService: UserService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.isLoading = true;
    this.apiService.getUsers().subscribe(
      (resp) => {
        console.log(resp);
        this.users = resp.data;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  navigateUser(userId: string) {
    //this.router.navigate([route], { relativeTo: this.route });
    this.sidebar.openDrawer(UserFormComponent, userId);
  }
}
