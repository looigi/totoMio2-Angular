import { AfterViewInit, Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from "@angular/core";
import { VariabiliGlobali } from "../VariabiliGlobali.component";
import { ApiService } from "../services/api.service";

@Component({
  templateUrl: 'amministrazione.component.html',
  selector: 'amministrazione_component',
  styleUrls: ['./amministrazione.style.css']
})

export class AmministrazioneComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() refresh;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  inadempienti;
  restore;
  visualizzaRestore = false;

  constructor(
    private apiService: ApiService,
    public variabiliGlobali: VariabiliGlobali
  ) {

  }

  chiusura() {
    this.chiusuraFinestra.emit(new Date().toString());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.refresh && changes.refresh.currentValue) {
      if (this.variabiliGlobali.idModalitaConcorso === 1) {
        this.LeggeInadempienti();
      }
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }

  CreazioneNuovoAnno() {

  }

  LeggeInadempienti() {
    const parametri = {
      idAnno: this.variabiliGlobali.idAnno
    }
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.LeggeInadempienti()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            this.inadempienti = data.split('§');
          } else {
            alert(data);
          }
        }
      }
    );
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

  effettuaBackup() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.effettuaBackup()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            alert('Backup Effettuato: ' + data);
          } else {
            alert(data);
          }
        }
      }
    );
  }

  creaUtenteFinto() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.creaUtenteFinto()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            alert('Utente finto creato: ' + data);
          } else {
            alert(data);
          }
        }
      }
    );
  }

  effettuaRestore() {
    this.variabiliGlobali.CaricamentoInCorso = true;
    this.apiService.ritornaBackups()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const righe = data.split('§');
            const rr = new Array();
            let p = true;
            righe.forEach(element => {
              if (element) {
                const r = element.split(';');
                const rrr = {
                  idBackup: +r[0],
                  Data: r[1],
                  NomeFile: element,
                  Pari: p
                }
                p = !p;
                rr.push(rrr);
              }
            });
            this.restore = rr;
            this.visualizzaRestore = true;
          } else {
            alert(data);
          }
        }
      }
    );
  }

  effettuaRestore2(r) {
    this.variabiliGlobali.CaricamentoInCorso = true;
    const params = {
      QualeBackup: r.NomeFile
    }
    this.apiService.effettuaRestore(params)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.variabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            alert('Restore effettuato');
            this.visualizzaRestore = false;
          } else {
            alert(data);
          }
        }
      }
    );
  }
}
