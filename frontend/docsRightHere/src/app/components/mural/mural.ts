import { AvisoService } from './../../services/aviso-service';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvisoVisibilidade, CreateAviso, RequestAviso, UpdateAviso } from '../../models/avisos';


@Component({
  selector: 'app-mural',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mural.html',
  styleUrls: ['./mural.css']
})
export class Mural implements OnInit, OnDestroy {
  private readonly avisoService = inject(AvisoService);

  ngOnInit(): void {
    this.loadAvisos();
    this.loadHistorico();
  }

  ngOnDestroy(): void {
    // ws desconect aqui
  }

  listaAvisos = signal<RequestAviso[]>([]);
  listaAvisosHistorico = signal<RequestAviso[]>([]);


  filtroAtivo: string = 'todos';
  exibirModal: boolean = false;
  exibirModalHistorico: boolean = false;
  tipoPrazoSelecionado: 'botoes' | 'calendario' = 'botoes';
  prazoDiasRapido: number = 2;
  novoAviso: CreateAviso = this.resetarFormulario();
  usuarioLogado = {
    nome: 'Paula Schmitt',
    role: 'professor'
  };


// METODOS REST
  loadAvisos() {
    this.avisoService.listarAvisos(false).subscribe({
      next: (response) => this.listaAvisos.set(response),
      error: (er) => console.log(er)
    });
  }

  loadHistorico(){
    this.avisoService.listarAvisos(true).subscribe({
      next: (response) => this.listaAvisosHistorico.set(response),
      error: (er) => console.log(er)
    });
  }

  excluirAviso(avisoId: number) {
    const aviso: UpdateAviso = {aviso_id: avisoId};
    this.avisoService.deletarAviso(aviso).subscribe({
      next: (res) => this.moverParaHistorico(res.id, res),
      error: (er) => console.log(er)
    });
  }

  deletarDefinitivamente(avisoId: number) {
    const aviso: UpdateAviso = {aviso_id: avisoId};
    this.avisoService.deletarAviso(aviso).subscribe({
      next: () => this.removerDoHistorico(avisoId),
      error: (er) => console.log(`ER: ${er}`)
    });
  }

  recuperarAviso(avisoId: number){
    this.avisoService.restaurarAviso({aviso_id: avisoId}).subscribe({
      next: () => this.restaurarDoHistorico(avisoId),
      error: (er) => console.log(er)
    });
  }

  salvarNovoAviso() {
    const avisoNovo = this.montarAviso()
    if (!avisoNovo){
      alert("Por favor, revise o aviso");
      return;
    }

    this.avisoService.criarAviso(avisoNovo).subscribe({
      next: (response) => {
        this.adicionarAvisoNaLista(response);
      },
      error: (er) => {
        console.log(er);
        alert("Verifique a conexão com a internet!");
      }
    });

    this.fecharNovoAviso();
  }






  // Metodos aux para REST e ws
  moverParaHistorico(id:number, avisoCompleto?:RequestAviso){
    const lista = this.listaAvisos()
    const index = lista.findIndex(i => i.id == id);
    let aviso: RequestAviso | undefined;

    if (index !== -1){
      aviso = { ...lista[index], na_lixeira: true};
      this.listaAvisos.update(l => l.filter(i => i.id !== id));
    } else if (avisoCompleto) {
      aviso = avisoCompleto;
    }

    if (!aviso) return;

    const estaNoHistorico = this.listaAvisosHistorico().some(i => i.id === id);
    if(!estaNoHistorico){
      this.listaAvisosHistorico.update(h => [aviso, ...h])
    }
  }

  removerDoHistorico(id: number){
    this.listaAvisosHistorico.update(h => h.filter(i => i.id !== id));
  }

  restaurarDoHistorico(id: number){
    const lista = this.listaAvisosHistorico();
    const avisoRestaurar = lista.find(i => i.id === id);

    if (!avisoRestaurar) return;

    const avisoAtualizado = { ...avisoRestaurar, na_lixeira: false};

    this.listaAvisosHistorico.update(h =>
      h.filter(i => i.id !== id)
    );
    const estaNosAvisos = this.listaAvisos().some(i => i.id === id);
    if (!estaNosAvisos){
      this.listaAvisos.update(l => [avisoAtualizado, ...l]);
    }
  }

  montarAviso(): CreateAviso | null{
    if (!this.novoAviso.titulo || !this.novoAviso.descricao) {
      alert('Preencha o título e a descrição!');
      return null;
    }

    let dataFinal = '';

    if (this.tipoPrazoSelecionado === 'botoes') {
      const dataCalculada = new Date();
      dataCalculada.setDate(dataCalculada.getDate() + this.prazoDiasRapido);
      dataFinal = dataCalculada.toISOString().split('T')[0];
    } else {
      if (!this.novoAviso.exp) {
        alert('Por favor, selecione uma data no calendário!');
        return null;
      }
      dataFinal = this.novoAviso.exp;
    }

    const partes = dataFinal.split('-');
    const dataFormatada = partes[2] + '/' + partes[1] + '/' + partes[0];

    const avisoNovo: CreateAviso = {
      titulo: this.novoAviso.titulo,
      descricao: this.novoAviso.descricao,
      visibilidade: this.novoAviso.visibilidade,
      exp: dataFinal,
    };
    return avisoNovo;
  }

  adicionarAvisoNaLista(aviso: RequestAviso){
    const existe = this.listaAvisos().some(i => i.id === aviso.id);
    if (existe) return;
    this.listaAvisos.update(l => [aviso, ...l]);
  }










// ESTE PERMANECE
  abrirHistorico() {
    this.exibirModalHistorico = true;
  }

  fecharHistorico() {
    this.exibirModalHistorico = false;
  }

  abrirNovoAviso() {
    this.exibirModal = true;
  }

  fecharNovoAviso() {
    this.exibirModal = false;
    this.novoAviso = this.resetarFormulario();
    this.tipoPrazoSelecionado = 'botoes';
    this.prazoDiasRapido = 2;
  }
// -------------------------------------
// ESSE TEM INTERAÇÃO


  marcarComoVisualizado(avisoId: number) {
    // Desativado por enquanto
  }







// -------------------------------------




// Ainda não sei esses aqui v
  private resetarFormulario(): CreateAviso {
    return{
        titulo: '',
        descricao: '',
        exp: '',
        visibilidade: AvisoVisibilidade.TODOS
    }
  }

    filtrar(tipo: string) {
      return;
    // this.filtroAtivo = tipo;
    // if (tipo === 'todos') {
    //   this.avisosExibidos = this.listaCompleta.slice();
    // } else {
    //   this.avisosExibidos = this.listaCompleta.filter(a => a.cargo === tipo);
    // }
  }
}
