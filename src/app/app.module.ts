import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { VariabiliGlobali } from './VariabiliGlobali.component';
import { ApiService } from './services/api.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientService } from './services/httpclient.service';
import { NuovoConcorsoComponent } from './nuovo_concorso/nuovo_concorso.component';
import { PronosticiComponent } from './pronostici/pronostici.component';
import { GestioneConcorsoComponent } from './gestione_concorso/gestione_concorso.component';
import { ChiusuraConcorsoComponent } from './chiusura_concorso/chiusura_concorso.component';
import { ControlloConcorsoComponent } from './controllo_concorso/controllo_concorso.component';
import { ClassificaComponent } from './classifica/classifica.component';
import { CoppeComponent } from './coppe/coppe.compnent';
import {MatTabsModule} from '@angular/material/tabs';
import { DatepickerModule } from 'ng2-datepicker';
import { DatePipe } from '@angular/common';
import { InfoComponent } from './info/info.component';
import { AmministrazioneComponent } from './amministrazione/amministrazione.component';

@NgModule({
  declarations: [
    AppComponent,
    NuovoConcorsoComponent,
    PronosticiComponent,
    ChiusuraConcorsoComponent,
    GestioneConcorsoComponent,
    ControlloConcorsoComponent,
    ClassificaComponent,
    CoppeComponent,
    InfoComponent,
    AmministrazioneComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    DatepickerModule
  ],
  providers: [
    HttpClientService,
    ApiService,
    VariabiliGlobali,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
