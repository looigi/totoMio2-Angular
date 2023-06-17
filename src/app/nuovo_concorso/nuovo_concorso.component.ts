import { AfterViewInit, Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";

@Component({
  templateUrl: 'nuovo_concorso.component.html',
  selector: 'nuovo-concorso-component',
  styleUrls: ['./nuovo_concorso.component.css']
})

export class NuovoConcorsoComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() idAnno;
  @Input() NumeroConcorso;
  @Input() DescrizioneAnno;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  partite = new Array();
  idAnno2;
  NumeroConcorso2;

  constructor(
    private apiService: ApiService,
    private variabiliGlobali: VariabiliGlobali
  ) {

  }

  ngOnInit(): void {
  }

  leggeConcorso() {
    this.apiService.ritornaConcorso(this.idAnno2, this.NumeroConcorso2)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const c = data.split('§');
            const p = new Array();
            c.forEach(element => {
              if (element) {
                const cc = element.split(';');
                const ccc = {
                  idPartita: +cc[0],
                  Prima: this.variabiliGlobali.sistemaStringaDaPassaggio(cc[1]),
                  Seconda: this.variabiliGlobali.sistemaStringaDaPassaggio(cc[2]),
                  Risultato: cc[3],
                  Segno: cc[4]
                }
                p.push(ccc);
              }
            });
            this.partite = p;
          } else {
            this.partite = new Array();
          }
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
  }

  salvaConcorso() {
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
    this.apiService.salvaConcorso(parametri)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
          } else {
            alert(data);
          }
        }
      }
    );
  }
}
