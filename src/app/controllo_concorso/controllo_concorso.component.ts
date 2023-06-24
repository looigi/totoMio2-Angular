import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";

@Component({
  templateUrl: 'controllo_concorso.component.html',
  selector: 'controllo_concorsocomponent',
  styleUrls: ['./controllo_concorso.style.css']
})

export class ControlloConcorsoComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() idAnno;
  @Input() DescrizioneAnno;
  @Input() NumeroConcorso;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  risultati;

  constructor(
    private apiService: ApiService,
    private variabiliGlobali: VariabiliGlobali
  ) {

  }

  chiusura() {
    this.chiusuraFinestra.emit(new Date().toString());
  }

  controllaConcorso() {
    const parametri = {
      idAnno: this.idAnno,
      idUtente: this.variabiliGlobali.idUser
    }
    this.apiService.controllaConcorso(parametri)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            // 1;28|1;Pippa;Pippetta;1-2;2;1-1;X;3§%
            // IdUtente;PuntiTotali|idPartita;Squadra1;Squadra2;Risultato;Segno;Pronostico;PronosticoSegno;PuntiPartita§%
            const righe = data.split('%');
            // console.log('Righe', righe);
            const RisultatiFinali = new Array();
            righe.forEach(element => {
              if (element) {
                const parti = element.split('|');
                // console.log('Parti', parti);
                const Intest = parti[0].split(';');
                // console.log('Intest', Intest);
                const idUtente = +Intest[0];
                const PuntiTotali = +Intest[1];
                const Risultati = parti[1].split('§');
                // console.log('Risultati', Risultati);
                const DettaglioArray = new Array();
                Risultati.forEach(element2 => {
                  if (element2) {
                    const Dettaglio = element2.split(';');
                    const dett = {
                      idPartita: +Dettaglio[0],
                      Squadra1: Dettaglio[1],
                      Squadra2: Dettaglio[2],
                      Risultato: Dettaglio[3],
                      Segno: Dettaglio[4],
                      Pronostico: Dettaglio[5],
                      PronosticoSegno: Dettaglio[6],
                      Punti: +Dettaglio[7]
                    };
                    DettaglioArray.push(dett);
                    // console.log(DettaglioArray);
                  }
                });
                const finale = {
                  idUtente: idUtente,
                  PuntiTotali: PuntiTotali,
                  Espanso: false,
                  Dettaglio: DettaglioArray
                }
                RisultatiFinali.push(finale);
                // console.log(RisultatiFinali);
              }
            });
            this.risultati = RisultatiFinali;
            console.log(this.risultati);
          } else {
            alert(data);
          }
        }
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

}
