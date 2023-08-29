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
  idTipologiaGrafico = 0;
  TipologiaGrafico = 'Classifica';
  TitoloGrafico = 'Classifica';
  Altro = '';
  Tipologie = [
    { id: 0, Tipologia: 'Classifica', Altro: '', Titolo: 'Classifica'},
    { id: 1, Tipologia: 'Posizioni', Altro: '', Titolo: 'Posizioni in classifica'},
    { id: 2, Tipologia: 'Punti', Altro: '', Titolo: 'Punti per giornata'},
    { id: 3, Tipologia: 'SegniPresi', Altro: '', Titolo: 'Segni presi per giornata'},
    { id: 4, Tipologia: 'RisultatiEsatti', Altro: '', Titolo: 'Risultati esatti per giornata'},
    { id: 5, Tipologia: 'RisultatiCasaTot', Altro: '', Titolo: 'Risultati in casa per giornata'},
    { id: 6, Tipologia: 'RisultatiFuoriTot', Altro: '', Titolo: 'Risultati fuori per giornata'},
    { id: 7, Tipologia: 'SommeGoal', Altro: '', Titolo: 'Somma Goal per giornata'},
    { id: 8, Tipologia: 'DifferenzeGoal', Altro: '', Titolo: 'Differenza Goal per giornata'},
    { id: 9, Tipologia: 'PuntiPartitaScelta', Altro: '', Titolo: 'Punti P. Scelta per giornata'},
    { id: 10, Tipologia: 'PuntiSorpresa', Altro: '', Titolo: 'Punti Sorpresa per giornata'},
    { id: 11, Tipologia: 'Jolly', Altro: 'Altro', Titolo: 'Jolly per giornata'},
    { id: 12, Tipologia: 'Vittorie', Altro: 'Altro', Titolo: 'Vittorie'},
    { id: 13, Tipologia: 'Ultimo', Altro: 'Altro', Titolo: 'Ultimo'},
  ]

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
    this.apiService.leggeGrafici(this.TipologiaGrafico, this.Altro)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const data2 = JSON.parse(data);
            console.log('Dati grafici', data2);

            let massimo = 0;
            data2.DatiGrafico.data[0].dataPoints.forEach(element => {
              if (element > massimo) {
                massimo = element;
              }
            });
            const puntazzi = {
              animationEnabled: true,
              title:{
                text: this.TitoloGrafico
              },
              axisX: {
                minimum: 1,
                maximum: massimo
              },
              axisY: {
                title: this.TitoloGrafico,
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
              data: data2.DatiGrafico.data
            };

            this.grafici = new CanvasJS.Chart("chartContainer", puntazzi);
            console.log(puntazzi);
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

  onChangeTipologia(e) {
    console.log(e, this.Tipologie);
    setTimeout(() => {
      this.Tipologie.forEach(element => {
        if (+element.id === +e) {
          this.Altro = element.Altro;
          this.TipologiaGrafico = element.Tipologia;
          this.TitoloGrafico = element.Titolo;
        }
      });
      console.log(this.TipologiaGrafico);
      this.caricaGrafici();
    }, 500);
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
