import { Routes } from '@angular/router';
import { LoginForm } from './components/login-form/login-form';
import { RegisterForm } from './components/register-form/register-form';
import { Auth } from './pages/auth/auth';
import { Home } from './pages/home/home';
import { Dashboard } from './components/dashboard/dashboard';
import { Cards } from './components/cards/cards';

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
    path: 'home',
    component: Home,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'cards', component: Cards }
    ]
  },

  { path: '**', redirectTo: 'auth/login' }
];
