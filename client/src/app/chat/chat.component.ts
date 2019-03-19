import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ChatService } from '../chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messageForm: FormGroup;
  messages: any[] = [];
  users: any[] = [];

  nickname$: Observable<string>;
  subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private chat: ChatService
  ) {}

  ngOnInit() {
    this.messageForm = this.fb.group({
      message: ['']
    });
    this.nickname$ = this.route.queryParams.pipe(
      map((params) => params.nickname)
    );

    this.subscription = this.nickname$.subscribe(nickname => {
      if (nickname) {
        this.messages = [];
        this.users = [];
        this.chat.connect(nickname).subscribe(ev => {
          if (ev.type === 'REFRESH') {
            this.refreshUsers(ev);
          } else if (ev.type === 'JOIN') {
            this.join(ev);
          } else if (ev.type === 'LEAVE') {
            this.leave(ev);
          } else if (ev.type === 'MESSAGE') {
            this.receiveMessage(ev);
          }
        });
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }

  sendMessage() {
    if (this.messageForm.value.message) {
      this.chat.sendMessage(this.messageForm.value.message);
      this.messageForm.reset();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private refreshUsers(ev) {
    this.users = ev.users;
  }
  private join(ev) {
    this.receiveMessage({
      data: `${ev.nickname} joined the channel.`
    });
    this.users = [
      ...this.users,
      {
        nickname: ev.nickname,
        id: ev.id
      }
    ];
  }

  private leave(ev) {
    this.receiveMessage({
      data: `${ev.nickname} left the channel.`
    });
    this.users = this.users.filter(user => user.id !== ev.id);
  }

  private receiveMessage(ev) {
    if (
      this.messages.length > 0 &&
      this.messages[this.messages.length - 1].nickname &&
      ev.nickname === this.messages[this.messages.length - 1].nickname
    ) {
      this.messages[this.messages.length - 1].data = [
        ...this.messages[this.messages.length - 1].data,
        ev.data
      ];
    } else {
      this.messages = [
        ...this.messages,
        {
          id: ev.id,
          nickname: ev.nickname,
          data: [ev.data],
          date: new Date()
        }
      ];
    }
  }
}
