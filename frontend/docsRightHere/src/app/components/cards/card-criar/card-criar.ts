import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-criar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './card-criar.html',
  styleUrl: './card-criar.css'
})
export class CardCriarComponent {
  @Input() iconesDisponiveis: string[] = [];
  @Input() coresDisponiveis: string[] = [];

  @Input() novoTitulo: string = '';
  @Output() novoTituloChange = new EventEmitter<string>();

  @Input() novaDescricao: string = '';
  @Output() novaDescricaoChange = new EventEmitter<string>();

  @Input() iconeSelecionado: string = '';
  @Output() iconeSelecionadoChange = new EventEmitter<string>();

  @Input() corSelecionada: string = '';
  @Output() corSelecionadaChange = new EventEmitter<string>();

  @Input() exibirJanelaCriar: boolean = false;
  @Output() exibirJanelaCriarChange = new EventEmitter<boolean>();

  @Output() fechar = new EventEmitter<void>(); 
  @Output() onCriar = new EventEmitter<void>();

  criarNovoCard() { this.onCriar.emit(); }
}