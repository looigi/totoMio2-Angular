import { AfterViewInit, Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";

@Component({
  templateUrl: 'gestione_concorso.component.html',
  selector: 'gestione_concorsocomponent',
  styleUrls: ['./gestione_concorso.component.css']
})

export class GestioneConcorsoComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() idAnno;
  @Input() NumeroConcorso;
  @Input() DescrizioneAnno;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  partite = new Array();
  idAnno2;
  NumeroConcorso2;
  tastoSalvataggio = false;
  risu1 = new Array();
  risu2 = new Array();

  constructor(
    private apiService: ApiService,
    public variabiliGlobali: VariabiliGlobali
  ) {

  }

  ngOnInit(): void {
  }

  leggeConcorso() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.ritornaConcorso(this.idAnno2, this.NumeroConcorso2)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const c = data.split('§');
            const p = new Array();
            c.forEach(element => {
              if (element) {
                const cc = element.split(';');
                let pr, Ris1, Ris2;
                if (cc[3].indexOf('-') > -1) {
                  pr = cc[3].split('-');
                  Ris1 = pr[0];
                  Ris2 = pr[1];
                } else {
                  Ris1 = '';
                  Ris2 = '';
                }
                this.risu1.push('');
                this.risu2.push('');
                const ccc = {
                  idPartita: +cc[0],
                  Prima: this.variabiliGlobali.sistemaStringaDaPassaggio(cc[1]),
                  Seconda: this.variabiliGlobali.sistemaStringaDaPassaggio(cc[2]),
                  Risultato: cc[3],
                  Risultato1: Ris1,
                  Risultato2: Ris2,
                  Segno: cc[4],
                  ImmagineCasa: this.variabiliGlobali.ritornaImmagineSquadra(cc[1]),
                  ImmagineFuori: this.variabiliGlobali.ritornaImmagineSquadra(cc[2])
                }
                p.push(ccc);
              }
            });
            this.partite = p;

            this.controllaTastoSalvataggio();
          } else {
            this.partite = new Array();
          }

          // this.vecchiePartite = this.partite;

          // this.controllaTasti();
        } else {
          // this.vecchiePartite = new Array();

          // this.controllaTasti();
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

  salvaConcorso() {
    let dati = '';
    this.partite.forEach(element => {
      const ris = element.Risultato1 + '-' + element.Risultato2;
      dati += element.idPartita + ';' +
        this.variabiliGlobali.sistemaStringaPerPassaggio(element.Prima) + ';' +
        this.variabiliGlobali.sistemaStringaPerPassaggio(element.Seconda) + ';' +
        ris + ';' + element.Segno + '§';
    });
    const parametri = {
      idAnno: this.idAnno2,
      idConcorso: this.NumeroConcorso2,
      Dati: dati
    }
    // console.log(parametri);
    // return;
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.salvaConcorso(parametri)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            this.tastoSalvataggio = false;
            alert('Concorso salvato');
          } else {
            alert(data);
          }
        }
      }
    );
  }

  handleKey1(n, t) {
    setTimeout(() => {
      if (this.partite[n].Risultato1 !== '') {
        this.risu1[n] = this.partite[n].Risultato1;
      } else {
        this.risu1[n] = '';
      }
      this.controllaSegno(n);
    }, 100);
  }

  handleKey2(n, t) {
    setTimeout(() => {
      if (this.partite[n].Risultato2 !== '') {
        this.risu2[n] = this.partite[n].Risultato2;
      } else {
        this.risu2[n] = '';
      }
      this.controllaSegno(n);
    }, 100);
  }

  controllaSegno(n) {
    // console.log(n, this.risu1[n], this.risu2[n]);
    if (this.risu1[n] === '' || this.risu2[n] === '') {
      this.partite[n].Segno = '';
    } else {
      if (+this.risu1[n] > +this.risu2[n]) {
        this.partite[n].Segno = '1';
      } else {
        if (+this.risu1[n] < +this.risu2[n]) {
          this.partite[n].Segno = '2';
        } else {
          this.partite[n].Segno = 'X';
        }
      }
    }

    this.controllaTastoSalvataggio();
  }

  controllaTastoSalvataggio() {
    let ok = true;
    this.partite.forEach(element => {
      if (ok && element.Segno === '') {
        ok = false;
      }
    });
    if (ok) {
      this.tastoSalvataggio = true;
    } else {
      this.tastoSalvataggio = false;
    }
  }
}
