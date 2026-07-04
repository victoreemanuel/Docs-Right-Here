import { Injectable } from '@angular/core';
import { Client, IMessage} from '@stomp/stompjs';
import SockJs from 'sockjs-client';
import { Subject } from 'rxjs';
import { AvisoEvento } from '../models/avisos';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private client: Client;
  private evento$ = new Subject<AvisoEvento>();
  private readonly apiUrl = environment.apiUrl;

  constructor(){
    this.client = new Client({
      webSocketFactory: () => new SockJs(this.apiUrl),
      reconnectDelay: 5000
    })

    this.client.onConnect = () => {
      this.client.subscribe('/topic/avisos', (message: IMessage) => {
        const evento: AvisoEvento = JSON.parse(message.body);
        this.evento$.next(evento);
      });
    };

    this.client.activate();
  }

  onEvento() {
    return this.evento$.asObservable();
  }

  desconectar(): void {
    this.client.deactivate();
  }

}
