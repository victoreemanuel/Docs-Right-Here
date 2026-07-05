import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Beneficio {
  texto: string;
  destaque?: string;
}

interface Plano {
  id: string;
  nome: string;
  recomendado?: boolean;
  anual?: boolean;
  parcelasTexto?: string;
  precoParcela?: string;
  precoVistaValor?: string;
  descontoTexto?: string;
  precoGratis?: string;
  descricaoBasico?: string;
  beneficiosTitulo: string;
  beneficios: Beneficio[];
}

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financeiro.html',
  styleUrls: ['./financeiro.css']
})
export class Financeiro {

  planos: Plano[] = [
    {
      id: 'basico',
      nome: 'Básico',
      precoGratis: 'Gratuito',
      descricaoBasico: 'Funções limitadas do sistema',
      beneficiosTitulo: 'Benefícios plano básico:',
      beneficios: [
        { texto: 'Acesso individual' },
        { texto: 'Acesso a tela mural' },
        { texto: 'Criação  de avisos' },
        { texto: 'Acesso a tela cards' },
        { texto: 'Criação de cards' }
      ]
    },
    {
      id: 'intermediario',
      nome: 'Intermediario',
      recomendado: true,
      anual: true,
      parcelasTexto: '12x de',
      precoParcela: 'R$95,65',
      precoVistaValor: 'R$1.048,00',
      descontoTexto: 'Valor cobrado no plano anual com 20% de desconto',
      beneficiosTitulo: 'Benefícios plano intermediário:',
      beneficios: [
        { texto: 'Todas funções do plano básico' },
        { texto: 'Aplicativo para celular com scanner integrado' },
        { texto: 'Compartilhamento de informações entre usuários' }
      ]
    },
    {
      id: 'profissional',
      nome: 'Profissional',
      anual: true,
      parcelasTexto: '12x de',
      precoParcela: 'R$183,26',
      precoVistaValor: 'R$2.008,00',
      descontoTexto: 'Valor cobrado no plano anual com 20% de desconto',
      beneficiosTitulo: 'Benefícios plano profissional:',
      beneficios: [
        { texto: 'Todas funções plano intermediário' },
        { texto: 'Gestão de funcionários e alunos', destaque: '(feature sendo implementada)' },
        { texto: 'IA para automação de processos' },
        { texto: 'Suporte exclusivo com treinamento' }
      ]
    }
  ];

  onEscolherPlano(planoId: string): void {
    console.log('Plano escolhido:', planoId);
  }

  onEntrarEmContato(): void {
    console.log('Solicitação de contato - plano exclusivo');
  }
}