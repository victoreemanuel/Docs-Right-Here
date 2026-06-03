import { Component} from '@angular/core';

@Component({
  selector: 'app-meus-cards',
  standalone: true,
  imports: [],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})

export class Cards {

  exibirJanela: boolean = false;

  constructor(){}

  abrirJanela(){
    this.exibirJanela = true;
     
  }

}