import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-abrir',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './card-abrir.html',
  styleUrl: './card-abrir.css'
})
export class CardAbrirComponent {
  @Input() cardSelecionado: any;
  @Input() arquivosFiltrados: any[] = [];

  @Input() modoEdicao: boolean = false;
  @Output() modoEdicaoChange = new EventEmitter<boolean>();

  @Input() tituloEdicao: string = '';
  @Output() tituloEdicaoChange = new EventEmitter<string>();

  @Input() descricaoEdicao: string = '';
  @Output() descricaoEdicaoChange = new EventEmitter<string>();

  @Input() termoBuscaArquivo: string = '';
  @Output() termoBuscaArquivoChange = new EventEmitter<string>();

  @Input() exibirFiltros: boolean = false;
  @Output() exibirFiltrosChange = new EventEmitter<boolean>();

  @Input() filtroTipoSelecionado: string = '';
  @Output() filtroTipoSelecionadoChange = new EventEmitter<string>();

  @Input() exibirJanelaCards: boolean = false;
  @Output() exibirJanelaCardsChange = new EventEmitter<boolean>();

  @Output() onBaixar = new EventEmitter<any>();
  @Output() onVer = new EventEmitter<any>();
  @Output() onExcluirArq = new EventEmitter<number>();
  @Output() onAnexar = new EventEmitter<any>();
  @Output() onAlternarEdicao = new EventEmitter<void>();

  baixarArquivo(arquivo: any) { this.onBaixar.emit(arquivo); }
  verArquivo(arquivo: any) { this.onVer.emit(arquivo); }
  excluirArquivo(index: number) { this.onExcluirArq.emit(index); }
  anexarArquivo(event: any) { this.onAnexar.emit(event); }
  alternarEdicao() { this.onAlternarEdicao.emit(); }
}