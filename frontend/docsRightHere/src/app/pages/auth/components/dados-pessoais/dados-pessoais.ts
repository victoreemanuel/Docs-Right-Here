import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dados-pessoais',
  imports: [FormsModule,ReactiveFormsModule, RouterModule],
  templateUrl: './dados-pessoais.html',
  styleUrl: './dados-pessoais.css',
})
export class DadosPessoais {

  formEmail = new FormGroup({
    email : new FormControl('',[Validators.required, Validators.email]),
    checkEmail : new FormControl('',[Validators.required, Validators.email]),
    senha: new FormControl('',[Validators.required, Validators.minLength(6)]),
    checkSenha: new FormControl('',[Validators.required, Validators.minLength(6)])
  })

  get email() {return this.formEmail.get('email')}
  get checkEmail() {return this.formEmail.get('checkEmail')}
  get senha() {return this.formEmail.get('senha')}
  get checkSenha() {return this.formEmail.get('checkSenha')}

  private router = inject(Router);

  realizarCadastro3(){
    if(this.formEmail.invalid){
      console.log("Formulário de Email inválido")
      this.formEmail.markAllAsTouched();
      return;
    }

    const credenciais = {
      email: this.formEmail.get('email')?.value,
      checkEmail: this.formEmail.get('checkEmail')?.value,
      senha: this.formEmail.get('senha')?.value,
      checkSenha: this.formEmail.get('checkSenha')?.value,
    };

    console.log(credenciais);

    this.router.navigate(['/auth/retorno-login'])
  }
}
