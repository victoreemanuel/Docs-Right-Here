import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-todos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-todos.html',
  styleUrl: './card-todos.css'
})
export class CardTodosComponent {
  @Input() meusCards: any[] = [];

  @Input() exibirJanelaAcessar: boolean = false; // 👈 MATA O ERRO DO Can't bind to 'exibirJanelaAcessar'
  @Output() exibirJanelaAcessarChange = new EventEmitter<boolean>();

  @Output() onExcluir = new EventEmitter<any>();
  @Output() onAbrir = new EventEmitter<any>();

  excluirCard(card: any) { this.onExcluir.emit(card); }
  abrirCard(card: any) { this.onAbrir.emit(card); }
}