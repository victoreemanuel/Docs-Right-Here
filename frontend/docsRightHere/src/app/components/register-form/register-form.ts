import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register-form',
  imports: [FormsModule,RouterOutlet,ReactiveFormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {

  formCadastro = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]),
    cpf: new FormControl('', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]),
    dataNascimento: new FormControl('', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)]),
    celular: new FormControl('', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]),
  })

  realizarCadastro(){
    if (this.formCadastro.invalid) console.log("Cadastro invalidado");

    const credenciais = {
      nome: this.formCadastro.get('nome')?.value,
      cpf: this.formCadastro.get('cpf')?.value,
      dataNascimento: this.formCadastro.get('dataNascimento')?.value,
      celular: this.formCadastro.get('celular')?.value
    };

    //this.formCadastro.value;
    console.log(credenciais);
  }
}
