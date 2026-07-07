import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Client, IMessage} from '@stomp/stompjs';
// import SockJs from 'sockjs-client';
import { Subject } from 'rxjs';
import { AvisoEvento } from '../models/avisos';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private client?: Client;
  private evento$ = new Subject<AvisoEvento>();
  private readonly apiUrl = environment.apiUrl;
  private readonly isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private authService: AuthService
  ){
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser){
      this.conectar();
    }
  }

  conectar(): void{
    const wsUrl = environment.apiUrl.replace(/^http/, 'ws')

    this.client = new Client({
      brokerURL: `${wsUrl}/ws/websocket`,
      connectHeaders: {
        Authorization: `Bearer ${this.authService.getToken()}`
      },
      reconnectDelay: 5000
    });

  this.client.onConnect = () => {
    this.client!.subscribe('/topic/avisos', (message: IMessage) => {
      const evento: AvisoEvento = JSON.parse(message.body);
      this.evento$.next(evento);
    });
  };

  this.client.onStompError = (frame) => {
    console.error('Erro STOMP: ', frame.headers['message']);
  }

  this.client.activate();
  }

  onEvento() {
    return this.evento$.asObservable();
  }

  desconectar(): void {
    this.client?.deactivate();
  }

}
