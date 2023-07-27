import { AfterViewInit, Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";
import { DatepickerOptions } from 'ng2-datepicker';
import { DatePipe } from "@angular/common";

@Component({
  templateUrl: 'nuovo_concorso.component.html',
  selector: 'nuovo-concorso-component',
  styleUrls: ['./nuovo_concorso.component.css']
})

export class NuovoConcorsoComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() idAnno;
  @Input() NumeroConcorso;
  @Input() DescrizioneAnno;
  @Input() scadenza: Date = new Date();

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  partite = new Array();
  vecchiePartite = new Array();
  idAnno2;
  NumeroConcorso2;
  tastoSalvataggio = false;
  tastoConferma = false;
  options: DatepickerOptions = {
    format: 'dd/MM/yyyy',
    placeholder: 'Scegliere la data',
  }

  constructor(
    private apiService: ApiService,
    public variabiliGlobali: VariabiliGlobali,
    private datePipe: DatePipe,
  ) {

  }

  ngOnInit(): void {
  }

  leggeConcorso() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.ritornaConcorso(this.idAnno2, this.NumeroConcorso2)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            this.apiService.leggePartitaJolly({ idAnno: this.idAnno2, idConcorso: this.NumeroConcorso2 })
            .map((response: any) => response)
            .subscribe((data3: string | string[]) => {
                this.variabiliGlobali.CaricamentoInCorso = false;
                if (data3) {
                  let data4 = this.apiService.SistemaStringaRitornata(data3);
                  if (data4.indexOf('ERROR') > -1) {
                    data4 = -1;
                  }
                  // if (data4.indexOf('ERROR') === -1) {
                    const c = data.split('§');
                    const p = new Array();
                    let pari = true;
                    c.forEach(element => {
                      if (element) {
                        const cc = element.split(';');
                        const ccc = {
                          idPartita: +cc[0],
                          Prima: this.variabiliGlobali.sistemaStringaDaPassaggio(cc[1]),
                          Seconda: this.variabiliGlobali.sistemaStringaDaPassaggio(cc[2]),
                          Risultato: cc[3],
                          Segno: cc[4],
                          Jolly: +cc[0] === +data4,
                          Pari: pari,
                          idPrima: cc[1],
                          idSeconda: cc[2],
                          ImmagineCasa: this.variabiliGlobali.ritornaImmagineSquadra(cc[1]),
                          ImmagineFuori: this.variabiliGlobali.ritornaImmagineSquadra(cc[2])
                        }
                        pari = !pari;
                        p.push(ccc);
                      }
                    });
                    this.partite = p;
                    console.log('Partite: ', p)
                  /* } else {
                    this.partite = new Array();
                  } */
                }
              }
            );
          } else {
            this.partite = new Array();
          }

          this.variabiliGlobali.CaricamentoInCorso = false;
          this.vecchiePartite = this.partite;

          this.controllaTasti();
        } else {
          this.variabiliGlobali.CaricamentoInCorso = false;
          this.vecchiePartite = new Array();

          this.controllaTasti();
        }
      }
    )

  }

  ngAfterViewInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idAnno && changes.idAnno.currentValue) {
      this.idAnno2 = changes["idAnno"].currentValue;
    }
    if (changes.NumeroConcorso && changes.NumeroConcorso.currentValue) {
      this.NumeroConcorso2 = changes.NumeroConcorso.currentValue;
    }
    if (this.idAnno2 !== undefined && this.NumeroConcorso2 !== undefined) {
      // alert('Carico ' + this.idAnno2 + ' ' + this.NumeroConcorso2);
      this.leggeConcorso();
    }
  }

  chiusura() {
    this.chiusuraFinestra.emit(new Date().toString());
  }

  aggiungePartita() {
    const idPartita = this.partite.length + 1;
    const p = {
      idPartita: idPartita,
      Prima: '',
      Seconda: '',
      Risultato: '',
      Segno: ''
    }
    this.partite.push(p);

    this.controllaTasti();
  }

  eliminaPartita(n) {
    const nuove = new Array();
    let q = 1;
    this.partite.forEach(element => {
      if (element.idPartita !== n) {
        element.idPartita = q;
        q++;
        nuove.push(element);
      }
    });
    this.partite = nuove;

    this.controllaTasti();
  }

  salvaConcorso(pubblica, tms) {
    let dati = '';
    this.partite.forEach(element => {
      dati += element.idPartita + ';' +
        this.variabiliGlobali.sistemaStringaPerPassaggio(element.Prima) + ';' +
        this.variabiliGlobali.sistemaStringaPerPassaggio(element.Seconda) + ';' +
        element.Risultato + ';' + element.Segno + '§';
    });
    const parametri = {
      idAnno: this.idAnno2,
      idConcorso: this.NumeroConcorso2,
      Dati: dati
    }
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.salvaConcorso(parametri)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            if (!pubblica) {
              this.vecchiePartite = this.partite;

              this.controllaTasti();

              this.leggeConcorso();
              alert('Concorso salvato');
            } else {
              this.pubblicaConcorso2(tms);
            }
          } else {
            alert(data);
          }
        }
      }
    );
  }

  pubblicaConcorso() {
    if (!this.scadenza) {
      const giorno = new Date().getDay();
      // alert(giorno)
      let aumento = 0;
      if (giorno === 5) {
        aumento = 7 * 24 * 60 * 60 * 1000;
      } else {
        if (giorno === 6) {
          aumento = 6 * 24 * 60 * 60 * 1000;
        } else {
          const diff = (6 - giorno) - 1;
          // alert(diff);
          aumento = diff * 24 * 60 * 60 * 1000;
        }
      }
      this.scadenza = new Date(new Date().getTime() + aumento);
      // return;
    }
    const scadenza = new Date(this.scadenza);
    const tms = this.datePipe.transform(scadenza, 'yyyy-MM-dd');

    this.salvaConcorso(true, tms);
  }

  pubblicaConcorso2(tms) {
    const parametri = {
      idAnno: this.idAnno2,
      Scadenza: tms
    }
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.apreConcorso(parametri)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            console.log(data);
            const r = data.split(';');

            this.variabiliGlobali.idModalitaConcorso = +r[0];
            this.variabiliGlobali.ModalitaConcorso = r[1];
            this.variabiliGlobali.idConcorso = this.NumeroConcorso2;

            this.chiusura();
          } else {
            alert(data);
          }
        }
      }
    );
  }

  controllaTasti() {
    console.log('Partite', this.partite.length);
    console.log('Confronto', this.vecchiePartite, this.partite);
    // console.log('Diff', JSON.stringify(this.vecchiePartite) === JSON.stringify(this.partite));
    if (this.partite.length === 0) {
      // console.log('Ritorno 1');
      this.tastoSalvataggio = false;
      this.tastoConferma = false;
    } else {
      this.tastoSalvataggio = true;
      this.tastoConferma = true;
      this.partite.forEach(element => {
        if (!element.Prima || !element.Seconda) {
          this.tastoConferma = false;
        }
      });
      /* if (JSON.stringify(this.vecchiePartite) !== JSON.stringify(this.partite)) {
        this.tastoConferma = false;
      } else {
        // console.log('Ritorno 3');
        this.tastoSalvataggio = false;
        this.tastoConferma = true;
      } */
    }
  }

  uploadVisibile = false;
  qualeImmagine;
  casaFuori;
  nomeSquadra;

  uploadImmagine(partita, Dove) {
    this.qualeImmagine = partita;
    this.casaFuori = Dove;
    let ii = 0;
    let ok = false;
    let quale;
    if (Dove === 'CASA') {
      this.nomeSquadra = partita.Prima;
    } else {
      this.nomeSquadra = partita.Seconda;
    }
    // console.log(partita, this.nomeSquadra);
    this.uploadVisibile = true;
  }

  fRefreshImmagine() {
        if (this.casaFuori === 'CASA') {
          this.qualeImmagine.ImmagineCasa = this.variabiliGlobali.ritornaImmagineSquadra(this.qualeImmagine.idPrima) + '?d=' + new Date().toString()
        } else {
          this.qualeImmagine.ImmagineFuori = this.variabiliGlobali.ritornaImmagineSquadra(this.qualeImmagine.idSeconda) + '?d=' + new Date().toString()
        }
  }
}
