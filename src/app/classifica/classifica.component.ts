import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";

@Component({
  templateUrl: 'classifica.component.html',
  selector: 'classifica_component',
  styleUrls: ['./classifica.style.css']
})

export class ClassificaComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() idAnno;
  @Input() DescrizioneAnno;
  @Input() NumeroConcorso;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  classifica;
  idAnno2;
  idConcorso2 = 0;

  popupVisibile = false;
  popupX = 100;
  popupY = 100;
  immaginePopup;
  immaginePopup2;
  screenHeight;
  screenWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
     this.screenHeight = window.innerHeight;
     this.screenWidth = window.innerWidth;
  }

  constructor(
    private apiService: ApiService,
    public variabiliGlobali: VariabiliGlobali
  ) {
    this.onResize();
  }

  popupShow(q, e) {
    // console.log(e, this.screenWidth, this.screenHeight);
    this.immaginePopup = this.classifica[q].Avatar;
    this.immaginePopup2 = this.classifica[q].Sfondo;
    this.popupVisibile = true;
    this.popupX = e.x + 50;
    if (e.y + 220 > this.screenHeight) {
      this.popupY = e.y - 220;
    } else {
      this.popupY = e.y - 30;
    }
  }

  popupSpento() {
    this.popupVisibile = false;
  }

  chiusura() {
    this.chiusuraFinestra.emit(new Date().toString());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idAnno && changes.idAnno.currentValue) {
      this.idAnno2 = changes.idAnno.currentValue;
    }
    if (changes.NumeroConcorso && changes.NumeroConcorso.currentValue) {
      this.idConcorso2 = changes.NumeroConcorso.currentValue;
    }
    if (this.idAnno2) {
      this.leggeClassifica();
    }
  }

  indietro() {
    if (this.idConcorso2 > 1) {
      this.idConcorso2--;
      this.leggeClassifica();
    }
  }

  avanti() {
    this.idConcorso2++;
    this.leggeClassifica();
  }

  leggeClassifica() {
    const parametri = {
      idAnno: this.idAnno2,
      idConcorso: this.idConcorso2,
      MostraFinto: 'S'
    }
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.leggeClassifica(parametri)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const righe = data.split('§');
            const classif = new Array();
            let posizione = 1;
            let pari = false;
            righe.forEach(element => {
              if (element) {
                const c = element.split(';');
                // console.log(c);
                let avatar;
                avatar = this.variabiliGlobali.ritornaImmagineGiocatore(c[0]) + '?d=' + new Date().toString();
                if (c[1] === 'Fintone') {
                  avatar = '../assets/Immagini/finto.png';
                }
                const cc = {
                  Pari: pari,
                  Posizione: posizione,
                  idUtente: +c[0],
                  NickName: c[1],
                  Punti: +c[2],
                  RisultatiEsatti: +c[3],
                  RisCasaTot: +c[4],
                  RisFuoriTot: +c[5],
                  Segni: +c[6],
                  SommaGoal: +c[7],
                  DifferenzeGoal: +c[8],
                  Giocate: +c[9],
                  Vittorie: +c[10],
                  Ultimo: +c[11],
                  Jolly: +c[12],
                  PuntiPartitaScelta: +c[13],
                  PuntiSorpresa: +c[14],
                  Avatar: avatar,
                  Sfondo: this.variabiliGlobali.urlSfondo + this.variabiliGlobali.idAnno + '/' +
                    c[0] + '.png?d=' + new Date().toString()
                }
                pari = !pari
                posizione++;
                classif.push(cc);
              }
            });
            this.classifica = classif;
            console.log(this.classifica);
          }
        }
      }
    );
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

}
