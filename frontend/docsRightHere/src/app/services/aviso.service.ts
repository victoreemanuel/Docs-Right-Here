import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Aviso {
  id?: string;
  titulo: string;
  criador: string;
  cargo: 'professor' | 'secretaria' | 'diretor';
  descricao: string;
  data: string;
  dataValidade: string;
  visibilidade: string;
  visualizado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AvisoService {
  
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/avisos';

  getAvisos(): Observable<Aviso[]> {
    return this.http.get<Aviso[]>(this.apiUrl);
  }

  adicionarAviso(novoAviso: Aviso): Observable<Aviso> {
    return this.http.post<Aviso>(this.apiUrl, novoAviso);
  }

  excluirAviso(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}