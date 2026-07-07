import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-return-login',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './return-login.html',
  styleUrl: './return-login.css',
})
export class ReturnLogin {

  private router = inject(Router);

  retornarLogin(){
    this.router.navigate(['/auth/login']);
  }
}
