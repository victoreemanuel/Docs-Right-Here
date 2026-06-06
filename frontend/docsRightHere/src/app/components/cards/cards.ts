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

  criarNovoCard() {

    const cardCriado = {

      titulo: this.novoTitulo,
      descricao: this.novaDescricao

    };

    this.meusCards.push(cardCriado);

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
    this.exibirJanelaCards;
  }

}
