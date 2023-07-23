import { AfterViewInit, Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";

@Component({
  templateUrl: 'chiusura_concorso.component.html',
  selector: 'chiusura_concorsocomponent',
  styleUrls: ['./chiusura_concorso.style.css']
})

export class ChiusuraConcorsoComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() idAnno;
  @Input() NumeroConcorso;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private apiService: ApiService,
    private variabiliGlobali: VariabiliGlobali
  ) {

  }

  chiusura() {
    this.chiusuraFinestra.emit(new Date().toString());
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

  chiudeConcorso() {
    const parametri = {
      idAnno: this.idAnno
    }
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.impostaConcorsoPerControllo(parametri)
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
}
