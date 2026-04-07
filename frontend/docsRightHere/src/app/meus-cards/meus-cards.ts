import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // CommonModule - Essa função é um recuso do angular para ele ensinar como o angular deve se comportar ao tentar se comunicar com html como fechar ou abrir um botão.
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CardService } from './card.service';

@Component({
  selector: 'app-meus-cards',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meus-cards.html',
  styleUrl: './meus-cards.css',
})

export class MeusCards implements OnInit {

  private cardService = inject(CardService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  idParaEdicao: string | null = null;
  mostrarForm = false;

  meuFormulario = new FormGroup({
    titulo: new FormControl('', [Validators.required, Validators.minLength(3)]),
    tag: new FormControl('', [Validators.required])
  });

  get titulo() { return this.meuFormulario.get('titulo'); }
  get tag() { return this.meuFormulario.get('tag'); }

  ngOnInit() { // Assim que componente é criado ele é chamado. Ele busca ID pela URL para carregar algo na página.

    this.idParaEdicao = this.route.snapshot.paramMap.get('id'); // Aqui vai extair o valor do parâmetro que defini no id

    if (this.idParaEdicao) {

      this.mostrarForm = true;

      this.cardService.buscarPorId(this.idParaEdicao).subscribe({
        next: (card) => {
          this.meuFormulario.patchValue(card); // faz o envio para os campos que vem da api para formulario.
        },
        error: () => alert('Erro ao carregar dados para edição.')
      });

    }

  }

  salvarCard() {

    this.meuFormulario.markAllAsTouched();

    if (this.meuFormulario.valid) {
      const servico = this.idParaEdicao
        ? this.cardService.atualizarCard(this.idParaEdicao, this.meuFormulario.value)
        : this.cardService.adicionarCard(this.meuFormulario.value);

      servico.subscribe({
        next: () => {
          console.log('Operação realizada com sucesso!');
          this.cancelar();
        },
        error: () => alert('Erro ao salvar as alterações.')
      });
    }
  }

  cancelar() {
    this.mostrarForm = false;
    this.idParaEdicao = null;
    this.meuFormulario.reset();
    this.router.navigate(['/Auth1/meus-cards']);
  }

  abrirForm() { this.mostrarForm = true; }

  excluirCard(id: string) {
    if (confirm('Tem certeza que deseja excluir este card?')) {
      this.cardService.removerCard(id).subscribe({
        next: () => {
          console.log('Card removido!');
        },
        error: () => alert('Erro ao tentar excluir o card.')
      });
    }
  }

}