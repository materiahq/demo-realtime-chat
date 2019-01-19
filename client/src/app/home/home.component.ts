import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'realtime-chat';
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      nickname: ['', Validators.required],
    });
  }

  join() {
    if (this.form.valid) {
      this.router.navigateByUrl(
        `/chat?nickname=${this.form.value.nickname}`
      );
    }
  }
}
