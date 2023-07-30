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
  utenti;
  bilancio;
  idAnno2;
  idConcorso2;
  NickName;
  Importo;
  idTipologia;
  idUtente;
  Data;
  Note;
  modificaDati = false;
  mascheraScelta = false;
  scelte;
  sceltaNumero;
  Tipologia;
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
            const righe = data.split('§');
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

  letturaBilancio() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.letturaBilancio()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const righe = data.split('§');
            const m = new Array();
            let pari = true;
            righe.forEach(element => {
              if (element) {
                const c = element.split(';');
                const cc = {
                  Progressivo: +c[7],
                  idMovimento: +c[0],
                  Movimento: c[1],
                  idUtente: +c[2],
                  NickName: c[3],
                  Importo: +c[4],
                  Data: c[5],
                  Note: c[6],
                  Pari: pari
                }
                pari = !pari;
                m.push(cc);
              }
            });
            this.bilancio = m;
          } else {
            // alert(data);
          }
        }
      }
    );
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
    this.Progressivo = m.Progressivo;
    this.movimenti.forEach(element => {
      if (element.idMovimento === this.idTipologia) {
        this.Tipologia = element.Movimento;
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
    const params = {
      idUtente: this.idUtente,
      idMovimento: this.idTipologia,
      Importo: this.Importo.toString().replace('.', ','),
      Data: this.Data,
      Note: this.Note,
      Progressivo: this.Progressivo
    }
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
      cosa = this.movimenti;
    }
    const nn = new Array();
    let pari = true;
    cosa.forEach(element => {
      if (element) {
        const nnn = {
          id: this.sceltaNumero === 1 ? element.idUtente : element.idMovimento,
          Descrizione: this.sceltaNumero === 1 ? element.NickName : element.Movimento,
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
      this.Tipologia = s.Descrizione;
      this.idTipologia = s.id;
    }
    this.mascheraScelta = false;
  }
}
