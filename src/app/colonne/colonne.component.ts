import { AfterViewInit, Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";

@Component({
  templateUrl: 'colonne.component.html',
  selector: 'colonne_component',
  styleUrls: ['./colonne.style.css']
})

export class ColonneComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  idUtente;
  utenti;
  colonna;

  constructor(
    private apiService: ApiService,
    public variabiliGlobali: VariabiliGlobali
  ) {
    this.idUtente = this.variabiliGlobali.idUser;
  }

  chiusura() {
    this.chiusuraFinestra.emit(new Date().toString());
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    this.leggeUtenti();
  }

  ngAfterViewInit(): void {

  }

  leggeUtenti() {
    this.variabiliGlobali.CaricamentoInCorso = true;

    this.apiService.letturaUtenti()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const u = data.split('§');
            const ut = new Array();
            u.forEach(element => {
              if (element) {
                const uu = element.split(';');
                const uuu = {
                  idUtente: +uu[0],
                  Utente: uu[1],
                  Cognome: uu[2],
                  Nome: uu[3]
                }
                ut.push(uuu);
              }
            });
            this.utenti = ut;
            console.log('Utenti: ', ut);

            this.leggeColonna();
          } else {
            alert(data);
          }
        }
      }
    )
  }

  leggeColonna() {
    this.variabiliGlobali.CaricamentoInCorso = true;

    this.apiService.ritornaColonna(this.idUtente)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const u = data.split('§');
            const ut = new Array();
            let p = true;
            u.forEach(element => {
              if (element) {
                const uu = element.split(';');
                const uuu = {
                  idPartita: +uu[0],
                  Casa: uu[1],
                  Fuori: uu[2],
                  Pronostico: uu[3],
                  Segno: uu[4],
                  Pari: p,
                  ImmagineCasa: this.variabiliGlobali.ritornaImmagineSquadra(uu[1]),
                  ImmagineFuori: this.variabiliGlobali.ritornaImmagineSquadra(uu[2]),
                }
                p = !p;
                ut.push(uuu);
              }
            });
            this.colonna = ut;
            console.log('Colonna: ', ut);
          } else {
            alert(data);
          }
        }
      }
    )
  }

  onChangePresentatore(e) {
    // this.presentatore = e;
    this.leggeColonna();
  }
}
