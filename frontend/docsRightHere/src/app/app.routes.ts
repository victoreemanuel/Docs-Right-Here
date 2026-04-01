import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { CadastroPage } from './pages/cadastro-page/cadastro-page';
import { Dashboard } from './dashboard/dashboard';
import { MeusCards } from './meus-cards/meus-cards';
import { Auth1 } from './auth/auth1';
import { LoginForm } from './components/login-form/login-form';
import { RegisterForm } from './components/register-form/register-form';

export const routes: Routes = [

  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    component: Auth,
    children: [
      { path: 'login', component: LoginForm },
      { path: 'cadastro', component: RegisterForm }
    ]
  },

  {
    path: 'Auth1',
    component: Auth1,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'meus-cards', component: MeusCards }
    ]
  },

  { path: '**', redirectTo: 'Auth/login' }
];
