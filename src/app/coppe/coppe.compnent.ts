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
  // @Input() NumeroConcorso;
  @Input() ModalitaConcorso;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  coppaScelta = 1;
  idAnno2;
  idConcorso2 = 1;
  errore;
  classifica;
  partite;

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
      this.idConcorso2 = changes.NumeroConcorso.currentValue;
    }
    if (this.idAnno2 && this.idConcorso2) {
      this.leggeDatiCoppa();
    }
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

  indietro() {
    if (this.idConcorso2 > 1) {
      this.idConcorso2--;
      this.leggeDatiCoppa();
    }
  }

  avanti() {
    this.idConcorso2++;
    this.leggeDatiCoppa();
  }

  leggeDatiCoppa() {
    let Torneo = '';
    switch (this.coppaScelta) {
      case 1:
        Torneo = 'Rotolo';
        break;
      case 2:
        Torneo = 'Coppata';
        break;
      case 3:
        Torneo = 'TotoMIO';
        break;
      case 4:
        Torneo = 'Settimini';
        break;
      case 5:
        Torneo = 'Pippettero';
        break;
    }
    this.errore  = '';
    this.classifica = undefined;
    this.partite = undefined;

    const params = {
      idAnno: this.idAnno2,
      idGiornata: this.idConcorso2,
      Torneo: Torneo
    }

    this.apiService.ritornaDatiCoppa(params)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const dati = data.split('|');
            const classifica = dati[0].split('§');
            const partite = dati[1].split('§');

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
                  Pari: pari
                }
                pari = !pari;
                classif.push(c);
              }
            });

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
                  Pari: pari
                }
                pari = !pari;
                partit.push(c);
                numero++;
              }
            });

            this.classifica = classif;
            this.partite = partit;
            console.log('Dati coppa', classif, partit);

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
