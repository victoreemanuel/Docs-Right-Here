import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../models/auth-model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'access_token';

  login(request: LoginRequest): Observable<LoginResponse> {
    this.logout();

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, request)
    .pipe(
      tap(response => this.storeToken(response.accesToken))
    );
  }

  logout(): void{
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null{
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean{
    return this.getToken() !== null;
  }

  private storeToken(token: string): void{
    localStorage.setItem(this.tokenKey, token);
  }
}
