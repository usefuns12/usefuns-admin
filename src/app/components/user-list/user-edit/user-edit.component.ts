import { Component, Injector } from '@angular/core';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { USER_ID_TOKEN } from '../../../utils/injector-tokens.token';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

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
    public apiService: UserService
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
}
