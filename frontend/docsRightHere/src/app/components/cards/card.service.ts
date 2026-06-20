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
    return this.http.get<any>(this.apiUrl);
  }

  criarCard(card: any){
    return this.http.post<any>(this.apiUrl, card);
  }

  moverParaLixeria(card: any){
    return this.http.put<any>(`${this.apiUrl}/${id}/lixeira`, {})
  }

  getCardsExcluidos(card: any){
    return this.http.get<any[]>(`${this.apiUrl}/&{id}/restaurar`, {});
  }



}