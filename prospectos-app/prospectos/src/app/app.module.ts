import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ProspectosComponent } from './prospectos/prospectos.component';
import { ProspectoComponent } from './prospecto/prospecto.component';

@NgModule({
  declarations: [
    AppComponent,
    ProspectosComponent,
    ProspectoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
