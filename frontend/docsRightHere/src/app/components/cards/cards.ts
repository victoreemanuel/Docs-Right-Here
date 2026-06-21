import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardsService } from './cardservice';


@Component({
  selector: 'app-meus-cards',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class Cards implements OnInit {

  exibirJanelaAcessar: boolean = false;
  exibirJanelaCriar: boolean = false;
  exibirJanelaExcluir: boolean = false;
  exibirJanelaCards: boolean = false;

  meusCards: any[] = [];
  cardsExcluidos: any[] = [];
  cardSelecionado: any = null;

  novoTitulo: string = '';
  novaDescricao: string = '';

  arquivo: any[] = [];

  iconeSelecionado: string = 'bi-file-earmark-text';
  corSelecionada: string = '#3a3f44';

  termoBuscaArquivo: string = '';
  filtroTipoSelecionado: string = 'TODOS';
  exibirFiltros: boolean = false;

  modoEdicao: Boolean = false;
  tituloEdicao: string = '';
  descricaoEdicao: string = '';

  coresDisponiveis: string[] = [
    '#7b2cbf',
    '#0284c7',
    '#09d37f',
    '#f59e0b',
    '#e11d48'
  ];

  iconesDisponiveis: string[] = [
    'bi-mortarboard', 'bi-book', 'bi-calendar3', 'bi-envelope',
    'bi-camera', 'bi-eye', 'bi-file-earmark-text', 'bi-image',
    'bi-people', 'bi-person-workspace'
  ];

  constructor(private cardService: CardsService) { }

  ngOnInit() {
    this.carregarCardsAtivos();
    this.carregarCardsExcluidos();
  }

  carregarCardsAtivos() {
    this.cardService.getCards().subscribe({
      next: (dados) => this.meusCards = dados,
      error: (err) => console.error('Erro ao carregar cards ativos:', err)
    });
  }

  carregarCardsExcluidos() {
    this.cardService.getCardsExcluidos().subscribe({
      next: (dados) => this.cardsExcluidos = dados,
      error: (err) => console.error('Erro ao carregar lixeira:', err)
    });
  }

  abrirJanelaCriar() { this.exibirJanelaCriar = true; }
  abrirJanelaAcessar() { this.exibirJanelaAcessar = true; }
  abrirJanelaExcluir() { this.exibirJanelaExcluir = true; }
  abrirJanelaCards() { this.exibirJanelaCards = true; }

  criarNovoCard() {

    if (!this.novoTitulo.trim() || !this.novaDescricao.trim()) {
      console.warn("⚠️ Tentativa de criar um card com campos vazios barrada!");
      return;
    }

    const cardCriado = {
      titulo: this.novoTitulo,
      descricao: this.novaDescricao,
      icone: this.iconeSelecionado,
      cor: this.corSelecionada,
      arquivos: []
    };

    this.cardService.criarCard(cardCriado).subscribe({
      next: (cardSalvo) => {
        this.meusCards.unshift(cardSalvo);
        this.cardSelecionado = cardSalvo;
        this.exibirJanelaCards = true;

        this.novoTitulo = '';
        this.novaDescricao = '';
        this.iconeSelecionado = 'bi-file-earmark-text';
        this.corSelecionada = '#3a3f44';
        this.exibirJanelaCriar = false;
      },
      error: (err) => console.error('Erro ao salvar card:', err)
    });
  }

  excluirCard(card: any) {
    if (card && card.id) {
      this.cardService.moverParaLixeira(card.id).subscribe({
        next: () => {

          this.meusCards = this.meusCards.filter(c => c.id !== card.id);

          this.cardsExcluidos.unshift(card);
        },
        error: (err) => console.error('Erro ao mover para a lixeira:', err)
      });
    } else {
      console.warn("⚠️ Não foi possível excluir: Card não possui um ID válido no banco.");
    }
  }

  abrirCard(Card: any) {
    this.cardSelecionado = Card;
    this.exibirJanelaCards = true;
    this.modoEdicao = false;
    this.termoBuscaArquivo = '';
    this.filtroTipoSelecionado = 'TODOS';
  }

  get cardsRecentes() {
    return this.meusCards.slice(0, 4);
  }

  anexarArquivo(event: any) {
    const arquivoDoPC = event.target.files[0];

    if (arquivoDoPC && this.cardSelecionado) {
      if (!this.cardSelecionado.arquivos) {
        this.cardSelecionado.arquivos = [];
      }

      const urlRealDoArquivo = URL.createObjectURL(arquivoDoPC);
      const extensao = arquivoDoPC.name.split('.').pop()?.toUpperCase() || 'ARQUIVO';

      this.cardSelecionado.arquivos = [
        ...this.cardSelecionado.arquivos,
        { nome: arquivoDoPC.name, tipo: extensao, url: urlRealDoArquivo },
      ];

      event.target.value = '';
    }
  }

  verArquivo(arquivo: any) {
    if (arquivo.url) {
      window.open(arquivo.url, '_blank');
    } else {
      alert('Link do arquivo não encontrado.');
    }
  }

  baixarArquivo(arquivo: any) {
    if (arquivo && arquivo.url) {
      const link = document.createElement('a');
      link.href = arquivo.url;
      link.download = arquivo.nome;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  excluirArquivo(index: number) {
    if (this.cardSelecionado && this.cardSelecionado.arquivos) {
      this.cardSelecionado.arquivos.splice(index, 1);
      this.cardSelecionado.arquivos = [...this.cardSelecionado.arquivos];
    }
  }

  get arquivosFiltrados() {
    if (!this.cardSelecionado || !this.cardSelecionado.arquivos) return [];

    return this.cardSelecionado.arquivos.filter((arq: any) => {
      const bateComBusca = arq.nome.toLowerCase().includes(this.termoBuscaArquivo.toLowerCase());

      if (this.filtroTipoSelecionado === 'TODOS') {
        return bateComBusca;
      }

      const extensoesMapa: { [key: string]: string[] } = {
        'PDF': ['PDF'],
        'WORD': ['DOC', 'DOCX'],
        'EXCEL': ['XLS', 'XLSX', 'CSV'],
        'POWERPOINT': ['PPT', 'PPTX']
      };

      const listaExtensoes = extensoesMapa[this.filtroTipoSelecionado] || [];
      const bateComTipo = listaExtensoes.includes(arq.tipo.toUpperCase());

      return bateComBusca && bateComTipo;
    });
  }

  alternarEdicao() {
    if (!this.modoEdicao) {
      this.tituloEdicao = this.cardSelecionado.titulo;
      this.descricaoEdicao = this.cardSelecionado.descricao;
      this.modoEdicao = true;
    } else {
      this.cardSelecionado.titulo = this.tituloEdicao;
      this.cardSelecionado.descricao = this.descricaoEdicao;
      this.modoEdicao = false;
    }
  }

  recuperarCard(index: number) {
    const card = this.cardsExcluidos[index];

    if (card && card.id) {
      this.cardService.recuperarCard(card.id).subscribe({
        next: () => {
          const cardRestaurado = this.cardsExcluidos.splice(index, 1)[0];
          this.meusCards.unshift(cardRestaurado);
        },
        error: (err) => console.error('Erro ao restaurar card:', err)
      });
    }
  }

  deletarPermanente(index: number) {
    const card = this.cardsExcluidos[index];

    if (card && card.id) {
      this.cardService.deletarPermanente(card.id).subscribe({
        next: () => {
          this.cardsExcluidos.splice(index, 1);
        },
        error: (err) => console.error('Erro ao deletar permanentemente:', err)
      });
    }
  }
}