import { Routes } from '@angular/router';
import { MeusCards } from './meus-cards/meus-cards';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard},
  { path: 'meus-cards', component: MeusCards }
];