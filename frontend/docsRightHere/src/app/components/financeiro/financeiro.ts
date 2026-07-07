import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

  carregandoPlanoId: string | null = null;
  erroCheckout: string | null = null;

  private readonly apiUrl = 'https://back-end-production-fa4d.up.railway.app/api/v1/financeiro/checkout';
  // private readonly apiUrl = `${environment}/api/v1/financeiro/checkout`

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

  constructor(private http: HttpClient) {}

  onEscolherPlano(planoId: string): void {
    this.erroCheckout = null;

    // Plano Básico é gratuito, não precisa chamar o gateway de pagamento
    if (planoId === 'basico') {
      console.log('Plano básico selecionado — ativar sem checkout.');
      return;
    }

    this.carregandoPlanoId = planoId;

    this.http.post<{ urlCheckout: string }>(this.apiUrl, { planoId }).subscribe({
      next: (resposta) => {
        this.carregandoPlanoId = null;
        window.location.href = resposta.urlCheckout;
      },
      error: (erro) => {
        this.carregandoPlanoId = null;
        this.erroCheckout = 'Não foi possível iniciar o pagamento. Tente novamente em instantes.';
        console.error('Erro ao criar checkout:', erro);
      }
    });
  }

  onEntrarEmContato(): void {
    console.log('Solicitação de contato - plano exclusivo');
  }
}
