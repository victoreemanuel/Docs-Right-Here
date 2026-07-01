import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Aviso {
  titulo: string;
  criador: string;
  cargo: 'professor' | 'secretaria' | 'diretor';
  descricao: string;
  data: string;
  dataValidade: string;
  visibilidade: string;
  visualizado: boolean;
}

@Component({
  selector: 'app-mural',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mural.html',
  styleUrls: ['./mural.css']
})
export class Mural implements OnInit {

  usuarioLogado = {
    nome: 'Paula Schmitt',
    role: 'professor'
  };

  listaCompleta: Aviso[] = [];
  avisosExibidos: Aviso[] = [];
  historicoAvisos: Aviso[] = [];

  filtroAtivo: string = 'todos';
  exibirModal: boolean = false;
  exibirModalHistorico: boolean = false;
  tipoPrazoSelecionado: 'botoes' | 'calendario' = 'botoes';
  prazoDiasRapido: number = 2;
  novoAviso: Aviso = this.resetarFormulario();

  ngOnInit(): void {
    this.carregarDadosIniciais();
    this.verificarAvisosExpirados();
  }

  carregarDadosIniciais() {
    this.listaCompleta = [
      {
        titulo: 'Agendamento - Prova',
        criador: 'Professora Paula',
        cargo: 'professor',
        descricao: 'Prova de Literatura',
        data: 'Validade: 14/06/2026',
        dataValidade: '2026-06-14',
        visibilidade: 'todos',
        visualizado: false
      },
      {
        titulo: 'Reunião Geral',
        criador: 'Diretor Carlos',
        cargo: 'diretor',
        descricao: 'Alinhamento pedagógico no auditório',
        data: 'Validade: 20/06/2026',
        dataValidade: '2026-06-20',
        visibilidade: 'todos',
        visualizado: false
      }
    ];
    this.avisosExibidos = this.listaCompleta.slice();
  }

  verificarAvisosExpirados() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const ativos: Aviso[] = [];

    for (let aviso of this.listaCompleta) {
      const limite = new Date(aviso.dataValidade + 'T23:59:59');
      if (limite < hoje) {
        this.historicoAvisos.push(aviso);
      } else {
        ativos.push(aviso);
      }
    }

    this.listaCompleta = ativos;
    this.filtrar(this.filtroAtivo);
  }

  marcarComoVisualizado(aviso: Aviso) {
    aviso.visualizado = !aviso.visualizado;
  }

  excluirAviso(aviso: Aviso) {
    this.historicoAvisos.unshift(aviso);
    this.listaCompleta = this.listaCompleta.filter(a => a !== aviso);
    this.filtrar(this.filtroAtivo);
  }

  filtrar(tipo: string) {
    this.filtroAtivo = tipo;
    if (tipo === 'todos') {
      this.avisosExibidos = this.listaCompleta.slice();
    } else {
      this.avisosExibidos = this.listaCompleta.filter(a => a.cargo === tipo);
    }
  }

  abrirHistorico() {
    this.exibirModalHistorico = true;
  }

  fecharHistorico() {
    this.exibirModalHistorico = false;
  }

  recuperarAviso(aviso: Aviso) {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    aviso.dataValidade = amanha.toISOString().split('T')[0];
    aviso.data = 'Validade: ' + amanha.toLocaleDateString('pt-BR');
    this.listaCompleta.unshift(aviso);
    this.historicoAvisos = this.historicoAvisos.filter(a => a !== aviso);
    this.filtrar(this.filtroAtivo);
  }

  deletarDefinitivamente(aviso: Aviso) {
    const confirmou = confirm('Deseja mesmo apagar o aviso "' + aviso.titulo + '" para sempre?');
    if (confirmou) {
      this.historicoAvisos = this.historicoAvisos.filter(a => a !== aviso);
    }
  }

  abrirNovoAviso() {
    this.exibirModal = true;
  }

  fecharNovoAviso() {
    this.exibirModal = false;
    this.novoAviso = this.resetarFormulario();
    this.tipoPrazoSelecionado = 'botoes';
    this.prazoDiasRapido = 2;
  }

  salvarNovoAviso() {
    if (!this.novoAviso.titulo || !this.novoAviso.descricao) {
      alert('Preencha o título e a descrição!');
      return;
    }

    let dataFinal = '';

    if (this.tipoPrazoSelecionado === 'botoes') {
      const dataCalculada = new Date();
      dataCalculada.setDate(dataCalculada.getDate() + this.prazoDiasRapido);
      dataFinal = dataCalculada.toISOString().split('T')[0];
    } else {
      if (!this.novoAviso.dataValidade) {
        alert('Por favor, selecione uma data no calendário!');
        return;
      }
      dataFinal = this.novoAviso.dataValidade;
    }

    const partes = dataFinal.split('-');
    const dataFormatada = partes[2] + '/' + partes[1] + '/' + partes[0];

    const avisoNovo: Aviso = {
      titulo: this.novoAviso.titulo,
      descricao: this.novoAviso.descricao,
      visibilidade: this.novoAviso.visibilidade,
      dataValidade: dataFinal,
      data: 'Validade: ' + dataFormatada,
      criador: this.usuarioLogado.nome,
      cargo: this.usuarioLogado.role as any,
      visualizado: false
    };

    this.listaCompleta.unshift(avisoNovo);
    this.filtrar(this.filtroAtivo);
    this.fecharNovoAviso();
  }

  private resetarFormulario(): Aviso {
    return {
      titulo: '',
      criador: '',
      cargo: 'professor',
      descricao: '',
      data: '',
      dataValidade: '',
      visibilidade: 'todos',
      visualizado: false
    };
  }
}
