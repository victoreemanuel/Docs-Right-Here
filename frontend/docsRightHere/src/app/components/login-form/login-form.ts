import { next } from './../../../../node_modules/@csstools/css-syntax-patches-for-csstree/dist/index.d';
import { AuthService } from './../../services/auth.service';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../../models/auth-model';


@Component({
  selector: 'app-login-form',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private readonly AuthService = inject(AuthService);
  private readonly router = inject(Router);

  LoginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(6), Validators.required])
  })



  realizarlogin(){
    if (this.LoginForm.invalid) return;

    const request: LoginRequest = {
      email: this.LoginForm.value.email!,
      password: this.LoginForm.value.password!
    };

    console.log(request);

    this.AuthService.login(request).subscribe({
      next: ()=> this.router.navigate(['/home']),
      error: (er) => console.log(er)
    });

  }
}
