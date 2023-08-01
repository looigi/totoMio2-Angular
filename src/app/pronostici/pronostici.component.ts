import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";

@Component({
  templateUrl: 'pronostici.component.html',
  selector: 'pronostici-component',
  styleUrls: ['./pronostici.component.css']
})

export class PronosticiComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() idAnno;
  @Input() NumeroConcorso;
  @Input() DescrizioneAnno;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  partite = new Array();
  idAnno2;
  NumeroConcorso2;
  risu1 = new Array();
  risu2 = new Array();
  tastoSalvataggio = false;
  idPartitaScelta = -1;

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

            this.apiService.leggePartitaJolly({ idAnno: this.idAnno2, idConcorso: this.NumeroConcorso2 })
            .map((response: any) => response)
            .subscribe((data3: string | string[]) => {
                this.variabiliGlobali.CaricamentoInCorso = false;
                if (data3) {
                  let data4 = this.apiService.SistemaStringaRitornata(data3);
                  if (data4.indexOf('ERROR') > -1) {
                    data4 = -1;
                  }
                  const c = data.split('§');
                  const p = new Array();
                  let pari = true;
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
                        Jolly: +cc[0] === +data4,
                        Pari: pari,
                        ImmagineCasa: this.variabiliGlobali.ritornaImmagineSquadra(cc[1]),
                        ImmagineFuori: this.variabiliGlobali.ritornaImmagineSquadra(cc[2])
                      }
                      pari = !pari;
                      p.push(ccc);
                    }
                  });
                  this.partite = p;

                  this.leggePronostico();
                }
              }
            );
          } else {
            this.partite = new Array();
          }

          this.controllaTastoSalvataggio();
        }
      }
    )

  }

  leggePronostico() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.ritornaPronosticoUtente()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const data2 = data.split('|');
            const idPartitaScelta = +data2[1];
            this.idPartitaScelta = idPartitaScelta;
            // alert('Partita scelta: ' + idPartitaScelta);
            const r = data2[0].split('§');
            r.forEach(element => {
              if (element !== '') {
                const c = element.split(';');
                this.partite.forEach(element2 => {
                  if (+element2.idPartita === +c[0]) {
                    element2.Risultato = c[1];
                    element2.Segno = c[2];
                    const rr = c[1].split('-');
                    element2.Risultato1 = +rr[0];
                    element2.Risultato2 = +rr[1];
                    element2.idPartitaScelta = ((+element2.idPartita) === idPartitaScelta)

                    this.risu1[element2.idPartita - 1] = +rr[0];
                    this.risu2[element2.idPartita - 1] = +rr[1];
                  }
                });
              }
            });
          } else {

          }
        }
      }
    );
  }

  clickSuPartitaScelta(i) {
    console.log(this.partite, i);
    this.idPartitaScelta = i + 1;
    let n = 1;
    this.partite.forEach(element => {
      if (n === this.idPartitaScelta) {
        element.idPartitaScelta = true;
      } else {
        element.idPartitaScelta = false;
      }
      n++;
    });
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

  salvaPronostico() {
    let ok = false;
    this.partite.forEach(element => {
      if (element.idPartitaScelta) {
        ok = true;
      }
    });
    if (!ok) {
      alert('Selezionare una partita scelta');
      return;
    }
    let q = 1;
    this.partite.forEach(element => {
      if (+element.Risultato1 < 0) {
        alert('Risultato della partita ' + q + ' in casa non valido: ' + element.Risultato1);
        return;
      }
      if (+element.Risultato2 < 0) {
        alert('Risultato della partita ' + q + ' fuori casa non valido: ' + element.Risultato2);
        return;
      }
      q++;
    });
    if (this.idPartitaScelta === -1) {
      alert('Partita scelta non valida: ' + this.idPartitaScelta);
      return;
    }
    let Dati = '';
    this.partite.forEach(element => {
      const ris = element.Risultato1 + '-' + element.Risultato2;
      Dati += element.idPartita + ';' + ris + ';' + element.Segno + '§';
    });
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.salvaPronosticoUtente(Dati, this.idPartitaScelta)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            alert('Pronostico salvato');
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
    let q = 0;
    this.partite.forEach(element => {
      if (ok && element.Segno === '') {
        // console.log('Segno non valido', q+1, element.Segno);
        ok = false;
      }
      q++;
    });
    if (ok) {
      this.tastoSalvataggio = true;
    } else {
      this.tastoSalvataggio = false;
    }
  }
}
