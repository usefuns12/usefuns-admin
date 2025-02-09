import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-user-list',
  imports: [
    FontAwesomeModule,
    MatTooltip,
    CommonModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit, OnDestroy {
  users: any[] = [];
  filteredUsers: any[] = [];
  isLoading: boolean;
  searchControl = new FormControl();
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sidebar: SidebarComponent,
    private apiService: UserService,
    private dialog: MatDialog,
    private toastrService: ToastrService
  ) {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Waits for 300ms after typing stops
        distinctUntilChanged(),
        tap((term) => {
          if (term.length === 0) {
            this.filteredUsers = [...this.users];
          }
        }),
        filter((term) => term.length > 2), // Avoids duplicate consecutive values
        switchMap((term) => this.apiService.searchUsers(term)),
        takeUntil(this.destroy$) // Unsubscribes when component is destroyed
      )
      .subscribe((result) => {
        this.filteredUsers = result.data;
      });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.isLoading = true;
    this.apiService.getUsers().subscribe(
      (resp) => {
        this.users = resp.data;
        this.filteredUsers = [...this.users];
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  openDrawer(userId: string) {
    this.sidebar.openDrawer('User details', UserFormComponent, userId);
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
      data: {
        userId: user._id,
        uid: user.userId,
        name: user.name,
        isActiveUser: user.isActiveUser,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.success) {
          this.toastrService.success(result.message);
          this.getUsers();
        } else {
          this.toastrService.error(result.message);
        }
      }
    });
  }

  resetSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      this.filteredUsers = [...this.users];
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
