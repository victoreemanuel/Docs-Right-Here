import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AvisoService } from '../../services/aviso-service';
import { WebsocketService } from '../../services/websocket-service';
import { AvisoEvento, AvisoVisibilidade, CreateAviso, RequestAviso, UpdateAviso } from '../../models/avisos';

export interface Aviso {
  id: number;
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
export class Mural implements OnInit, OnDestroy {

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

  private wsSubscription?: Subscription;

  constructor(
    private avisoService: AvisoService,
    private websocketService: WebsocketService
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit chamado'); // linha temporária de debug
    this.carregarDadosIniciais();
    this.carregarHistorico();
    this.escutarWebSocket();
  }

  ngOnDestroy(): void {
    this.wsSubscription?.unsubscribe();
  }

  // ---------- Carregamento inicial via API ----------

  carregarDadosIniciais() {
    this.avisoService.listarAvisos(false).subscribe({
      next: (avisos) => {
        this.listaCompleta = avisos.map(a => this.mapearParaAviso(a));
        this.filtrar(this.filtroAtivo);
      },
      error: (err) => console.error('Erro ao carregar avisos', err)
    });
  }

  carregarHistorico() {
    this.avisoService.listarAvisos(true).subscribe({
      next: (avisos) => {
        this.historicoAvisos = avisos.map(a => this.mapearParaAviso(a));
      },
      error: (err) => console.error('Erro ao carregar histórico', err)
    });
  }

  // ---------- WebSocket ----------

  escutarWebSocket() {
    this.wsSubscription = this.websocketService.onEvento().subscribe((evento: AvisoEvento) => {
      switch (evento.tipo) {
        case 'CRIADO':
          this.tratarCriado(evento);
          break;
        case 'MOVIDO_PARA_LIXEIRA':
          this.tratarMovidoParaLixeira(evento);
          break;
        case 'RESTAURADO':
          this.tratarRestaurado(evento);
          break;
        case 'EXCLUIDO':
          this.tratarExcluido(evento);
          break;
      }
    });
  }

  private tratarCriado(evento: AvisoEvento) {
    const jaExiste = this.listaCompleta.some(a => a.id === evento.avisoId);
    if (jaExiste) return;

    const novo = this.mapearParaAviso(evento.aviso);
    this.listaCompleta.unshift(novo);
    this.filtrar(this.filtroAtivo);
  }

  private tratarMovidoParaLixeira(evento: AvisoEvento) {
    const aviso = this.listaCompleta.find(a => a.id === evento.avisoId);
    this.listaCompleta = this.listaCompleta.filter(a => a.id !== evento.avisoId);
    this.filtrar(this.filtroAtivo);

    if (aviso) {
      const jaNoHistorico = this.historicoAvisos.some(a => a.id === evento.avisoId);
      if (!jaNoHistorico) {
        this.historicoAvisos.unshift(aviso);
      }
    } else {
      const doEvento = this.mapearParaAviso(evento.aviso);
      const jaNoHistorico = this.historicoAvisos.some(a => a.id === evento.avisoId);
      if (!jaNoHistorico) {
        this.historicoAvisos.unshift(doEvento);
      }
    }
  }

  private tratarRestaurado(evento: AvisoEvento) {
    this.historicoAvisos = this.historicoAvisos.filter(a => a.id !== evento.avisoId);

    const jaExiste = this.listaCompleta.some(a => a.id === evento.avisoId);
    if (!jaExiste) {
      const restaurado = this.mapearParaAviso(evento.aviso);
      this.listaCompleta.unshift(restaurado);
      this.filtrar(this.filtroAtivo);
    }
  }

  private tratarExcluido(evento: AvisoEvento) {
    this.historicoAvisos = this.historicoAvisos.filter(a => a.id !== evento.avisoId);
    this.listaCompleta = this.listaCompleta.filter(a => a.id !== evento.avisoId);
    this.filtrar(this.filtroAtivo);
  }

  // ---------- Mapeamento DTO -> modelo de tela ----------

  private mapearParaAviso(dto: RequestAviso): Aviso {
    return {
      id: dto.id,
      titulo: dto.titulo,
      criador: dto.nome_criador,
      cargo: this.mapearVisibilidadeParaCargo(dto.visibilidade),
      descricao: dto.descricao,
      data: 'Validade: ' + this.formatarData(dto.exp),
      dataValidade: dto.exp,
      visibilidade: dto.visibilidade,
      visualizado: dto.visualizado
    };
  }

  private mapearVisibilidadeParaCargo(visibilidade: AvisoVisibilidade): 'professor' | 'secretaria' | 'diretor' {
    switch (visibilidade) {
      case AvisoVisibilidade.PROFESSORES: return 'professor';
      case AvisoVisibilidade.SECRETARIA: return 'secretaria';
      case AvisoVisibilidade.DIRETORES: return 'diretor';
      default: return 'professor';
    }
  }

  private formatarData(dataIso: string): string {
    if (!dataIso) return '';
    const partes = dataIso.split('-');
    if (partes.length !== 3) return dataIso;
    return partes[2] + '/' + partes[1] + '/' + partes[0];
  }

  // ---------- Ações do usuário ----------

  marcarComoVisualizado(aviso: Aviso) {
    aviso.visualizado = !aviso.visualizado;
    // Endpoint de "visto" está comentado no backend; mantém apenas estado local por enquanto.
  }

  excluirAviso(aviso: Aviso) {
    const payload: UpdateAviso = { aviso_id: aviso.id };
    this.avisoService.deletarAviso(payload).subscribe({
      next: () => {
        // Atualização real acontece via evento WebSocket (MOVIDO_PARA_LIXEIRA/EXCLUIDO)
      },
      error: (err) => console.error('Erro ao excluir aviso', err)
    });
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
    const payload: UpdateAviso = { aviso_id: aviso.id };
    this.avisoService.restaurarAviso(payload).subscribe({
      next: () => {
        // Atualização real acontece via evento WebSocket (RESTAURADO)
      },
      error: (err) => console.error('Erro ao restaurar aviso', err)
    });
  }

  deletarDefinitivamente(aviso: Aviso) {
    const confirmou = confirm('Deseja mesmo apagar o aviso "' + aviso.titulo + '" para sempre?');
    if (confirmou) {
      const payload: UpdateAviso = { aviso_id: aviso.id };
      this.avisoService.deletarAviso(payload).subscribe({
        next: () => {
          // Backend exclui definitivamente quando já está na lixeira (EXCLUIDO)
        },
        error: (err) => console.error('Erro ao excluir definitivamente', err)
      });
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

    const payload: CreateAviso = {
      titulo: this.novoAviso.titulo,
      descricao: this.novoAviso.descricao,
      exp: dataFinal,
      visibilidade: this.mapearVisibilidadeForm(this.novoAviso.visibilidade)
    };

    this.avisoService.criarAviso(payload).subscribe({
      next: () => {
        // Atualização real acontece via evento WebSocket (CRIADO)
        this.fecharNovoAviso();
      },
      error: (err) => {
        console.error('Erro ao criar aviso', err);
        alert('Não foi possível criar o aviso.');
      }
    });
  }

  private mapearVisibilidadeForm(valorSelect: string): AvisoVisibilidade {
    switch (valorSelect) {
      case 'professores': return AvisoVisibilidade.PROFESSORES;
      case 'secretaria': return AvisoVisibilidade.SECRETARIA;
      case 'diretor': return AvisoVisibilidade.DIRETORES;
      default: return AvisoVisibilidade.TODOS;
    }
  }

  private resetarFormulario(): Aviso {
    return {
      id: 0,
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