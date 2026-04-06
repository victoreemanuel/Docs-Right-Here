import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' 
})
export class CardService {

  private listaCards: any[] = [];

  constructor() { }

  adicionarCard(card: any) {
    this.listaCards.push(card);
    console.log('Cards salvos no Service:', this.listaCards);
  }

  getCards() {
    return this.listaCards;
  }
}