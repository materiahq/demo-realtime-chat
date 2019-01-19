import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  form: FormGroup;

  nickname: string;

  messageForm: FormGroup;

  messages: any[] = [];

  users: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private chat: ChatService
  ) {}

  ngOnInit() {
    console.log('hello');

    this.messageForm = this.fb.group({
      message: ['']
    });
    this.route.queryParams.subscribe(params => {
      console.log('params', params);
      this.nickname = params.nickname;

      if (this.nickname) {
        console.log('connect to chat');
        this.messages = [];
        this.users = [];
        this.chat.connect(this.nickname).subscribe(ev => {
          console.log('EVENT', ev, typeof ev);
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

  sendMessage() {
    if (this.messageForm.value.message) {
      this.chat.sendMessage(this.messageForm.value.message);
      this.messageForm.reset();
    }
  }
}
