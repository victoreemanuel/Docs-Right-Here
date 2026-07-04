import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-register-form',
  imports: [FormsModule, ReactiveFormsModule, NgxMaskDirective, RouterLink],
  providers: [provideNgxMask()], // 👈 Correção: Adicionados os parênteses () para executar a função do provider
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {

  formCadastro = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cpf: new FormControl('', [Validators.required, Validators.pattern(/^\d{11}$/)]),
    dataNascimento: new FormControl('', [Validators.required, Validators.minLength(8)]),
    celular: new FormControl('', [Validators.required, Validators.minLength(10)]),
  })

  get nome() { return this.formCadastro.get('nome') }
  get cpf() { return this.formCadastro.get('cpf') }
  get dataNascimento() { return this.formCadastro.get('dataNascimento') }
  get celular() { return this.formCadastro.get('celular') }

  private router = inject(Router);

  realizarCadastro() {
    if (this.formCadastro.invalid) {
      console.log("Cadastro invalidado");
      this.formCadastro.markAllAsTouched();
      return;
    }

    const credenciais = {
      nome: this.formCadastro.get('nome')?.value,
      cpf: this.formCadastro.get('cpf')?.value,
      dataNascimento: this.formCadastro.get('dataNascimento')?.value,
      celular: this.formCadastro.get('celular')?.value
    };

    console.log(credenciais);

    this.router.navigate(['/auth/endereco']);
  }
}