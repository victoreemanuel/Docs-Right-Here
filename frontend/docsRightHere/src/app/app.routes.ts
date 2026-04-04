import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { LoginPage } from './pages/login-page/login-page';
import { CadastroPage } from './pages/cadastro-page/cadastro-page';
import { Dashboard } from './dashboard/dashboard';
import { MeusCards } from './meus-cards/meus-cards';
import { Notificacoes } from './notificacoes/notificacoes';
import { Auth1 } from './auth/auth1';

export const routes: Routes = [

  { path: '', redirectTo: 'Auth/login', pathMatch: 'full' },

  {
    path: 'Auth',
    component: Auth,
    children: [
      { path: 'login', component: LoginPage },
      { path: 'cadastro', component: CadastroPage },

    ]
  },

  {
    path: 'Auth1',
    component: Auth1,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'meus-cards', component: MeusCards },
      { path: 'Notificacoes', component: Notificacoes },
    ]
  },

  { path: '**', redirectTo: 'Auth/login' }
];
