import { Component, OnInit } from '@angular/core';
import { VariabiliGlobali } from './VariabiliGlobali.component';
import { ApiService } from './services/api.service';
import 'rxjs/add/operator/map';
import { DatePipe } from "@angular/common";
import * as jsonData from '../assets/connessione.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'totoMio2';

  connessione: any = jsonData;

  menuVisibile = false;
  mascheraNuovoUtente = false;
  mascheraLogin = false;

  loginEffettuato = false;
  user = '';
  password = '';
  nickName = '';
  passwordNU = '';
  cognome = '';
  nome = '';
  eMail = '';
  ricordami = false;
  eventi;
  scadenzaConcorso = undefined;
  scadenzaConcorso2 = '';
  messaggiRicevuti = 0;
  refreshAdmin = '';
  novita = true;
  immagineDiSfondo = '';
  utenti;
  presentatore = 0;

  nuovoConcorsoVisibile = false;
  pronosticiVisibile = false;
  gestioneConcorso = false;
  chiusuraConcorso = false;
  controlloConcorso = false;
  classifica = false;
  coppeVisibile = false;
  infoVisibile = false;
  adminVisibile = false;
  vincitoriVisibile = false;
  bilancioVisibile = false;
  gestioneUtenteVisibile = false;
  uploadVisibile = false;
  chatVisibile = false;
  statisticheVisibile = false;

  constructor(
    public VariabiliGlobali: VariabiliGlobali,
    private apiService: ApiService,
    private datePipe: DatePipe,
  ) {
    this.VariabiliGlobali.urlWS = this.connessione.indirizzoWS;
    this.VariabiliGlobali.collaudo = this.connessione.Collaudo;
    console.log('Indirizzo WS:', this.VariabiliGlobali.urlWS, this.connessione.Collaudo);
  }

  ngOnInit() {
    const novita = localStorage.getItem('novita');
    if (novita !== null) {
      this.novita = novita === 'S';
    }
    const ric = localStorage.getItem('ricordami');
    if (ric !== null) {
      this.ricordami = ric === 'S' ? true : false;
    }

    const anno = localStorage.getItem('AnnoAttuale');
    if (anno !== null) {
      this.VariabiliGlobali.idAnno = +anno;
    }

    this.VariabiliGlobali.CaricamentoInCorso = false;
    if (this.ricordami) {
      const login = localStorage.getItem('login');
      if (login !== null) {
        const r = login.split(';');
        this.splittaCampiLogin(r);

        this.ritornaDatiGlobali();
      }
    }

    this.leggeUtenti();
  }

  leggeUtenti() {
    this.VariabiliGlobali.CaricamentoInCorso = true;

    this.apiService.letturaUtenti()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.VariabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const u = data.split('§');
            const ut = new Array();
            ut.push({idUtente: 0, Utente: 'Nessuno'});
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
            this.presentatore = 0;
            console.log('Utenti: ', ut);
          } else {
            alert(data);
          }
        }
      }
    )
  }

  onChangePresentatore(e) {
    // this.presentatore = e;
  }

  chiudeNovita() {
    this.novita = false;
    localStorage.setItem('novita', 'N');
  }

  cambioRicordami() {
    this.ricordami = !this.ricordami;
    localStorage.setItem('ricordami', this.ricordami === true ? 'S' : 'N');
  }

  apreChiudeMenu() {
    this.menuVisibile = !this.menuVisibile;
  }

  selezionePagina(n: any) {
    const i = +this.VariabiliGlobali.pagine[n].idTasto;
    console.log('Pagina ', i);
    switch(i) {
      case 0: // NUOVO CONCORSO
        this.nuovoConcorsoVisibile = true;
        this.classifica = false;
        this.controlloConcorso = false;
        this.pronosticiVisibile = false;
        this.chiusuraConcorso = false;
        this.gestioneConcorso = false;
        this.coppeVisibile = false;
        this.infoVisibile = false;
        this.adminVisibile = false;
        this.vincitoriVisibile = false;
        this.bilancioVisibile = false;
        this.chatVisibile = false;
        this.statisticheVisibile = false;
        break;
      case 1: // CLASSIFICA
        this.nuovoConcorsoVisibile = false;
        this.classifica = true;
        this.controlloConcorso = false;
        this.pronosticiVisibile = false;
        this.chiusuraConcorso = false;
        this.gestioneConcorso = false;
        this.coppeVisibile = false;
        this.infoVisibile = false;
        this.adminVisibile = false;
        this.vincitoriVisibile = false;
        this.bilancioVisibile = false;
        this.chatVisibile = false;
        this.statisticheVisibile = false;
        break;
      case 2: // RISULTATI
        this.nuovoConcorsoVisibile = false;
        this.classifica = false;
        this.controlloConcorso = true;
        this.pronosticiVisibile = false;
        this.chiusuraConcorso = false;
        this.gestioneConcorso = false;
        this.coppeVisibile = false;
        this.infoVisibile = false;
        this.adminVisibile = false;
        this.vincitoriVisibile = false;
        this.bilancioVisibile = false;
        this.chatVisibile = false;
        this.statisticheVisibile = false;
        break;
      case 3: // PRONOSTICI
        const oggi = new Date().getTime();
        const scadenza = new Date(this.scadenzaConcorso + ' 23:59:59').getTime();
        if (oggi > scadenza) {
          alert('Il concorso è scaduto.\nNon è più possibile partecipare');
          return;
        }
        this.nuovoConcorsoVisibile = false;
        this.classifica = false;
        this.controlloConcorso = false;
        this.pronosticiVisibile = true;
        this.chiusuraConcorso = false;
        this.gestioneConcorso = false;
        this.coppeVisibile = false;
        this.infoVisibile = false;
        this.adminVisibile = false;
        this.vincitoriVisibile = false;
        this.bilancioVisibile = false;
        this.chatVisibile = false;
        this.statisticheVisibile = false;
        break;
      case 6: // CHIUSURA CONCORSO
        this.nuovoConcorsoVisibile = false;
        this.classifica = false;
        this.controlloConcorso = false;
        this.pronosticiVisibile = false;
        this.chiusuraConcorso = true;
        this.gestioneConcorso = false;
        this.coppeVisibile = false;
        this.infoVisibile = false;
        this.adminVisibile = false;
        this.vincitoriVisibile = false;
        this.bilancioVisibile = false;
        this.chatVisibile = false;
        this.statisticheVisibile = false;
        break;
      case 4: // GESTIONE CONCORSO
        this.nuovoConcorsoVisibile = false;
        this.classifica = false;
        this.controlloConcorso = false;
        this.pronosticiVisibile = false;
        this.chiusuraConcorso = false;
        this.gestioneConcorso = true;
        this.coppeVisibile = false;
        this.infoVisibile = false;
        this.adminVisibile = false;
        this.vincitoriVisibile = false;
        this.bilancioVisibile = false;
        this.chatVisibile = false;
        this.statisticheVisibile = false;
        break;
      case 5: // CONTROLLO CONCORSO
        this.nuovoConcorsoVisibile = false;
        this.classifica = false;
        this.controlloConcorso = true;
        this.pronosticiVisibile = false;
        this.chiusuraConcorso = false;
        this.gestioneConcorso = false;
        this.coppeVisibile = false;
        this.infoVisibile = false;
        this.adminVisibile = false;
        this.vincitoriVisibile = false;
        this.bilancioVisibile = false;
        this.chatVisibile = false;
        this.statisticheVisibile = false;
        break;
      case 7: // TORNEI
        this.nuovoConcorsoVisibile = false;
        this.classifica = false;
        this.controlloConcorso = false;
        this.pronosticiVisibile = false;
        this.chiusuraConcorso = false;
        this.gestioneConcorso = false;
        this.coppeVisibile = true;
        this.infoVisibile = false;
        this.adminVisibile = false;
        this.vincitoriVisibile = false;
        this.bilancioVisibile = false;
        this.chatVisibile = false;
        this.statisticheVisibile = false;
        break;
      case 8: // INFO
        this.nuovoConcorsoVisibile = false;
        this.classifica = false;
        this.controlloConcorso = false;
        this.pronosticiVisibile = false;
        this.chiusuraConcorso = false;
        this.gestioneConcorso = false;
        this.coppeVisibile = false;
        this.infoVisibile = true;
        this.adminVisibile = false;
        this.vincitoriVisibile = false;
        this.bilancioVisibile = false;
        this.chatVisibile = false;
        this.statisticheVisibile = false;
        break;
      case 9: // ADMIN
        this.refreshAdmin = new Date().toString();
        this.nuovoConcorsoVisibile = false;
        this.classifica = false;
        this.controlloConcorso = false;
        this.pronosticiVisibile = false;
        this.chiusuraConcorso = false;
        this.gestioneConcorso = false;
        this.coppeVisibile = false;
        this.infoVisibile = false;
        this.adminVisibile = true;
        this.vincitoriVisibile = false;
        this.bilancioVisibile = false;
        this.chatVisibile = false;
        this.statisticheVisibile = false;
        break;
      case 10: // VINCITORI
        this.nuovoConcorsoVisibile = false;
        this.classifica = false;
        this.controlloConcorso = false;
        this.pronosticiVisibile = false;
        this.chiusuraConcorso = false;
        this.gestioneConcorso = false;
        this.coppeVisibile = false;
        this.infoVisibile = false;
        this.adminVisibile = false;
        this.vincitoriVisibile = true;
        this.bilancioVisibile = false;
        this.chatVisibile = false;
        this.statisticheVisibile = false;
        break;
      case 11: // BILANCIO
        this.nuovoConcorsoVisibile = false;
        this.classifica = false;
        this.controlloConcorso = false;
        this.pronosticiVisibile = false;
        this.chiusuraConcorso = false;
        this.gestioneConcorso = false;
        this.coppeVisibile = false;
        this.infoVisibile = false;
        this.adminVisibile = false;
        this.vincitoriVisibile = false;
        this.bilancioVisibile = true;
        this.chatVisibile = false;
        this.statisticheVisibile = false;
        break;
      case 12: // CHAT
        this.nuovoConcorsoVisibile = false;
        this.classifica = false;
        this.controlloConcorso = false;
        this.pronosticiVisibile = false;
        this.chiusuraConcorso = false;
        this.gestioneConcorso = false;
        this.coppeVisibile = false;
        this.infoVisibile = false;
        this.adminVisibile = false;
        this.vincitoriVisibile = false;
        this.bilancioVisibile = false;
        this.chatVisibile = true;
        this.statisticheVisibile = false;
        break;
      case 13: // STATISTICHE
        this.nuovoConcorsoVisibile = false;
        this.classifica = false;
        this.controlloConcorso = false;
        this.pronosticiVisibile = false;
        this.chiusuraConcorso = false;
        this.gestioneConcorso = false;
        this.coppeVisibile = false;
        this.infoVisibile = false;
        this.adminVisibile = false;
        this.vincitoriVisibile = false;
        this.bilancioVisibile = false;
        this.chatVisibile = false;
        this.statisticheVisibile = true;
        break;
    }
  }

  apreLogin() {
    this.mascheraLogin = !this.mascheraLogin;
    this.mascheraNuovoUtente = false;
  }

  apreNuovoUtente() {
    this.mascheraNuovoUtente = !this.mascheraNuovoUtente;
    this.mascheraLogin = false;
  }

  ControllaVisibilitaMenu(n) {
    const id = this.VariabiliGlobali.pagine[n].idTipologia;
    const idTasto = this.VariabiliGlobali.pagine[n].idTasto;
    // console.log('Tasto ' + n + '. ID Tasto ' + idTasto + ' ID Concorso: ' + this.VariabiliGlobali.idModalitaConcorso);

    if (id === -1) {
      // TASTO CON IDTIPOLOGIA -1 (TUTTI)
      switch (idTasto) {
        case 1:
          if (this.loginEffettuato) {
            return true;
          } else {
            return false;
          }
          break;
        case 2: // RISULTATI
          if (this.VariabiliGlobali.idModalitaConcorso === 3) { // ID CONCORSO CONTROLLATO
            // SI POSSONO VEDERE I RISULTATI
            return true;
          } else {
            // RISULTATI NON ATTIVI
            return false;
          }
        case 3: // PRONOSTICI
          if (this.VariabiliGlobali.idModalitaConcorso === 1) { // ID CONCORSO APERTO
            // SI POSSONO GESTIRE I PRONOSTICI
            return true;
          } else {
            // PRONOSTICI NON ATTIVI
            return false;
          }
        case 7:
          if (this.loginEffettuato) {
            return true;
          } else {
            return false;
          }
          break;
        case 10:
          if (this.loginEffettuato) {
            return true;
          } else {
            return false;
          }
          break;
        case 11:
          if (this.loginEffettuato) {
            return true;
          } else {
            return false;
          }
          break;
        case 12:
          if (this.loginEffettuato) {
            return true;
          } else {
            return false;
          }
          break;
        case 13:
          if (this.loginEffettuato) {
            return true;
          } else {
            return false;
          }
          break;
        default:
          return true;
      }
    } else {
      // TASTO CON IDTIPOLOGIA <> -1 (ADMIN ECC...)
      if (id === this.VariabiliGlobali.idTipologia) {
        switch (idTasto) {
          case 0: // NUOVO CONCORSO
            if (this.VariabiliGlobali.idModalitaConcorso === 0 || this.VariabiliGlobali.idModalitaConcorso === 3) {
              // CONCORSO CHIUSO O IN NESSUNO STATO
              return true;
            } else {
              // CONCORSO IN FASE DI GIOCO
              return false;
            }
          case 4: // GESTIONE CONCORSO
            if (this.VariabiliGlobali.idModalitaConcorso === 2) {
              // CONCORSO APERTO - SI PUO' GESTIRE IL CONCORSO
              return true;
            } else {
              // GESTIONE CONCORSO NON ATTIVA
              return false;
            }
          case 5: // CONTROLLO CONCORSO
            if (this.VariabiliGlobali.idModalitaConcorso === 2) {
              // CONCORSO CHIUSO - SI PUO' GESTIRE IL CONCORSO
              return true;
            } else {
              // CONTROLLO CONCORSO NON ATTIVO
              return false;
            }
          case 6: // CHIUSURA CONCORSO
            if (this.VariabiliGlobali.idModalitaConcorso === 1) {
              // CONCORSO APERTO - SI PUO' CHIUDERE IL CONCORSO
              return true;
            } else {
              // CHIUSURA CONCORSO NON ATTIVA
              return false;
            }
          default:
            return true;
        }
      } else {
        // TASTO CON IDTIPOLOGIA DIVERSA
        return false;
      }
    }
  }

  effettuaLogin() {
    if (!this.user) {
      alert('Inserire l\'utente');
      return;
    }
    if (!this.password) {
      alert('Inserire la password');
      return;
    }

    const params = {
      NickName: this.user,
      Password: this.password
    }
    this.VariabiliGlobali.CaricamentoInCorso = true;

    this.apiService.effettuaLogin(params)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.VariabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const r = data.split(';');
            this.splittaCampiLogin(r);

            const parametri = data;
            localStorage.setItem('login', parametri);

            this.ritornaDatiGlobali();
          } else {
            alert(data);
          }
        }
      }
    )
  }

  splittaCampiLogin(r) {
    this.mascheraLogin = false;
    this.loginEffettuato = true;
    this.user = r[1];
    this.password = r[4];
    this.VariabiliGlobali.idUser = +r[0];
    this.VariabiliGlobali.Utente = r[1];
    this.VariabiliGlobali.Cognome = r[2];
    this.VariabiliGlobali.Nome = r[3];
    this.VariabiliGlobali.Password = r[4];
    this.VariabiliGlobali.EMail = r[5];
    this.VariabiliGlobali.idTipologia = +r[6];
    this.VariabiliGlobali.Tipologia = r[7];

    this.immagineDiSfondo = this.VariabiliGlobali.urlSfondo + this.VariabiliGlobali.idAnno + '/' + this.VariabiliGlobali.idUser + '.png?d=' + new Date().toString();
  }

  handleMissingImageSfondo($event) {
    this.immagineDiSfondo = '../../assets/Immagini/sfondo.jpg';
    // (event.target as HTMLImageElement).style.background = 'url("../assets/Immagini/sfondo.jpg")';
  }

  effettuaSalvataggio() {
    const params = {
      NickName: this.nickName,
      Cognome: this.cognome,
      Nome: this.nome,
      Password: this.passwordNU,
      Mail: this.eMail,
      idTipologia: 1,
      Presentatore: this.presentatore
    }
    console.log(params);
    this.VariabiliGlobali.CaricamentoInCorso = true;

    this.apiService.creaNuovoUtente(params)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.VariabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            this.mascheraNuovoUtente = false;
            this.user = this.nickName;
            this.password = this.passwordNU;
            this.mascheraLogin = true;
            alert('Nuovo utente ' + this.nickName + ' creato');
          } else {
            alert(data);
          }
        }
      }
    )
  }

  ritornaDatiGlobali() {
    this.VariabiliGlobali.CaricamentoInCorso = true;
    this.apiService.leggeMessaggi()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.VariabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            this.messaggiRicevuti = +data;
            this.ritornaDatiGlobali2();
          }
        }
      }
    );
  }

  ritornaDatiGlobali2() {
    this.VariabiliGlobali.CaricamentoInCorso = true;
    this.apiService.login()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.VariabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            // console.error(data);
            const parti = data.split('|');

            const primaParte = parti[0].split(';');
            this.VariabiliGlobali.idConcorso = +primaParte[0];
            this.VariabiliGlobali.idModalitaConcorso = +primaParte[1];
            this.VariabiliGlobali.ModalitaConcorso = primaParte[2];
            if (primaParte[3] !== '') {
              this.scadenzaConcorso = primaParte[3];
              const scadenza = new Date(this.scadenzaConcorso);
              this.scadenzaConcorso2 = this.datePipe.transform(scadenza, 'dd/MM/yyyy');
            } else{
              this.scadenzaConcorso = undefined;
              this.scadenzaConcorso2 = '';
            }

            const secondaParte = parti[1].split('§');
            const anni = new Array();
            secondaParte.forEach(element => {
              if (element) {
                const campi = element.split(';');
                const a = {
                  idAnno: campi[0],
                  Descrizione: campi[1]
                }
                if (+campi[0] === this.VariabiliGlobali.idAnno) {
                  this.VariabiliGlobali.descrizioneAnno = campi[1];
                }

                anni.push(a);
              }
            });
            this.VariabiliGlobali.Anni = anni;

            const terzaParte = parti[2].split('§');
            let eventi = '';
            terzaParte.forEach(element => {
              if (element) {
                eventi += element + ', ';
              }
            });
            if (eventi.length > 0) {
              eventi = eventi.substring(0, eventi.length - 2);
            }
            this.eventi = eventi;
            console.log(anni, eventi);
          } else {
            console.error(data);
          }
        }
      }
    )
  }

  tipologiaUL;
  refreshImmagine;
  arrotonda;

  apreUpload(Cosa) {
    if (Cosa === 'Sfondi') {
      this.arrotonda = 'NO';
    } else {
      this.arrotonda = 'SI';
    }
    this.tipologiaUL = Cosa;
    this.uploadVisibile = true;
  }

  fRefreshImmagine() {
    this.refreshImmagine = new Date().toString();
    this.immagineDiSfondo = this.VariabiliGlobali.urlSfondo + this.VariabiliGlobali.idAnno + '/' + this.VariabiliGlobali.idUser + '.png?d=' + new Date().toString();
  }

  passwordDimenticata() {
    if (!this.user) {
      alert('Inserire il nome utente');
      return;
    }
    this.VariabiliGlobali.CaricamentoInCorso = true;

    this.apiService.ricordaPassword(this.user)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        this.VariabiliGlobali.CaricamentoInCorso = false;
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            alert('Password inviata');
          } else {
            alert(data);
          }
        }
      }
    )
  }
}
