import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private apiUrl = 'http://localhost:8080/api/cards';

  constructor(private http: HttpClient) { }

  getCards(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  criarCard(card: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, card);
  }

  moverParaLixeira(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/lixeira`, {});
  }

  getCardsExcluidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/excluidos`);
  }

  recuperarCard(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/restaurar`, {});
  }

  deletarPermanente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}