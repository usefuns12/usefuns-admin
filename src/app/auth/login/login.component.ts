import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean;
  errorRespMsg: string;

  constructor(
    private apiService: AuthService,
    private router: Router
  )
  {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  login() {
    this.isLoading = true;
    this.apiService.login(this.loginForm.value).subscribe(
      (resp) => {
        console.log(resp);
        this.router.navigate(['']);
        localStorage.setItem('token', resp.token);
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.errorRespMsg = error;
        this.isLoading = false;
      }
    );
  }
}
