import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserFormComponent } from "../user-form/user-form.component";
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-user-view',
  imports: [
    MatToolbarModule,
    MatDividerModule,
    UserFormComponent
],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss'
})
export class UserViewComponent {

}
