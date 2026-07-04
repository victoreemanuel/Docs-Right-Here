import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { UserBadgeComponent } from '../../components/user-badge/user-badge';

@Component({
  selector: 'app-home',
  imports: [RouterModule, Navbar, UserBadgeComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
