import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";

@Component({
  templateUrl: 'coppe.component.html',
  selector: 'coppe_component',
  styleUrls: ['./coppe.style.css']
})

export class CoppeComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() idAnno;
  @Input() DescrizioneAnno;
  @Input() NumeroConcorso;
  @Input() ModalitaConcorso;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  coppaScelta = 0;
  idAnno2;
  idConcorso23;
  idConcorso2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  maxGiornata = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  errore;
  classifica;
  partite;
  semifinale;
  finale;
  coppe;
  pannelloSemifinale = false;
  pannelloFinale = false;
  classifica23;
  giornata23;

  constructor(
    private apiService: ApiService,
    public variabiliGlobali: VariabiliGlobali
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
      this.idConcorso23 = changes.NumeroConcorso.currentValue;
      // alert(this.idConcorso23);
    }
    if (this.idAnno2) {
      this.leggeDatiCoppa();
    }
  }

  ngOnInit(): void {
    this.leggeNomiCoppe();
  }

  ngAfterViewInit(): void {

  }

  leggeNomiCoppe() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.ritornaNomiCoppe()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const righe = data.split('§');
            const coppe = new Array();
            righe.forEach(element => {
              if (element) {
                const c = element.split(';');
                const r = {
                  idCoppa: +c[0],
                  NomeCoppa: c[1],
                  Semifinale: c[2] === 'S',
                  Finale: c[3] === 'S'
                }
                coppe.push(r);
              }
            });
            this.coppe = coppe;
          } else {

          }
        } else {

        }
      }
    );
  }

  indietro() {
    if (this.idConcorso2[this.coppaScelta] > 1) {
      this.idConcorso2[this.coppaScelta]--;
      this.leggeDatiCoppa();
    }
  }

  avanti() {
    if (this.idConcorso2[this.coppaScelta] < this.maxGiornata[this.coppaScelta]) {
      this.idConcorso2[this.coppaScelta]++;
      this.leggeDatiCoppa();
    }
  }

  indietro23() {
    if (this.idConcorso23 > 1) {
      this.idConcorso23--;
      this.legge23();
    }
  }

  avanti23() {
    if (this.idConcorso23 < 38) {
      this.idConcorso23++;
      this.legge23();
    }
  }

  leggeCoppa(i) {
    console.log('Coppa scelta: ', i);
    if (i !== 1) {
      this.pannelloSemifinale = false;
      this.pannelloFinale = false;
      this.coppaScelta = i;
      this.leggeDatiCoppa();
    } else {
      this.coppaScelta = 1;
      this.legge23();
    }
  }

  legge23() {
    const params = {
      idAnno: this.idAnno2,
      idConcorso: this.idConcorso23
    }

    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.ritorna23(params)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            // console.log(data);
            const parti = data.split('|');
            const classifica = parti[0].split('§');
            const giornata = parti[1].split('§');
            // console.log(classifica, giornata);

            const c = new Array();
            let pos = 1;
            let pari = true;
            classifica.forEach(element => {
              if (element) {
                const cc = element.split(';');
                const ccc = {
                  Numero: pos,
                  idUtente: +cc[0],
                  NickName: cc[1],
                  Punti: +cc[2],
                  Pari: pari,
                  Avatar: this.variabiliGlobali.ritornaImmagineGiocatore(cc[0])
                }
                c.push(ccc);
              }
            });
            c.sort((a, b) => b.Punti - a.Punti);
            c.forEach(element => {
              element.Pari = pari;
              element.Numero = pos;
              pari = !pari;
              pos++;
            });
            this.classifica23 = c;

            const p = new Array();
            let n = 1;
            pari = true;
            giornata.forEach(element => {
              if (element) {
                const cc = element.split(';');
                const ccc = {
                  Numero: n,
                  idUtente: +cc[0],
                  NickName: cc[1],
                  Squadra: cc[2],
                  Punti: +cc[3],
                  Pari: pari,
                  Avatar: this.variabiliGlobali.ritornaImmagineGiocatore(cc[0])
                }
                p.push(ccc);
              }
            });
            p.sort((a, b) => b.Punti - a.Punti);
            n = 1;
            p.forEach(element => {
              element.Numero = n;
              element.Pari = pari;
              pari = !pari;
              n++;
            });
            this.giornata23 = p;

            // console.log('Classifica 23', this.classifica23);
            // console.log('Giornata 23', this.giornata23);

            this.errore = '';
          }
        }
      }
    );
  }

  leggeDatiCoppa() {
    let Torneo = '';
    switch (this.coppaScelta) {
      case 0:
        Torneo = '1';
        break;
      case 1:
        Torneo = '2';
        break;
      case 2:
        Torneo = '3';
        break;
      case 3:
        Torneo = '4';
        break;
      case 4:
        Torneo = '5';
        break;
    }
    this.errore  = '';
    this.classifica = undefined;
    this.partite = undefined;

    if (this.idConcorso2[this.coppaScelta] > 0) {
      this.leggeDatiCoppa2(Torneo);
    } else {
      const params = {
        idAnno: this.idAnno2,
        idCoppa: Torneo
      }

      this.variabiliGlobali.CaricamentoInCorso = true;
      this.apiService.ritornaMaxGiornataCoppe(params)
      .map((response: any) => response)
      .subscribe((data2: string | string[]) => {
          this.variabiliGlobali.CaricamentoInCorso = false;
          if (data2) {
            const data = this.apiService.SistemaStringaRitornata(data2);
            if (data.indexOf('ERROR') === -1) {
              const d = data.split(';');
              this.idConcorso2[this.coppaScelta] = +d[0];
              this.maxGiornata[this.coppaScelta] = + d[1];
              // alert(this.coppaScelta + ': ' + this.idConcorso2[this.coppaScelta]);
              this.leggeDatiCoppa2(Torneo);
            } else {
            }
          } else {
          }
        }
      );
    }
  }

  leggeDatiCoppa2(Torneo) {
    const params = {
      idAnno: this.idAnno2,
      idGiornata: this.idConcorso2[this.coppaScelta],
      Torneo: Torneo
    }

    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.ritornaDatiCoppa(params)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const dati = data.split('|');
            const classifica = dati[0].split('§');
            const partite = dati[1].split('§');
            const semifinale = dati[2].split('§');
            const finale = dati[3].split('§');

            // console.log(partite, finale);

            const classif = new Array();
            let pari = false;
            let pos = 0;
            let vecchioPunti = -1;
            classifica.forEach(element => {
              if (element) {
                const cc = element.split(';');
                if (vecchioPunti !== +cc[2]) {
                  pos++;
                  vecchioPunti = +cc[2];
                }
                const c = {
                  Posizione: pos,
                  idGiocatore: +cc[0],
                  NickName: cc[1],
                  Punti: +cc[2],
                  Pari: pari,
                  Avatar: this.variabiliGlobali.ritornaImmagineGiocatore(cc[0])
                }
                pari = !pari;
                classif.push(c);
              }
            });

            this.classifica = classif;

            const partit = new Array();
            let numero = 1;
            pari = false;
            partite.forEach(element => {
              if (element) {
                const cc = element.split(';');
                const c = {
                  Numero: numero,
                  Casa: cc[0],
                  Fuori: cc[1],
                  Vincente: +cc[2],
                  Pari: pari,
                  Risultato1: cc[3],
                  Risultato2: cc[4]
                }
                pari = !pari;
                partit.push(c);
                numero++;
              }
            });
            this.partite = partit;

            const semif = new Array();
            pari = false;
            semifinale.forEach(element => {
              if (element) {
                const cc = element.split(';');
                const c = {
                  Numero: +cc[0],
                  Casa: cc[1],
                  Fuori: cc[2],
                  Risultato1: cc[3],
                  Risultato2: cc[4],
                  Vincente: +cc[5],
                  Pari: pari,
                }
                pari = !pari;
                semif.push(c);
              }
            });
            this.semifinale = semif;

            const fin = new Array();
            pari = false;
            finale.forEach(element => {
              if (element) {
                const cc = element.split(';');
                const c = {
                  Numero: +cc[0],
                  Casa: cc[1],
                  Fuori: cc[2],
                  Risultato1: cc[3],
                  Risultato2: cc[4],
                  Vincente: +cc[5],
                  Pari: pari,
                }
                pari = !pari;
                fin.push(c);
              }
            });
            this.finale = fin;

            // console.log('Dati coppa', classif, partit, semif, fin);

            this.errore = undefined;
          } else {
            if (data.toUpperCase().indexOf('NESSUN DATO') > -1) {
              this.errore = data;
            }
          }
        } else {

        }
      }
    );
  }
}
