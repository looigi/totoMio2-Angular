import { AfterViewInit, Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";

@Component({
  templateUrl: 'vincitori.component.html',
  selector: 'vincitori_component',
  styleUrls: ['./vincitori.style.css']
})

export class VincitoriComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  vincitori;

  constructor(
    private apiService: ApiService,
    public variabiliGlobali: VariabiliGlobali
  ) {

  }

  chiusura() {
    this.chiusuraFinestra.emit(new Date().toString());
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    this.leggeVincitori();
  }

  ngAfterViewInit(): void {

  }

  leggeVincitori() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.ritornaVincitori()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const v = data.split('§');
            const vv = new Array();
            let p = false;
            v.forEach(element => {
             if (element) {
              const vvv = element.split(';');
              const vvvv = {
                Trofeo: vvv[0],
                Vincitore: vvv[1],
                Pari: p
              }
              vv.push(vvvv);
              p = !p;
             }
            });
            this.vincitori = vv;
          } else {
            alert(data);
          }
        }
      }
    );
  }
}
