import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; 

@Component({
  selector: 'app-meus-cards',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meus-cards.html',
  styleUrl: './meus-cards.css',
})
export class MeusCards {
  mostrarForm = false;


  meuFormulario = new FormGroup({
    titulo: new FormControl('', [
      Validators.required, 
      Validators.minLength(3)
    ]), 
    tag: new FormControl('', [
      Validators.required
    ])     
  });

  get titulo() { return this.meuFormulario.get('titulo'); }
  get tag() { return this.meuFormulario.get('tag'); }

  abrirForm() { this.mostrarForm = true; }

  cancelar() {
    this.mostrarForm = false;
    this.meuFormulario.reset(); 
  }

  salvarCard() {
    if (this.meuFormulario.valid) {
      console.log(this.meuFormulario.value);
      this.mostrarForm = false;
      this.meuFormulario.reset();
    } else {
      this.meuFormulario.markAllAsTouched();
    }
  }
}