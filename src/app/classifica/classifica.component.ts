import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";

@Component({
  templateUrl: 'classifica.component.html',
  selector: 'classifica_component',
  styleUrls: ['./classifica.style.css']
})

export class ClassificaComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() idAnno;
  @Input() DescrizioneAnno;
  @Input() NumeroConcorso;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  classifica;
  idAnno2;
  idConcorso2;

  constructor(
    private apiService: ApiService,
    private variabiliGlobali: VariabiliGlobali
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
      this.leggeClassifica();
    }
  }

  indietro() {
    if (this.idConcorso2 > 1) {
      this.idConcorso2--;
      this.leggeClassifica();
    }
  }

  avanti() {
    this.idConcorso2++;
    this.leggeClassifica();
  }

  leggeClassifica() {
    const parametri = {
      idAnno: this.idAnno2,
      idConcorso: this.idConcorso2
    }
    this.apiService.leggeClassifica(parametri)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const righe = data.split('§');
            const classif = new Array();
            let posizione = 1;
            let pari = false;
            righe.forEach(element => {
              if (element) {
                const c = element.split(';');
                const cc = {
                  Pari: pari,
                  Posizione: posizione,
                  idUtente: +c[0],
                  NickName: c[1],
                  Punti: +c[2],
                  RisultatiEsatti: +c[3],
                  RisCasaTot: +c[4],
                  RisFuoriTot: +c[5],
                  Segni: +c[6],
                  SommaGoal: +c[7],
                  DifferenzeGoal: +c[8],
                  Giocate: +c[9]
                }
                pari = !pari
                posizione++;
                classif.push(cc);
              }
            });
            this.classifica = classif;
            console.log(this.classifica);
          }
        }
      }
    );
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

}
