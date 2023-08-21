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
  statistiche;
  statisticheVisibile = false;

  statistichePartitaVisibile = false;
  squadraCasa = '';
  squadraFuori = '';
  lista1;
  lista2;
  statistiche1;
  statistiche2;

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
            let i = 0;
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

                const numberC = document.getElementById('pronCasa_' + i);
                numberC.onchange = this.clickCasa.bind(null, this);
                const numberF = document.getElementById('pronFuori_' + i);
                numberF.onchange = this.clickFuori.bind(null, this);

                i++;
              }
            });
          } else {

          }
        }
      }
    );
  }

  clickCasa = function(t, event) {
    let id = event['srcElement']['id'];
    const i = id.split('_');
    id = +i[1];
    // const numero = event['srcElement']['value'];
    // console.log(id, numero);
    t.handleKey1(id)
  };

  clickFuori = function(t, event) {
    let id = event['srcElement']['id'];
    const i = id.split('_');
    id = +i[1];
    // const numero = event['srcElement']['value'];
    // console.log(id, numero);
    t.handleKey2(id)
  };

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

  creaRandom() {
    if (confirm('Si vogliono sovrascrivere i pronostici con valori random ?')) {
      let n = 0;
      this.partite.forEach(element => {
        this.risu1[n] = Math.round(Math.random() * 4);
        this.risu2[n] = Math.round(Math.random() * 4);
        this.partite[n].Risultato1 = this.risu1[n];
        this.partite[n].Risultato2 = this.risu2[n];
        if (this.risu1[n] > this.risu2[n]) {
          this.partite[n].Segno = '1';
        } else {
          if (this.risu1[n] < this.risu2[n]) {
            this.partite[n].Segno = '2';
          } else {
            this.partite[n].Segno = 'X';
          }
        }
        n++;
      });
      const ps = Math.round(Math.random() * n);
      this.clickSuPartitaScelta(ps);
    }
  }

  ritornaStatistichePartite() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.ritornaStatistichePartite()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const righe = data.split('§');
            const sp = new Array();
            let p = true;
            let vecchiaCasa = '';
            let nuovo = false;
            righe.forEach(element => {
              if (element) {
                const r = element.split(';');
                if (r[1] !== vecchiaCasa) {
                  p = !p;
                  vecchiaCasa = r[1];
                  nuovo = true;
                }
                const rr = {
                  idPartita: +r[0],
                  Casa: r[1],
                  Fuori: r[2],
                  Segno: r[3],
                  QuantiSegni: +r[4],
                  Percentuale: r[5] + '%',
                  RisultatoPiuGiocato: nuovo ? r[6] : '',
                  RisPiuGiocatoQuante: nuovo ? +r[7] : '',
                  RisultatoMenoGiocato: nuovo ? r[8] : '',
                  RisMenoGiocatoQuante: nuovo ? +r[9] : '',
                  GoalCasaPiuGiocato: nuovo ? +r[10] : '',
                  GoalCasaPiuGiocatoQuanti: nuovo ? +r[11] : '',
                  GoalCasaMenoGiocato: nuovo ? +r[12] : '',
                  GoalCasaMenoGiocatoQuanti: nuovo ? +r[13] : '',
                  GoalFuoriPiuGiocato: nuovo ? +r[14] : '',
                  GoalFuoriPiuGiocatoQuanti: nuovo ? +r[15] : '',
                  GoalFuoriMenoGiocato: nuovo ? +r[16] : '',
                  GoalFuoriMenoGiocatoQuanti: nuovo ? +r[17] : '',
                  ImmagineCasa: this.variabiliGlobali.ritornaImmagineSquadra(r[1]),
                  ImmagineFuori: this.variabiliGlobali.ritornaImmagineSquadra(r[2]),
                  Pari: p
                }
                nuovo = false;
                sp.push(rr);
              }
            });
            this.statistiche = sp;
            console.log(this.statistiche);
            this.statisticheVisibile = true;
          } else {
            alert(data);
          }
        }
      }
    );

  }

  leggeStatistichePartita(n) {
    this.variabiliGlobali.CaricamentoInCorso = true;
    const params = {
      Casa: n.Prima,
      Fuori: n.Seconda
    }
    this.squadraCasa = n.Prima;
    this.squadraFuori = n.Seconda;
    this.apiService.leggeStatisticheSquadre(params)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const Tutto = data.split('|');
            const lista1 = Tutto[0].split('§');
            const lista2 = Tutto[1].split('§');
            const stat1 = Tutto[2].split(';');
            const stat2 = Tutto[3].split(';');

            let p = true;
            const l1 = new Array();
            lista1.forEach(element => {
              if (element) {
                const ll = element.split(';');
                const lll = {
                  idGiornata: +ll[0],
                  idPartita: +ll[1],
                  Casa: ll[2],
                  Fuori: ll[3],
                  Risultato: ll[4],
                  Segno: ll[5],
                  ImmagineCasa: this.variabiliGlobali.ritornaImmagineSquadra(ll[2]),
                  ImmagineFuori: this.variabiliGlobali.ritornaImmagineSquadra(ll[3]),
                  Pari: p
                }
                l1.push(lll);
                p = !p;
              }
            });
            this.lista1 = l1;

            p = true;
            const l2 = new Array();
            lista2.forEach(element => {
              if (element) {
                const ll = element.split(';');
                const lll = {
                  idGiornata: +ll[0],
                  idPartita: +ll[1],
                  Casa: ll[2],
                  Fuori: ll[3],
                  Risultato: ll[4],
                  Segno: ll[5],
                  ImmagineCasa: this.variabiliGlobali.ritornaImmagineSquadra(ll[2]),
                  ImmagineFuori: this.variabiliGlobali.ritornaImmagineSquadra(ll[3]),
                  Pari: p
                }
                l2.push(lll);
                p = !p;
              }
            });
            this.lista2 = l2;

            this.statistiche1 = {
              Punti: +stat1[0],
              Vittorie: +stat1[3],
              Pareggi: +stat1[4],
              Sconfitte: +stat1[5],
              GoalFatti: +stat1[12],
              GoalSubiti: +stat1[13],

              PuntiCasa: +stat1[1],
              VittorieCasa: +stat1[6],
              PareggiCasa: +stat1[7],
              SconfitteCasa: +stat1[8],
              GoalFattiCasa: +stat1[14],
              GoalSubitiCasa: +stat1[16],

              PuntiFuori: +stat1[2],
              VittorieFuori: +stat1[9],
              PareggiFuori: +stat1[10],
              SconfitteFuori: +stat1[11],
              GoalFattiFuori: +stat1[15],
              GoalSubitiFuori: +stat1[17],

              Giocate: +stat1[18],
              GiocateCasa: +stat1[19],
              GiocateFuori: +stat1[20]
            }

            this.statistiche2 = {
              Punti: +stat2[0],
              Vittorie: +stat2[3],
              Pareggi: +stat2[4],
              Sconfitte: +stat2[5],
              PuntiCasa: +stat2[1],
              PuntiFuori: +stat2[2],
              VittorieCasa: +stat2[6],
              PareggiCasa: +stat2[7],
              SconfitteCasa: +stat2[8],
              VittorieFuori: +stat2[9],
              PareggiFuori: +stat2[10],
              SconfitteFuori: +stat2[11],
              GoalFatti: +stat2[12],
              GoalSubiti: +stat2[13],
              GoalFattiCasa: +stat2[14],
              GoalFattiFuori: +stat2[15],
              GoalSubitiCasa: +stat2[16],
              GoalSubitiFuori: +stat2[17],
              Giocate: +stat2[18],
              GiocateCasa: +stat2[19],
              GiocateFuori: +stat2[20]
            }

            this.statistichePartitaVisibile = true;
          } else {
            alert(data);
          }
        }
      }
    );
  }
}
