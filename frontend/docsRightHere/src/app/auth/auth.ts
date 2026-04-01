import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TemplateLateralLogin } from '../components/template-lateral-login/template-lateral-login';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, TemplateLateralLogin],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
}
