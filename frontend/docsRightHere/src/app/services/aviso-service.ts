import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CreateAviso, RequestAviso, UpdateAviso } from '../models/avisos';

@Injectable({
  providedIn: 'root',
})
export class AvisoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api`;

  listarAvisos(lixeira?: boolean): Observable<RequestAviso[]> {
    let params = new HttpParams();
    if (lixeira !== undefined) {
      params = params.set('lixeira', lixeira.toString());
    }

    return this.http.get<RequestAviso[]>(
      `${this.apiUrl}/avisos`,
      {params: params}
    );
  };

  criarAviso(aviso: CreateAviso): Observable<RequestAviso> {
    return this.http.post<RequestAviso>(
      `${this.apiUrl}/aviso`,
      aviso
    );
  }

  deletarAviso(aviso: UpdateAviso): Observable<RequestAviso> {
    return this.http.delete<RequestAviso>(
      `${this.apiUrl}/aviso/${aviso.aviso_id}`,
    );
  }

  vistoAviso(aviso: UpdateAviso): Observable<RequestAviso> {
    return this.http.put<RequestAviso>(
      `${this.apiUrl}/aviso/visto`,
      aviso
    );
  }

  restaurarAviso(aviso: UpdateAviso): Observable<RequestAviso> {
    return this.http.put<RequestAviso>(
      `${this.apiUrl}/aviso/restaurar`,
      aviso
    );
  }




}
