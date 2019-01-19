import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatButtonModule, MatInputModule, MatListModule, MatSidenavModule, MatIconModule, MatCardModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { ChatService } from './chat.service';

import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,

    FlexLayoutModule
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
