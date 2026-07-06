import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Client, IMessage} from '@stomp/stompjs';
import SockJs from 'sockjs-client';
import { Subject } from 'rxjs';
import { AvisoEvento } from '../models/avisos';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private client!: Client;
  private evento$ = new Subject<AvisoEvento>();
  private readonly apiUrl = environment.apiUrl;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.client = new Client({
        webSocketFactory: () => new SockJs(`${this.apiUrl}/ws`),
        reconnectDelay: 5000
      })

      this.client.onConnect = () => {
        console.log('WebSocket conectado!');
        this.client.subscribe('/topic/avisos', (message: IMessage) => {
          const evento: AvisoEvento = JSON.parse(message.body);
          this.evento$.next(evento);
        });
      };

      this.client.onStompError = (frame) => {
        console.error('Erro STOMP:', frame);
      };

      this.client.activate();
    }
  }

  onEvento() {
    return this.evento$.asObservable();
  }

  desconectar(): void {
    if (isPlatformBrowser(this.platformId) && this.client) {
      this.client.deactivate();
    }
  }
}