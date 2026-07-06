import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    this.logout();

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, request)
    .pipe(
      tap(response => this.storeToken(response.accesToken))
    );
  }

  logout(): void{
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  getToken(): string | null{
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isAuthenticated(): boolean{
    return this.getToken() !== null;
  }

  private storeToken(token: string): void{
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }
}