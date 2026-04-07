import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' }) // Injectable faz a injeção da dependecia ou dos serveces em qualquer lugar da aplicação (isso que compreendi)

export class CardService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:3000/cards';

  listarTodos(): Observable<any[]> { // Observable basicamente entrega o dado na hora devolve tempo real (é assíncrono)
    return this.http.get<any[]>(this.API);
  }

  buscarPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  adicionarCard(card: any): Observable<any> {
    return this.http.post<any>(this.API, card);
  }

  atualizarCard(id: string, card: any): Observable<any> {
    return this.http.put<any>(`${this.API}/${id}`, card);
  }

  removerCard(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API}/${id}`);
  }

}