import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvisoService, Aviso } from '../../services/aviso.service';

@Component({
  selector: 'app-mural',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mural.html',
  styleUrls: ['./mural.css']
})
export class Mural implements OnInit {

  private avisoService = inject(AvisoService);

  usuarioLogado: { nome: string; role: 'professor' | 'secretaria' | 'diretor' } = {
    nome: 'Laura Silva',
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
    this.carregarAvisosDoBanco();
  }

  carregarAvisosDoBanco() {
    this.avisoService.getAvisos().subscribe({
      next: (dados) => {
        this.listaCompleta = dados;
        this.verificarAvisosExpirados();
      },
      error: (err) => console.error('Erro ao buscar avisos', err)
    });
  }

  verificarAvisosExpirados() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const ativos: Aviso[] = [];

    for (const aviso of this.listaCompleta) {
      const limite = new Date(`${aviso.dataValidade}T23:59:59`);
      if (limite < hoje) {
        this.historicoAvisos.push(aviso);
      } else {
        ativos.push(aviso);
      }
    }

    this.listaCompleta = ativos;
    this.aplicarFiltros();
  }

  marcarComoVisualizado(aviso: Aviso) {
    aviso.visualizado = !aviso.visualizado;
  }

  excluirAviso(aviso: Aviso) {
    if (!aviso.id) {
      console.warn('Não é possível excluir um aviso sem ID.');
      return;
    }

    this.avisoService.excluirAviso(aviso.id).subscribe({
      next: () => {
        this.historicoAvisos.unshift(aviso);
        this.listaCompleta = this.listaCompleta.filter(a => a.id !== aviso.id);
        this.aplicarFiltros();
      },
      error: (err) => console.error('Erro ao excluir aviso do banco:', err)
    });
  }

    filtrar(tipo: string) {
      this.filtroAtivo = tipo;
      this.aplicarFiltros();
    }

  private aplicarFiltros() {
    if (this.filtroAtivo === 'todos') {
      this.avisosExibidos = [...this.listaCompleta];
    } else {
      this.avisosExibidos = this.listaCompleta.filter(a => a.cargo === this.filtroAtivo);
    }
  }

  abrirHistorico() { this.exibirModalHistorico = true; }
  fecharHistorico() { this.exibirModalHistorico = false; }

  recuperarAviso(aviso: Aviso) {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);

    aviso.dataValidade = amanha.toISOString().split('T')[0];
    aviso.data = `Validade: ${amanha.toLocaleDateString('pt-BR')}`;

    this.avisoService.adicionarAviso(aviso).subscribe(() => {
      this.listaCompleta.unshift(aviso);
      this.historicoAvisos = this.historicoAvisos.filter(a => a.id !== aviso.id);
      this.aplicarFiltros();
    });
  }

  deletarDefinitivamente(aviso: Aviso) {
    if (confirm(`Deseja mesmo apagar o aviso "${aviso.titulo}" para sempre?`)) {
      this.historicoAvisos = this.historicoAvisos.filter(a => a.id !== aviso.id);
    }
  }

  abrirNovoAviso() { this.exibirModal = true; }

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
      dataCalculada.setDate(dataCalculada.getDate() + Number(this.prazoDiasRapido));
      dataFinal = dataCalculada.toISOString().split('T')[0];
    } else {
      if (!this.novoAviso.dataValidade) {
        alert('Por favor, selecione uma data no calendário!');
        return;
      }
      dataFinal = this.novoAviso.dataValidade;
    }

    const partes = dataFinal.split('-');
    const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;

    const avisoNovo: Aviso = {
      ...this.novoAviso,
      id: Date.now().toString(),
      dataValidade: dataFinal,
      data: `Validade: ${dataFormatada}`,
      criador: this.usuarioLogado.nome,
      cargo: this.usuarioLogado.role
    };

    this.avisoService.adicionarAviso(avisoNovo).subscribe((avisoCriadoBase) => {
      this.listaCompleta.unshift(avisoCriadoBase);
      this.aplicarFiltros();
      this.fecharNovoAviso();
    });
  }

  private resetarFormulario(): Aviso {
    return {
      id: '',
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