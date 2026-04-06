import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' 
})
export class CardService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:3000/cards'; 


  adicionarCard(card: any): Observable<any> {
    return this.http.post<any>(this.API, card);
  }

  listarTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }
}