import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TemplateLateralLogin } from '../template-lateral-login/template-lateral-login';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, TemplateLateralLogin],
  templateUrl: './auth.html',
   styleUrls: [
    '../components/template-lateral-login/template-lateral-login.css',
    '../pages/login-page/login-page.css',
    '../pages/cadastro-page/cadastro-page.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class Auth {
}
