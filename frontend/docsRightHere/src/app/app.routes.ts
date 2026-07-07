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
import { Endereco } from './components/endereco/endereco';
import { DadosPessoais } from './components/dados-pessoais/dados-pessoais';
import { ReturnLogin } from './components/return-login/return-login';
import { Financeiro } from './components/financeiro/financeiro';

export const routes: Routes = [

  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    component: Auth,
    children: [
      { path: 'login', component: LoginForm },
      { path: 'cadastro', component: RegisterForm },
      { path: 'endereco', component: Endereco },
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
      { path: 'relatorios', component: Relatorios },
      { path: 'suporte', component: Suporte },
      { path: 'financeiro', component: Financeiro}
    ]
  },

  { path: '**', redirectTo: 'auth/login' }
];
