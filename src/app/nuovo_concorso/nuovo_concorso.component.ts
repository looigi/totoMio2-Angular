import { AfterViewInit, Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from "@angular/core";
import { ApiService } from "../services/api.service";

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

  constructor(private apiService: ApiService) {

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
                  Prima: cc[1],
                  Seconda: cc[2],
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
    if (changes["idAnno"] && changes["idAnno"].currentValue) {
      this.idAnno2 = changes["idAnno"].currentValue;
    }
    if (changes["NumeroConcorso"] && changes["NumeroConcorso"].currentValue) {
      this.NumeroConcorso2 = changes["NumeroConcorso"].currentValue;
    }
    if (this.idAnno2 && this.NumeroConcorso2) {
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

  }

  salvaConcorso() {

  }
}
