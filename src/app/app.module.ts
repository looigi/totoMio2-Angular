import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { VariabiliGlobali } from './VariabiliGlobali.component';
import { ApiService } from './services/api.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientService } from './services/httpclient.service';
import { NuovoConcorsoComponent } from './nuovo_concorso/nuovo_concorso.component';

@NgModule({
  declarations: [
    AppComponent,
    NuovoConcorsoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    HttpClientService,
    ApiService,
    VariabiliGlobali
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
