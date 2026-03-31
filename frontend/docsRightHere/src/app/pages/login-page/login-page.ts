import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TemplateLateralLogin } from '../../components/template-lateral-login/template-lateral-login';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})

export class LoginPage {
  constructor(private HttpClient: HttpClient){}

  formLogin = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(6), Validators.required])
  })
  // email: string = '';
  // password: string = '';


  realizarlogin(){
    if (this.formLogin.invalid) console.log("Login invalidado");

    const credenciais = {
      login: this.formLogin.get('email')?.value, //Duas formas de acessar o valor
      password: this.formLogin.value.password
    };
    console.log(credenciais);
    return;


    const API_URL = "http://localhost:8080/auth/login";

    this.HttpClient.post(API_URL, credenciais).subscribe({
      next: (responta: any) => {
        console.log("Resposta: ", responta);
        alert("Login realizado: " + responta.token)
      },
      error: (error) =>{
        alert("Erro: " + error);
      }
    })

  }
}
