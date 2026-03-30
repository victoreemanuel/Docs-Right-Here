import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TemplateLateralLogin } from '../../components/template-lateral-login/template-lateral-login';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})

export class LoginPage {
  constructor(private HttpClient: HttpClient){}

  email: string = '';
  password: string = '';


  realizarlogin(){
    const credenciais = {
      login: this.email,
      password: this.password
    };

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
