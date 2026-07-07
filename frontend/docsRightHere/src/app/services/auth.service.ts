import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { LoginRequest, LoginResponse } from '../models/auth-model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'access_token';
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object){
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    this.logout();

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, request)
    .pipe(
      tap(response => this.storeToken(response.accesToken))
    );
  }

  logout(): void{
    if (!this.isBrowser) return;
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null{
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean{
    return this.getToken() !== null;
  }

  private storeToken(token: string): void{
    if (!this.isBrowser) return;
    localStorage.setItem(this.tokenKey, token);
  }
}
