import { AfterViewInit, Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from "@angular/core";
import { VariabiliGlobali } from "../VariabiliGlobali.component";
import { ApiService } from "../services/api.service";

@Component({
  templateUrl: 'chat.component.html',
  selector: 'chat_component',
  styleUrls: ['./chat.style.css']
})

export class ChatComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  utenti;
  messaggi;
  modificaDati = false;
  tutti = false;
  messaggio = '';

  constructor(
    private apiService: ApiService,
    public variabiliGlobali: VariabiliGlobali
  ) {

  }

  chiusura() {
    this.chiusuraFinestra.emit(new Date().toString());
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    this.leggeUtenti()
  }

  leggeUtenti() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.letturaUtenti()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const u = new Array();
            const uu = data.split('§');
            let pari = true;
            uu.forEach(element => {
              if (element) {
                const uuu = element.split(';');
                const uuuu = {
                  idUtente: +uuu[0],
                  NickName: uuu[1],
                  Scelto: false,
                  Pari: pari,
                  Avatar: this.variabiliGlobali.ritornaImmagineGiocatore(uuu[0])
                }
                pari = !pari;
                u.push(uuuu);
              }
            });
            this.utenti = u;
            // console.log('Utenti:', this.utenti);

            this.leggeMessaggi();
          } else {
            alert(data);
          }
        }
      }
    );
  }

  leggeMessaggi() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.ritornaTuttiIMessaggi()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const m = data.split('§');
            const mm = new Array();
            let pari = true;
            m.forEach(element => {
             if (element)  {
              const mmm = element.split(';');
              const mmmm = {
                Progressivo: +mmm[0],
                Letto: mmm[1] === 'S' ? true : false,
                idMittente: +mmm[2],
                Mittente: mmm[3],
                Messaggio: mmm[4],
                Pari: pari,
                Avatar: this.variabiliGlobali.ritornaImmagineGiocatore(mmm[2]),
                Data: mmm[5]
              }
              pari = !pari;
              mm.push(mmmm);
             }
            });
            this.messaggi = mm;
          } else {
            alert(data);
          }
        }
      }
    );
  }

  ngAfterViewInit(): void {

  }

  clickSuTutti() {
    this.tutti = !this.tutti;
    this.utenti.forEach(element => {
      element.Scelto = this.tutti;
    });
  }

  clickSuScelto(i) {
    this.utenti.forEach(element => {
      if (+element.idUtente === i) {
        element.Scelto = true;
      }
    });
  }

  aggiunge() {
    this.messaggio = '';
    this.utenti.forEach(element => {
      element.Scelto = false;
    });
    this.tutti = false;
    this.modificaDati = true;
  }

  annulla() {
    this.modificaDati = false;
  }

  segnaComeLetto(progressivo) {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.segnaComeLetto(progressivo)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            this.leggeMessaggi();
          } else {
            alert(data);
          }
        }
      }
    );
  }

  invia() {
    let dest = '';
    this.utenti.forEach(element => {
      if (element.Scelto) {
        dest += element.idUtente + ';';
      }
    });
    if (!dest) {
      alert('Selezionare almeno un destinatario');
      return;
    }
    if (!this.messaggio) {
      alert('Inserire il messaggio');
      return;
    }
    const params = {
      Destinatari: this.variabiliGlobali.sistemaStringaPerPassaggio(dest),
      Messaggio: this.variabiliGlobali.sistemaStringaPerPassaggio(this.messaggio)
    }
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.scriveMessaggi(params)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            this.modificaDati = false;
            this.leggeMessaggi();
          } else {
            alert(data);
          }
        }
      }
    );
  }
}
