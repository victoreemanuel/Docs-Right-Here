import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvisoCalendario, AvisoDetalhe } from '../models/avisos';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  buscarAvisosDoMes(mes: number, ano: number): Observable<AvisoCalendario[]> {
    return this.http.get<AvisoCalendario[]>(`${this.apiUrl}/calendario?mes=${mes}&ano=${ano}`);
  }

  buscarDetalhesDoDia(data: string): Observable<AvisoDetalhe[]> {
    return this.http.get<AvisoDetalhe[]>(`${this.apiUrl}/calendario/dia?data=${data}`);
  }
}
