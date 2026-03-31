import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'; 

@Component({
  selector: 'app-meus-cards',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],  // CommonModule - Essa função é um recuso do angular para ele ensinar como o angular deve se comportar ao tentar se comunicar com html como fechar ou abrir um botão
  templateUrl: './meus-cards.html',
  styleUrl: './meus-cards.css',
})


export class MeusCards {
  mostrarForm = false;

  meuFormulario = new FormGroup({
    titulo: new FormControl(''), 
    tag: new FormControl('')     
  });

  abrirForm() {
    this.mostrarForm = true;
  }

  cancelar() {
    this.mostrarForm = false;
  }

  salvarCard() {
    console.log(this.meuFormulario.value);
    this.mostrarForm = false; 
  }
}