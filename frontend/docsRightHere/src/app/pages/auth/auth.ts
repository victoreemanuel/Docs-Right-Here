import { Component } from '@angular/core';
import { AuthPlaceholder } from '../../components/auth-placeholder/auth-placeholder';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [AuthPlaceholder, RouterModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {}
