import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthPlaceholder } from '../components/auth-placeholder/auth-placeholder';



@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, AuthPlaceholder],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
}
