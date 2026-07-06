import { AvisoCalendario, AvisoDetalhe } from '../../models/avisos';
import { CalendarioService } from './../../services/calendario.service';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendario',
  imports: [],
  standalone: true,
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class Calendario implements OnInit{
  private calendarioService = inject(CalendarioService);

  avisosDoMes: AvisoCalendario [] = [];
  eventosDoDiaClicado: AvisoDetalhe [] = [];

  mesAtual: number = 7;
  anoAtual: number = 2026;

  diasDoMes: number[] = [];

  diaSelecionado: number | null = null;
  nomeDoMes: string = '';

  ngOnInit(){
    this.atualizarNomeDoMes();
    this.gerarDiasMes();
    this.carregarBolinhaDoMes();
  }

  atualizarNomeDoMes() {
    const data = new Date(this.anoAtual, this.mesAtual - 1);
    this.nomeDoMes = data.toLocaleString('pt-BR', { month: 'long' });
  }

  mudarMes(delta: number) {
    this.mesAtual += delta;

    // Se passou de dezembro, vai pro ano que vem
    if (this.mesAtual > 12) {
      this.mesAtual = 1;
      this.anoAtual++;
    }
    // Se voltou antes de janeiro, vai pro ano passado
    else if (this.mesAtual < 1) {
      this.mesAtual = 12;
      this.anoAtual--;
    }

    this.atualizarNomeDoMes();
    this.gerarDiasMes();
    this.carregarBolinhaDoMes(); // Busca as bolinhas do novo mês!
  }

  irParaHoje() {
    const hoje = new Date();
    this.mesAtual = hoje.getMonth() + 1;
    this.anoAtual = hoje.getFullYear();

    this.atualizarNomeDoMes();
    this.gerarDiasMes();
    this.carregarBolinhaDoMes();

    // Já deixa o dia de hoje selecionado
    this.selecionarDia(hoje.getDate());
  }

  selecionarDia(dia: number) {
    this.diaSelecionado = dia; // Marca o dia para o HTML pintar de azul

    // Formata a data para buscar os detalhes na API (ex: "2026-07-04")
    const mesFormatado = this.mesAtual.toString().padStart(2, '0');
    const diaFormatado = dia.toString().padStart(2, '0');
    const dataExata = `${this.anoAtual}-${mesFormatado}-${diaFormatado}`;

    this.clicarNoDia(dataExata); // Chama a função que você já tinha criado!
  }

  gerarDiasMes(){
    const totalDias = new Date(this.anoAtual, this.mesAtual, 0).getDate();
    this.diasDoMes = Array.from({length: totalDias}, (_, i) => i + 1);
  }

  carregarBolinhaDoMes(){
    this.calendarioService.buscarAvisosDoMes(this.mesAtual, this.anoAtual)
      .subscribe({
        next: (dados) => {
          this.avisosDoMes = dados;
        },
        error: (erro) => console.error('Erro ao buscar calendário', erro)
      });
  }

  clicarNoDia(diaClicado: string){
    this.calendarioService.buscarDetalhesDoDia(diaClicado)
      .subscribe({
        next: (detalhes) => {
          this.eventosDoDiaClicado = detalhes;
        },
        error: (erro) => console.error('Erro ao buscar detalhes', erro)
      });
  }

  verificarSeTemAvisoNoDia(dia: number): string[] {
    // Formata o mês e dia para sempre ter dois dígitos (ex: "07", "04")
    const mesFormatado = this.mesAtual.toString().padStart(2, '0');
    const diaFormatado = dia.toString().padStart(2, '0');
    const dataExata = `${this.anoAtual}-${mesFormatado}-${diaFormatado}`;

    const aviso = this.avisosDoMes.find(a => a.data === dataExata);

    return aviso ? aviso.visibilidade : [];
  }
}
