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
  @Input() ModalitaConcorso;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  risultati;
  arrivatiDati = false;

  constructor(
    private apiService: ApiService,
    public variabiliGlobali: VariabiliGlobali
  ) {

  }

  chiusura() {
    this.chiusuraFinestra.emit(new Date().toString());
  }

  controllaConcorso() {
    const parametri = {
      idAnno: this.idAnno,
      idUtente: this.variabiliGlobali.idUser,
      ModalitaConcorso: this.ModalitaConcorso
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
            let pari = false;
            righe.forEach(element => {
              if (element) {
                const parti = element.split('|');
                // console.log('Parti', parti);
                const Intest = parti[0].split(';');
                // console.log('Intest', Intest);
                const idUtente = +Intest[0];
                const nickName = Intest[1];
                const PuntiTotali = +Intest[2];
                const Risultati = parti[1].split('§');
                // console.log('Risultati', Risultati);
                const DettaglioArray = new Array();
                Risultati.forEach(element2 => {
                  if (element2) {
                    const Dettaglio = element2.split(';');

  // idPartita & ";" & Squadra1 & ";" & Squadra2 & ";" & Risultato & ";" & RisultatoSegno & ";" & Pronostico2 & ";" & PronosticoSegno & ";" &
	// SegnoPreso & ";" & RisultatoEsattoPartita & ";" & RisultatoCasaPartita & ";" & RisultatoFuoriPartita & ";" & SommaGoalPartita & ";" &
	// DifferenzaGoalPartita & ";"
	// 				Ritorno &= Punti
                    const dett = {
                      Pari: pari,
                      idPartita: +Dettaglio[0],
                      Squadra1: Dettaglio[1],
                      Squadra2: Dettaglio[2],
                      Risultato: Dettaglio[3],
                      Segno: Dettaglio[4],
                      Pronostico: Dettaglio[5],
                      PronosticoSegno: Dettaglio[6],
                      SegnoPreso: + Dettaglio[7],
                      RisultatoEsatto: +Dettaglio[8],
                      RisultatoCasaTot: +Dettaglio[9],
                      RisultatoFuoriTot: +Dettaglio[10],
                      SommaGoal: +Dettaglio[11],
                      DifferenzaGoal: +Dettaglio[12],
                      Punti: +Dettaglio[13],
                    };
                    DettaglioArray.push(dett);
                    // console.log(DettaglioArray);
                  }
                  pari = !pari;
                });
                const finale = {
                  idUtente: idUtente,
                  NickName: nickName,
                  PuntiTotali: PuntiTotali,
                  Espanso: false,
                  Dettaglio: DettaglioArray
                }
                RisultatiFinali.push(finale);
                // console.log(RisultatiFinali);
              }
            });
            RisultatiFinali.sort((a, b) => a.PuntiTotali - b.PuntiTotali);
            this.risultati = RisultatiFinali;
            console.log(this.risultati);
            this.arrivatiDati = true;
          } else {
            alert(data);
          }
        }
      }
    );
  }

  chiudeConcorso() {
    const parametri = {
      idAnno: this.idAnno
    }
    this.apiService.impostaConcorsoControllato(parametri)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ModalitaConcorso && changes.ModalitaConcorso.currentValue) {
      if (changes.ModalitaConcorso.currentValue === 'Controllato') {
        this.controllaConcorso();
      }
    }
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

}
