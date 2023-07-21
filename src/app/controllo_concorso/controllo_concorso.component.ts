import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";

@Component({
  templateUrl: 'controllo_concorso.component.html',
  selector: 'controllo_concorsocomponent',
  styleUrls: ['./controllo_concorso.style.css']
})

export class ControlloConcorsoComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() idAnno;
  @Input() DescrizioneAnno;
  @Input() NumeroConcorso;
  @Input() ModalitaConcorso;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  risultati;
  risultati2;
  quale = 0;
  quanti = 0;
  arrivatiDati = false;

  constructor(
    private apiService: ApiService,
    public variabiliGlobali: VariabiliGlobali
  ) {

  }

  chiusura() {
    this.chiusuraFinestra.emit(new Date().toString());
  }

  controllaConcorso() {
    const parametri = {
      idAnno: this.idAnno,
      idUtente: this.variabiliGlobali.idUser,
      ModalitaConcorso: this.ModalitaConcorso
    }
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.controllaConcorso(parametri)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            // 1;28|1;Pippa;Pippetta;1-2;2;1-1;X;3§%
            // IdUtente;PuntiTotali|idPartita;Squadra1;Squadra2;Risultato;Segno;Pronostico;PronosticoSegno;PuntiPartita§%
            const righe = data.split('%');
            // console.log('Righe', righe);
            const RisultatiFinali = new Array();
            let pari = false;
            righe.forEach(element => {
              if (element) {
                const parti = element.split('|');
                // console.log('Parti', parti);
                const Intest = parti[0].split(';');
                // console.log('Intest', Intest);
                const idUtente = +Intest[0];
                const nickName = Intest[1];
                const PuntiTotali = +Intest[2];
                let jolly = 0;
                const Risultati = parti[1].split('§');
                // console.log('Risultati', Risultati);
                const DettaglioArray = new Array();
                Risultati.forEach(element2 => {
                  if (element2) {
                    const Dettaglio = element2.split(';');
                    // console.log('Dettaglio', Dettaglio);
                    const dett = {
                      Pari: pari,
                      idPartita: +Dettaglio[0],
                      Squadra1: Dettaglio[1],
                      Squadra2: Dettaglio[2],
                      Risultato: Dettaglio[3],
                      Segno: Dettaglio[4],
                      Pronostico: Dettaglio[5],
                      PronosticoSegno: Dettaglio[6],
                      SegnoPreso: + Dettaglio[7],
                      RisultatoEsatto: +Dettaglio[8],
                      RisultatoCasaTot: +Dettaglio[9],
                      RisultatoFuoriTot: +Dettaglio[10],
                      SommaGoal: +Dettaglio[11],
                      DifferenzaGoal: +Dettaglio[12],
                      Punti: +Dettaglio[13],
                      Jolly: +Dettaglio[14]
                    };
                    jolly += +Dettaglio[14];
                    DettaglioArray.push(dett);
                  }
                  pari = !pari;
                });
                // console.log(DettaglioArray);
                const finale = {
                  Posizione: -1,
                  idUtente: idUtente,
                  NickName: nickName,
                  PuntiTotali: PuntiTotali,
                  Espanso: false,
                  Dettaglio: DettaglioArray,
                  PuntiTotaliJolly: jolly,
                  Squadra23: ''
                }
                this.quanti++;
                RisultatiFinali.push(finale);
                // console.log(RisultatiFinali);
              }
            });
            RisultatiFinali.sort((a, b) => a.PuntiTotali - b.PuntiTotali);
            let posizione = 0;
            RisultatiFinali.forEach(element => {
              element.Posizione = posizione;
              posizione++;
            });
            this.risultati = RisultatiFinali;

            this.prendeRisultati23();
         } else {
            alert(data);
          }
        }
      }
    );
  }

  prendeRisultati23() {
    const parametri = {
      idAnno: this.idAnno,
      idGiornata: this.variabiliGlobali.idConcorso
    }
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.ritornaSquadre23(parametri)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const torneo23 = data.split('§');
            console.log('Punti 23', torneo23);
            torneo23.forEach(element2 => {
              if (element2) {
                const t23 = element2.split(';');
                // console.log('idUtente ' + t23[0] + ' Punti23: ', t23[1]);
                const idUtente = +t23[0];
                const punti = +t23[1];
                const squadra = t23[2];
                this.risultati.forEach(element3 => {
                  if (+element3.idUtente === +idUtente) {
                    element3.Punti23 = punti;
                    element3.Squadra23 = squadra;
                  }
                });
              }
            });

            this.risultati2 = new Array();
            this.quale = 0;
            this.scriveMancanti();
            // console.log(this.risultati2);
            console.log('Risultati', this.risultati);
            this.arrivatiDati = true;
          }
        }
      }
    );


  }

  ritornaColoreBarra(r) {
    if (this.quale === this.quanti - 1 && r.Posizione === 0) {
      return '#f9bbbb';
    } else {
      if (this.quale === this.quanti - 1 && r.Posizione === this.quanti - 1) {
        return '#c3efc3';
      } else {
        if (r.NickName == this.variabiliGlobali.Utente) {
          return '#b2b4ff';
        } else {
          return 'transparent';
        }
      }
    }
  }

  mancanti;

  scriveMancanti() {
    const minimo = this.quanti * 2 / 4;
    const massimo = this.quanti * 3 / 4;
    const quanti = (this.quanti - 1) - this.quale;
    // console.log('Dove: ', quanti);
    // console.log('Minimo: ', minimo);
    // console.log('Massimo:', massimo);
    if (quanti === 0) {
      this.mancanti = 'Ce l\'hai fatta secco!';
    } else {
      if (quanti === 1) {
        this.mancanti = 'Daje, al prossimo finisci';
      } else {
        if (quanti === 2) {
          this.mancanti = 'Ci sei quasi, ne mancano 2';
        } else {
          if (quanti >= minimo && quanti <= massimo) {
            this.mancanti = 'Daje così... Ancora ' + quanti;
          } else {
            if (quanti > massimo) {
              this.mancanti = 'La strada è ancora lunga: ' + quanti;
            }
          }
        }
      }
    }
  }

  creaArray() {
    // console.log(this.quale, this.quanti);
    this.scriveMancanti();

    const r = new Array();
    let q = 0;
    let primo = true;
    if (this.quale === this.quanti - 1) {
      primo = false;
    }
    this.risultati.forEach(element => {
      if (q === 0 && this.quale < this.quanti - 1) {
        const finale = {
          Posizione: -999,
          idUtente: -1,
          NickName: 'XXXXXXX',
          PuntiTotali: -999,
          Espanso: false,
          Dettaglio: undefined,
          PuntiTotaliJolly: -1
        }
        r.push(finale);
      } else {
        if (q <= this.quale) {
          if (!primo) {
            r.push(element);
          } else {
            primo = false;
          }
        }
      }
      q++;
    });
    console.log(r);
    r.sort((a, b) => b.Posizione - a.Posizione);
    this.risultati2 = r;
  }

  avanza() {
    if (this.quale < this.quanti) {
      this.quale++;
      this.creaArray();
    }
  }

  indietreggia() {
    if (this.quale > 0) {
      this.quale--;
      this.creaArray();
    }
  }

  svela() {
    this.quale = this.quanti - 1;
    this.creaArray();
  }

  chiudeConcorso() {
    const parametri = {
      idAnno: this.idAnno
    }
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.impostaConcorsoControllato(parametri)
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

            this.chiusura();
          } else {
            alert(data);
          }
        }
      }
    );

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ModalitaConcorso && changes.ModalitaConcorso.currentValue) {
      if (changes.ModalitaConcorso.currentValue === 'Controllato') {
        this.controllaConcorso();
      }
    }
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

}
