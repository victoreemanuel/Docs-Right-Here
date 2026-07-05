import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardsService } from './cardservice';
import { Card, CardArquivo } from '../../models/card-model';

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

  meusCards: Card[] = [];
  cardsExcluidos: Card[] = [];
  cardSelecionado: Card | null = null;

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

  constructor(
    private cardService: CardsService,
    private detectorDeAlteracoes: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.carregarCardsAtivos();
    this.carregarCardsExcluidos();
  }

  carregarCardsAtivos() {
    this.cardService.getCards().subscribe({
      next: (dados) => {
        this.meusCards = dados;

        this.detectorDeAlteracoes.detectChanges();
      },
      error: (erro) => console.error('Erro ao carregar cards ativos:', erro)
    });
  }

  carregarCardsExcluidos() {
    this.cardService.getCardsExcluidos().subscribe({
      next: (dados) => {
        this.cardsExcluidos = dados;
        this.detectorDeAlteracoes.detectChanges();
      },
      error: (erro) => console.error('Erro ao carregar lixeira:', erro)
    });
  }

  abrirJanelaCriar() { this.exibirJanelaCriar = true; }
  abrirJanelaAcessar() { this.exibirJanelaAcessar = true; }
  abrirJanelaExcluir() { this.exibirJanelaExcluir = true; }
  abrirJanelaCards() { this.exibirJanelaCards = true; }

  criarNovoCard() {

    if (!this.novoTitulo.trim() || !this.novaDescricao.trim()) {
      console.warn("Não é possível criar um card com campos vazios!");
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

        this.detectorDeAlteracoes.detectChanges();
      },
      error: (erro) => console.error('Erro ao salvar card:', erro)
    });
  }

  excluirCard(card: any) {

    console.log('Objeto recebido no excluirCard:', card);

    if (!card || !card.id) {
      console.error('Erro: O botão do HTML passou um dado inválido ou sem ID!', card);
      alert('Erro no HTML: O botão de excluir passou um índice ou texto em vez do objeto do Card completo.');
      return;
    }

    this.cardService.moverParaLixeira(card.id).subscribe({
      next: () => {

        this.meusCards = this.meusCards.filter(item => item.id !== card.id);

        this.cardsExcluidos.unshift(card);

        this.detectorDeAlteracoes.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao mover para a lixeira:', erro);
        alert('Não foi possível excluir o card no servidor.');
      }
    });
  }

  abrirCard(card: Card) {
    this.cardSelecionado = card;
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

  verArquivo(arquivo: CardArquivo) { 
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

  recuperarCard(card: any) {
    if (card && card.id) {
      this.cardService.recuperarCard(card.id).subscribe({
        next: () => {

          this.cardsExcluidos = this.cardsExcluidos.filter(item => item.id !== card.id);

          this.meusCards.unshift(card);

          this.detectorDeAlteracoes.detectChanges();

        },
        error: (erro) => console.error('Erro ao restaurar card:', erro)
      });
    }
  }

  deletarPermanente(card: any) {
    if (card && card.id) {
      this.cardService.deletarPermanente(card.id).subscribe({
        next: () => {

          this.cardsExcluidos = this.cardsExcluidos.filter(item => item.id !== card.id);

          this.detectorDeAlteracoes.detectChanges();
        },
        error: (erro) => console.error('Erro ao deletar permanentemente:', erro)
      });
    }
  }
}