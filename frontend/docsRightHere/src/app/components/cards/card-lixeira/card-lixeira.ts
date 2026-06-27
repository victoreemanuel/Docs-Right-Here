import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-lixeira',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-lixeira.html',
  styleUrl: './card-lixeira.css'
})
export class CardLixeiraComponent {
  @Input() cardsExcluidos: any[] = [];

  @Input() exibirJanelaExcluir: boolean = false;
  @Output() exibirJanelaExcluirChange = new EventEmitter<boolean>();

  @Output() onDeletar = new EventEmitter<any>();
  @Output() onRecuperar = new EventEmitter<any>();

  deletarPermanente(card: any) { this.onDeletar.emit(card); }
  recuperarCard(card: any) { this.onRecuperar.emit(card); }
}