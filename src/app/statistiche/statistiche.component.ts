import { AfterViewInit, Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from "@angular/core";
import { VariabiliGlobali } from "../VariabiliGlobali.component";
import { ApiService } from "../services/api.service";
import * as CanvasJS from '../../assets/js/canvasjs.min.js';

@Component({
  templateUrl: 'statistiche.component.html',
  selector: 'statistiche_component',
  styleUrls: ['./statistiche.style.css']
})

export class StatisticheComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  canvJS = CanvasJS;
  tipologia = 'Annuale';
  modalita = 'GENERALE';
  datiCompleti;
  datiDaVisualizzare;
  grafici;
  TipologiaGrafico = 'Posizioni';

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

  caricaGrafici() {
    this.modalita = 'GRAFICI';
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.leggeGrafici(this.TipologiaGrafico)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const data2 = JSON.parse(data);
            // console.log(data2);
            let massimo = 0;
            data2.Punti.data[0].dataPoints.forEach(element => {
              if (element > massimo) {
                massimo = element;
              }
            });
            const puntazzi = {
              animationEnabled: true,
              title:{
                text: "Posizioni in classifica"
              },
              axisX: {
                minimum: 1,
                maximum: massimo
              },
              axisY: {
                title: "Posizione",
                titleFontColor: "#4F81BC",
                lineColor: "#4F81BC",
                labelFontColor: "#4F81BC",
                tickColor: "#4F81BC"
              },
              toolTip: {
                shared: false
              },
              legend: {
                cursor:"pointer",
                itemclick: this.toggleDataSeries.bind(null, this),
              },
              data: data2.Punti.data
            };

            this.grafici = new CanvasJS.Chart("chartContainer", puntazzi);
            // console.log(puntazzi);
            this.grafici.render();
          } else {
            alert(data);
          }
        }
      }
    );
  }

  toggleDataSeries = function(t, e) {
    // console.log(e);
    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    t.grafici.render();
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
