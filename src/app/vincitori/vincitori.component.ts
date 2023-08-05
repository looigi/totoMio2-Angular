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
  montePremi = 0;

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
            const campi = data.split('|');
            const perc = campi[0].split('§');
            const v = campi[1].split('§');
            const vv = new Array();
            let p = false;
            let tottot = 0;
            v.forEach(element => {
             if (element) {
              const vvv = element.split(';');
              let perc2;
              let totale;
              let vincita;
              perc.forEach(element2 => {
                if (element2) {
                  const pp = element2.split(';');
                  if (+pp[0] === +vvv[3]) {
                    perc2 = +pp[1];
                    totale = +pp[2];
                    vincita = +pp[3];
                    tottot += +pp[3];
                  }
                }
              });
              const immCoppa = this.prendeImmCoppa(vvv[0]);
              const vvvv = {
                Trofeo: vvv[0],
                idVincitore: +vvv[1],
                Vincitore: vvv[2],
                Pari: p,
                ImmagineGiocatore: this.variabiliGlobali.ritornaImmagineGiocatore(vvv[1]),
                idTorneo: +vvv[3],
                Percentuale: perc2,
                Totale: totale,
                Vincita: vincita ? '€' + vincita : '',
                ImmagineCoppa: immCoppa
              }
              vv.push(vvvv);
              p = !p;
             }
            });
            this.vincitori = vv;
            this.montePremi = tottot;
            console.log('Vincitori:', this.vincitori);
          } else {
            alert(data);
          }
        }
      }
    );
  }

  prendeImmCoppa(n) {
    // nomiCoppe = [ 'toto_mio', 'pijo', 'pippa', 'inutile', 'rotolo_di_coppa', '23' ]
    let nome = '';
    switch(n) {
      case 'Cucchiarella de legno':
        nome = 'cucchiarella';
        break;
      case 'Secondo':
        nome = 'secondo';
        break;
      case 'Terzo':
        nome = 'terzo';
        break;
      case 'Campione di TotoMIO':
        nome = 'campione';
        break;
      case 'TotoMio CUP':
        nome = 'toto_mio';
        break;
      case 'Pijo CUP':
        nome = 'pijo';
        break;
      case 'Pippa League':
        nome = 'pippa';
        break;
      case 'Coppa Inutile':
        nome = 'inutile';
        break;
      case 'Rotolo di Coppa':
        nome = 'rotolo_di_coppa';
        break;
      case '23 Aiutame Te':
        nome = '2';
        break;
    }
    if (nome !== '') {
      nome = '../assets/Immagini/' + nome + '.jpg';
    } else {
      if (n.indexOf('Pippone dei pipponi') > -1) {
        nome = '../assets/Immagini/pippone.jpg';
      } else {
        if (n.indexOf('Campione dei campioni') > -1) {
          nome = '../assets/Immagini/campionissimo.jpg';
        }
      }
    }
    return nome
  }
}
