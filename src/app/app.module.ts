import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PhaserModule } from 'phaser-component-library';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
      PhaserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
