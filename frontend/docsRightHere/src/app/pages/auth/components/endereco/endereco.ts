import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-endereco',
  imports: [RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './endereco.html',
  styleUrl: './endereco.css',
})
export class Endereco {

  formEndereco = new FormGroup({
    endereco : new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    numero: new FormControl('',[Validators.required, Validators.maxLength(10)]),
    bairro: new FormControl('',[Validators.required, Validators.minLength(2)]),
    cidade: new FormControl('',[Validators.required, Validators.minLength(3)]),
    estado: new FormControl('',[Validators.required, Validators.minLength(2), Validators.maxLength(2)]),
    profissao: new FormControl('',[Validators.required, Validators.minLength(2)])
  })

  get endereco() {return this.formEndereco.get('endereco')}
  get numero() {return this.formEndereco.get('numero')}
  get bairro() {return this.formEndereco.get('bairro')}
  get cidade() {return this.formEndereco.get('cidade')}
  get estado() {return this.formEndereco.get('estado')}
  get profissao() {return this.formEndereco.get('profissao')}

  private router = inject(Router);

  realizarCadastro2(){
    if(this.formEndereco.invalid){
      console.log("Formulário de Endereço inválido")
      this.formEndereco.markAllAsTouched();
      return;
    }

    const credenciais = {
      endereco: this.formEndereco.get('endereco')?.value,
      numero: this.formEndereco.get('numero')?.value,
      bairro: this.formEndereco.get('bairro')?.value,
      cidade: this.formEndereco.get('cidade')?.value,
      estado: this.formEndereco.get('estado')?.value,
      profissao: this.formEndereco.get('profissao')?.value
    };

    console.log(credenciais);

    this.router.navigate(['/auth/dados-pessoais'])
  }
}
