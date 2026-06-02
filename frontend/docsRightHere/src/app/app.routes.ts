import { Routes } from '@angular/router';
import { Notificacoes } from './pages/home/components/notificacoes/notificacoes';
import { Calendario } from './pages/home/components/calendario/calendario';
import { LoginForm } from './pages/auth/components/login-form/login-form';
import { RegisterForm } from './pages/auth/components/register-form/register-form';
import { Auth } from './pages/auth/auth';
import { Home } from './pages/home/home';
import { Cards } from './pages/home/components/cards/cards';
import { Suporte } from './pages/home/components/suporte/suporte';
import { Mural } from './pages/home/components/mural/mural';
import { Endereco } from './pages/auth/components/endereco/endereco';
import { DadosPessoais } from './pages/auth/components/dados-pessoais/dados-pessoais';
import { ReturnLogin } from './pages/auth/components/return-login/return-login';

export const routes: Routes = [

  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    component: Auth,
    children: [
      { path: 'login', component: LoginForm },
      { path: 'cadastro', component: RegisterForm },
      { path: 'endereco', component: Endereco},
      { path: 'dados-pessoais', component: DadosPessoais},
      { path: 'retorno-login', component: ReturnLogin},
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
      { path: 'suporte', component: Suporte }
    ]
  },

  { path: '**', redirectTo: 'auth/login' }
];
