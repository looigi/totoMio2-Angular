import { AfterViewInit, Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from "@angular/core";
import { VariabiliGlobali } from "../VariabiliGlobali.component";
import { ApiService } from "../services/api.service";

@Component({
  templateUrl: 'amministrazione.component.html',
  selector: 'amministrazione_component',
  styleUrls: ['./amministrazione.style.css']
})

export class AmministrazioneComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

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

  }

  ngAfterViewInit(): void {

  }

  InviaPromemoria() {
    const parametri = {
      idAnno: this.variabiliGlobali.idAnno
    }
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.inviaMailDiAvviso(parametri)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            alert('Promemoria inviato');
          } else {
            alert(data);
          }
        }
      }
    );
  }
}
