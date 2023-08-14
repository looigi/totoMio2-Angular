import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";
import { DatePipe } from "@angular/common";

@Component({
  templateUrl: 'bilancio.component.html',
  selector: 'bilancio_component',
  styleUrls: ['./bilancio.style.css']
})

export class BilancioComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() idAnno;
  @Input() DescrizioneAnno;
  @Input() NumeroConcorso;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  movimenti;
  posizioni;
  utenti;
  bilancio;
  bilancioUtenti;
  idAnno2;
  idConcorso2;
  NickName;
  Importo;
  idTipologia;
  idModalita;
  idUtente;
  Data;
  Note;
  modificaDati = false;
  mascheraScelta = false;
  scelte;
  sceltaNumero;
  Tipologia;
  Modalita;
  Progressivo;

  constructor(
    private apiService: ApiService,
    public variabiliGlobali: VariabiliGlobali,
    private datePipe: DatePipe,
  ) {

  }

  chiusura() {
    this.chiusuraFinestra.emit(new Date().toString());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idAnno && changes.idAnno.currentValue) {
      this.idAnno2 = changes.idAnno.currentValue;
    }
    if (changes.NumeroConcorso && changes.NumeroConcorso.currentValue) {
      this.idConcorso2 = changes.NumeroConcorso.currentValue;
    }
  }

  ngOnInit(): void {
    this.letturaMovimenti();
  }

  ngAfterViewInit(): void {

  }

  letturaMovimenti() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.letturaMovimenti()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const tutto = data.split('|');

            const righe = tutto[0].split('§');
            const m = new Array();
            righe.forEach(element => {
              if (element) {
                const c = element.split(';');
                const cc = {
                  idMovimento: +c[0],
                  Movimento: c[1]
                }
                m.push(cc);
              }
            });
            this.movimenti = m;

            const righe2 = tutto[1].split('§');
            const m2 = new Array();
            righe2.forEach(element => {
              if (element) {
                const c = element.split(';');
                const cc = {
                  idPosizione: +c[0],
                  Posizione: c[1]
                }
                m2.push(cc);
              }
            });
            this.posizioni = m2;

            this.letturaUtenti();
          } else {
            alert(data);
          }
        }
      }
    );
  }

  letturaUtenti() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.letturaUtenti()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const righe = data.split('§');
            const m = new Array();
            righe.forEach(element => {
              if (element) {
                const c = element.split(';');
                const cc = {
                  idUtente: +c[0],
                  NickName: c[1]
                }
                m.push(cc);
              }
            });
            this.utenti = m;

            this.letturaBilancio();
          } else {
            alert(data);
          }
        }
      }
    );
  }

  entrate = 0;
  uscite = 0;
  vincite = 0;
  bilancione = 0;
  presentati = 0;
  posizioniLista = new Array();

  letturaBilancio() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.letturaBilancio()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);

          this.entrate = 0;
          this.uscite = 0;
          this.vincite = 0;
          this.bilancione = 0;
          this.presentati = 0;
          this.posizioniLista = new Array();

          if (data.indexOf('ERROR') === -1) {
            const tutto = data.split('|');

            const righe = tutto[0].split('§');
            const m = new Array();
            let pari = true;
            righe.forEach(element => {
              if (element) {
                const c = element.split(';');
                if (c[1].toUpperCase().trim() === 'ENTRATA') {
                  this.entrate += +c[4];
                  this.bilancione += +c[4];
                }
                if (c[1].toUpperCase().trim() === 'USCITA') {
                  this.uscite += +c[4];
                  this.bilancione -= +c[4];
                }
                if (c[1].toUpperCase().trim() === 'VINCITA') {
                  this.vincite += +c[4];
                  this.bilancione -= +c[4];
                }
                if (c[1].toUpperCase().trim() === 'PRESENTAZIONE') {
                  this.presentati += +c[4];
                  this.bilancione -= +c[4];
                }
                let ok = false;
                this.posizioniLista.forEach(element2 => {
                  if (+element2.idPosizione === +c[8]) {
                    ok = true;
                    element2.Quanti += +c[4];
                    return;
                  }
                });
                if (!ok) {
                  const pp = {
                    idPosizione: +c[8],
                    Posizione: c[9],
                    Quanti: +c[4]
                  }
                  this.posizioniLista.push(pp);
                }

                const cc = {
                  Progressivo: +c[7],
                  idMovimento: +c[0],
                  Movimento: c[1],
                  idUtente: +c[2],
                  NickName: c[3],
                  Importo: +c[4],
                  Data: c[5],
                  Note: c[6],
                  idPosizione: +c[8],
                  Posizione: c[9],
                  Presentati: +c[10],
                  Pari: pari
                }
                pari = !pari;
                m.push(cc);
              }
            });
            this.bilancio = m;

            const righe2 = tutto[1].split('§');
            const bbb = new Array();
            pari = true;
            righe2.forEach(element => {
              if (element) {
                const b = element.split(';');
                const bb = {
                  idUtente: +b[0],
                  NickName: b[1],
                  Importo: +b[2].replace(',', '.'),
                  Pari: pari
                }
                pari = !pari;
                bbb.push(bb);
              }
            });
            this.bilancioUtenti = bbb;
          } else {
            // alert(data);
          }
        }
      }
    );
  }

  prendeImmagineGiocatore(id) {
    return this.variabiliGlobali.ritornaImmagineGiocatore(id.toString());
  }

  eliminaMovimento(m) {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.eliminaMovimento(m.Progressivo)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            alert('Movimento eliminato');
            this.letturaBilancio();
          } else {
            alert(data);
          }
        }
      }
    );
  }

  modificaMovimento(m) {
    this.NickName = m.NickName;
    this.idUtente = m.idUtente,
    this.Importo = m.Importo;
    this.Data = m.Data;
    this.Note = m.Note;
    this.idTipologia = m.idMovimento;
    this.idModalita = m.idPosizione;
    this.Progressivo = m.Progressivo;
    this.movimenti.forEach(element => {
      if (element.idMovimento === this.idTipologia) {
        this.Tipologia = element.Movimento;
      }
    });
    this.posizioni.forEach(element => {
      if (element.idPosizione === this.idModalita) {
        this.Modalita = element.Posizione;
      }
    });
    this.modificaDati = true;
  }

  aggiungeMovimento() {
    this.idUtente = undefined;
    this.NickName = '';
    this.Importo = 0;
    const d = new Date();
    const dd = this.datePipe.transform(d, 'dd/MM/yyyy');
    this.Data = dd;
    this.Note = '';
    this.idTipologia = undefined;
    this.Progressivo = '';
    this.modificaDati = true;
  }

  annulla() {
    this.modificaDati = false;
  }

  salva() {
    if (!this.idUtente) {
      alert('Selezionare un utente');
      return;
    }
    if (!this.Importo) {
      alert('Selezionare un importo');
      return;
    }
    if (!this.Data) {
      alert('Selezionare una data');
      return;
    }
    if (!this.idTipologia) {
      alert('Selezionare una tipologia di movimento');
      return;
    }
    if (!this.idModalita && this.idModalita !== 0) {
      alert('Selezionare una modalità di pagamento');
      return;
    }
    const params = {
      idUtente: this.idUtente,
      idMovimento: this.idTipologia,
      Importo: this.Importo.toString().replace('.', ','),
      Data: this.Data,
      Note: this.Note,
      Progressivo: this.Progressivo,
      idPosizione: this.idModalita
    }
    console.log(params);
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.salvaMovimento(params)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            alert('Movimento salvato');
            this.annulla();
            this.mascheraScelta = false;
            this.letturaBilancio();
          } else {
            alert(data);
          }
        }
      }
    );
  }

  apreScelta(n) {
    this.sceltaNumero = n;
    const a = new Array();
    let cosa;
    if (n === 1) {
      cosa = this.utenti;
    } else {
      if (n === 2) {
        cosa = this.movimenti;
      } else {
        cosa = this.posizioni;
      }
    }
    const nn = new Array();
    let pari = true;
    cosa.forEach(element => {
      if (element) {
        const nnn = {
          id: this.sceltaNumero === 1 ? element.idUtente : this.sceltaNumero === 2 ? element.idMovimento : element.idPosizione,
          Descrizione: this.sceltaNumero === 1 ? element.NickName : this.sceltaNumero ===2 ? element.Movimento : element.Posizione,
          Pari: pari
        }
        pari = !pari;
        nn.push(nnn);
      }
    });
    this.scelte = nn;
    this.mascheraScelta = true;
  }

  impostaScelta(s) {
    if (this.sceltaNumero === 1) {
      this.NickName = s.Descrizione;
      this.idUtente = s.id;
    } else {
      if (this.sceltaNumero === 2) {
        this.Tipologia = s.Descrizione;
        this.idTipologia = s.id;
      } else {
        this.Modalita = s.Descrizione;
        this.idModalita = s.id;
      }
    }
    this.mascheraScelta = false;
  }
}
