import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CardService } from './card.service';

@Component({
  selector: 'app-meus-cards',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meus-cards.html',
  styleUrl: './meus-cards.css',
})
export class MeusCards {
  private cardService = inject(CardService);

  mostrarForm = false;

  meuFormulario = new FormGroup({
    titulo: new FormControl('', [Validators.required, Validators.minLength(3)]),
    tag: new FormControl('', [Validators.required])
  });

  get titulo() { return this.meuFormulario.get('titulo'); }
  get tag() { return this.meuFormulario.get('tag'); }

  abrirForm() { 
    this.mostrarForm = true; 
  }

  cancelar() {
    this.mostrarForm = false;
    this.meuFormulario.reset(); 
  }

  salvarCard() {
    this.meuFormulario.markAllAsTouched();


    if (this.meuFormulario.valid) {
      this.cardService.adicionarCard(this.meuFormulario.value).subscribe({
        next: (response) => {
          console.log('Salvo com sucesso!', response);
          this.mostrarForm = false;
          this.meuFormulario.reset(); 
        },
        error: (err) => {
          console.error('Erro de conexão:', err);
          alert('Não foi possível salvar. Verifique se o servidor está rodando.');
        }
      });
    }
  }
}
