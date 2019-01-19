import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'realtime-chat';
  form: FormGroup;

  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
  }
}
