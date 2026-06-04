import { Component} from '@angular/core';

@Component({
  selector: 'app-meus-cards',
  standalone: true,
  imports: [],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})

export class Cards {

  exibirJanelaAcessar: boolean = false;
  exibirJanelaCriar: boolean = false;
  exibirJanelaExcluir: boolean = false;

  constructor(){}

  abrirJanelaCriar(){
    this.exibirJanelaCriar = true;

  }

  abrirJanelaAcessar(){
    this.exibirJanelaAcessar = true;
  }

  abrirJanelaExcluir(){
    this.exibirJanelaExcluir = true;
  }


}
