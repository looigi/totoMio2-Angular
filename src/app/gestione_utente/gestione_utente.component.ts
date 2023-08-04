import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";

@Component({
  templateUrl: 'gestione_utente.component.html',
  selector: 'gestione_utente_component',
  styleUrls: ['./gestione_utente.style.css']
})

export class GestioneUtenteComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() idAnno;
  @Input() DescrizioneAnno;
  @Input() NumeroConcorso;
  @Input() refreshImmagine;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();
  @Output() apreUploadEmit: EventEmitter<string> = new EventEmitter<string>();

  classifica;
  idAnno2;
  idConcorso2;
  immagineUtente;
  nickName;
  cognome;
  nome;
  email;
  password;
  Apertura = true;
  Chiusura = true;
  Controllo = true;
  Chat = true;
  Reminder = true;
  Giocata = true;
  settaggi = false;

  constructor(
    private apiService: ApiService,
    public variabiliGlobali: VariabiliGlobali
  ) {
    this.immagineUtente = this.variabiliGlobali.ritornaImmagineGiocatore(this.variabiliGlobali.idUser.toString());
    this.nickName = this.variabiliGlobali.Utente;
    this.cognome = this.variabiliGlobali.Cognome;
    this.nome = this.variabiliGlobali.Nome;
    this.email = this.variabiliGlobali.EMail;
    this.password = this.variabiliGlobali.Password;
  }

  chiusura() {
    this.settaggi = false;

    this.chiusuraFinestra.emit(new Date().toString());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.refreshImmagine && changes.refreshImmagine.currentValue) {
      this.immagineUtente = this.variabiliGlobali.ritornaImmagineGiocatore(this.variabiliGlobali.idUser.toString()) +
        '?d=' + new Date().toString();
    }
  }

  ngOnInit(): void {
    this.leggeSettaggi();
  }

  ngAfterViewInit(): void {

  }

  apreUpload() {
    this.apreUploadEmit.emit(new Date().toString());
  }

  resetImmagine() {
    this.apiService.CreaImmagineStandard()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            this.immagineUtente = this.variabiliGlobali.ritornaImmagineGiocatore(this.variabiliGlobali.idUser.toString()) + '?d=' + new Date().toString();;
            alert('Immagine utente resettata')
          } else {
            alert(data);
          }
        }
      }
    );
  }

  salva() {
    const params = {
      NickName: this.nickName,
      Cognome: this.cognome,
      Nome: this.nome,
      Password: this.password,
      Mail: this.email,
      idTipologia: this.variabiliGlobali.idTipologia
    }
    this.variabiliGlobali.CaricamentoInCorso = true;

    this.apiService.modificaUtente(params)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            this.variabiliGlobali.Utente = this.nickName;
            this.variabiliGlobali.Cognome = this.cognome;
            this.variabiliGlobali.Nome = this.nome;
            this.variabiliGlobali.Password = this.password;
            this.variabiliGlobali.EMail = this.email;
            alert('Utente modificato');
          } else {
            alert(data);
          }
        }
      }
    );
  }

  leggeSettaggi() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.leggeSettaggi()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const c = data.split(';');
            this.Apertura = c[0] === 'S';
            this.Reminder = c[1] === 'S';
            this.Controllo = c[2] === 'S';
            this.Chiusura = c[3] === 'S';
            this.Chat = c[4] === 'S';
            this.Giocata = c[5] === 'S';
          } else {
            alert(data);
          }
        }
      }
    );
  }

  scriveSettaggi() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    const params = {
      Apertura: this.Apertura ? 'S' : 'N',
      Reminder: this.Reminder ? 'S' : 'N',
      Controllo: this.Controllo ? 'S' : 'N',
      Chiusura: this.Chiusura ? 'S' : 'N',
      Chat: this.Chat ? 'S' : 'N',
      Giocata: this.Giocata ? 'S' : 'N',
    }
    this.apiService.scriveSettaggi(params)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            alert('Settaggi salvati');
          } else {
            alert(data);
          }
        }
      }
    );
  }

  clickSuApertura() {
    this.Apertura = !this.Apertura
  }

  clickSuChiusura() {
    this.Chiusura = !this.Chiusura;
  }

  clickSuControllo() {
    this.Controllo = !this.Controllo;
  }

  clickSuChat() {
    this.Chat = !this.Chat;
  }

  clickSuReminder() {
    this.Reminder = !this.Reminder;
  }

  clickSuGiocata() {
    this.Giocata = !this.Giocata;
  }

}
