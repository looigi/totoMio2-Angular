import { AfterViewInit, Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from "@angular/core";
import { VariabiliGlobali } from "../VariabiliGlobali.component";
import { ApiService } from "../services/api.service";

@Component({
  templateUrl: 'statistiche.component.html',
  selector: 'statistiche_component',
  styleUrls: ['./statistiche.style.css']
})

export class StatisticheComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  tipologia = 'Annuale';
  modalita = 'GENERALE';
  datiCompleti;
  datiDaVisualizzare;

  constructor(
    public variabiliGlobali: VariabiliGlobali,
    private apiService: ApiService
  ) {
  }

  chiusura() {
    this.chiusuraFinestra.emit(new Date().toString());
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    this.leggeStatistiche();
  }

  ngAfterViewInit(): void {

  }

  leggeStatistiche() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.leggeStatistiche()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            this.datiCompleti = JSON.parse(data);
            console.log('Statistiche:', this.datiCompleti);
            // const annuale = datiCompleti.Annuale;
            // const storico = datiCompleti.Storico;
            this.datiDaVisualizzare = this.datiCompleti.Annuale;
          } else {
            alert(data);
          }
        }
      }
    );
  }

  cambiaTipologia(c) {
    this.tipologia = c;
    if (c === 'Annuale') {
      this.datiDaVisualizzare = this.datiCompleti.Annuale;
    } else {
      this.datiDaVisualizzare = this.datiCompleti.Storico;
    }
  }

  prendeImmagineSquadra(s) {
    return this.variabiliGlobali.ritornaImmagineSquadra(s);
  }

  prendeImmagineGiocatore(i) {
    return this.variabiliGlobali.ritornaImmagineGiocatore(i.toString());
  }

  mostraDettaglio(d) {
    if (d.Visibile === 'True') {
      d.Visibile = 'False';
    } else {
      d.Visibile = 'True';
    }
  }
}
