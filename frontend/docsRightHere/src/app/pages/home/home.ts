import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar-component/navbar-component';

@Component({
  selector: 'app-home',
  imports: [RouterModule, NavbarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
