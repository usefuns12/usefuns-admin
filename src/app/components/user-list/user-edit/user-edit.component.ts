import { Component, Injector } from '@angular/core';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { USER_ID_TOKEN } from '../../../utils/injector-tokens.token';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemsDialogComponent } from './items-dialog/items-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-edit',
  imports: [
    CommonModule,
    BreadcrumbComponent
],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent {

  userFormComponent: any;
  userId: string;
  dataInjector: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    public apiService: UserService,
    private toastrService: ToastrService
  )
  {
    route.params.subscribe(() => {
      if(router.getCurrentNavigation()?.extras.state?.['userId']) {
        this.userId = router.getCurrentNavigation()?.extras.state?.['userId'];
        this.userFormComponent = UserFormComponent;
        this.dataInjector = Injector.create({
          providers: [{ provide: USER_ID_TOKEN, useValue: { userId: this.userId, mode: 'edit' }}],
        });
      }
    });
  }

  saveUser()
  {
    this.apiService.updateUserForm();
  }

  openItemsDialog() {
      const dialogRef = this.dialog.open(ItemsDialogComponent, {
        width: '50%',
        disableClose: true,
        data: {
          userId: this.userId,
          mode: 'add'
        },
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
}
