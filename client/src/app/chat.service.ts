import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ChatService {
  ws: WebSocket;
  nickname: string;

  constructor() {}

  connect(nickname): Observable<any> {
    this.ws = new WebSocket(`ws://localhost:8080/test?nickname=${nickname}`);

    const observable = Observable.create(obs => {
      this.ws.addEventListener('message', ev => {
        try {
          const t = JSON.parse(ev.data);
          if (t) {
            obs.next(t);
          }
        } catch (e) {}
      });
      this.ws.addEventListener('close', () => {
        obs.complete();
      });
      return this.ws.close.bind(this.ws);
    });

    const observer = {
      next: (data: Object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data));
        }
      }
    };
    return Subject.create(observer, observable);
  }

  sendMessage(message) {
    this.ws.send(
      JSON.stringify({
        type: 'MESSAGE',
        data: message
      })
    );
  }
}
