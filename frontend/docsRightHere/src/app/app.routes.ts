import { Routes } from '@angular/router';
import { Notificacoes } from './components/notificacoes/notificacoes';
import { Calendario } from './components/calendario/calendario';
import { LoginForm } from './components/login-form/login-form';
import { RegisterForm } from './components/register-form/register-form';
import { Auth } from './pages/auth/auth';
import { Home } from './pages/home/home';
import { Cards } from './components/cards/cards';
import { Suporte } from './components/suporte/suporte';
import { Mural } from './components/mural/mural';
import { Relatorios } from './components/relatorios/relatorios';

export const routes: Routes = [

  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    component: Auth,
    children: [
      { path: 'login', component: LoginForm },
      { path: 'cadastro', component: RegisterForm },
      { path: 'mural', component: Mural }
    ]
  },

  {
    path: 'home',
    component: Home,
    children: [
      { path: 'mural', component: Mural },
      { path: 'notificacoes', component: Notificacoes },
      { path: 'calendario', component: Calendario },
      { path: 'cards', component: Cards },
      { path: 'relatorios', component: Relatorios },
      { path: 'suporte', component: Suporte }
    ]
  },

  { path: '**', redirectTo: 'auth/login' }
];
