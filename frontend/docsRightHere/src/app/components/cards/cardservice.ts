import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CardsService {

  private apiUrl = 'back-end-docs-right-here-production.up.railway.app';

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

  buscarCards() {

    const token = localStorage.getItem('seuTokenAqui');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get('http://localhost:8080/cards', { headers });
  }
}