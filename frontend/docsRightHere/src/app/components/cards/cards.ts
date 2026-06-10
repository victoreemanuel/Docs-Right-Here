import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-meus-cards',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})

export class Cards {

  exibirJanelaAcessar: boolean = false;
  exibirJanelaCriar: boolean = false;
  exibirJanelaExcluir: boolean = false;
  exibirJanelaCards: boolean = false;

  constructor() { }

  abrirJanelaCriar() {
    this.exibirJanelaCriar = true;
  }

  abrirJanelaAcessar() {
    this.exibirJanelaAcessar = true;
  }

  abrirJanelaExcluir() {
    this.exibirJanelaExcluir = true;
  }

  abrirJanelaCards() {
    this.exibirJanelaCards = true;
  }

  meusCards: any[] = [];

  novoTitulo: string = ' ';
  novaDescricao: string = ' ';

  arquivo: any[] = [];

  criarNovoCard() {

    const cardCriado = {

      titulo: this.novoTitulo,
      descricao: this.novaDescricao,
      arquivos: []
    };

    this.meusCards.unshift(cardCriado);
    this.cardSelecionado = cardCriado;
    this.exibirJanelaCards = true;

    this.novoTitulo = '';
    this.novaDescricao = '';
    this.exibirJanelaCriar = false;

  }

  cardSelecionado: any = null;

  excluirCard(index: number) {
    this.meusCards.splice(index, 1);
  }

  abrirCard(Card: any) {
    this.cardSelecionado = Card;
    this.exibirJanelaCards = true;
    this.modoEdicao = false;
    this.termoBuscaArquivo = '';
    this.filtroTipoSelecionado = 'TODOS';
  }

  get cardsRecentes() {
    return this.meusCards.slice(0, 8);
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

  termoBuscaArquivo: string = '';
  filtroTipoSelecionado: string = 'TODOS' ;
  exibirFiltros: boolean = false;

  modoEdicao: Boolean = false;
  tituloEdicao: string = '';
  descricaoEdicao: string = '';

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

}
