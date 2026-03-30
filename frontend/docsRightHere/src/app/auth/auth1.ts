import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar-component/navbar-component';

@Component({
  selector: 'app-auth1',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  templateUrl: './auth1.html',
  styleUrl: './auth.css'
})
export class Auth1 {}
