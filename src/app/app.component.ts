import { Component, OnInit } from '@angular/core';
import { VariabiliGlobali } from './VariabiliGlobali.component';
import { ApiService } from './services/api.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'totoMio2';

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

  nuovoConcorsoVisibile = false;
  pronosticiVisibile = false;
  gestioneConcorso = false;
  chiusuraConcorso = false;
  controlloConcorso = false;
  classifica = false;

  constructor(
    public VariabiliGlobali: VariabiliGlobali,
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
    const ric = localStorage.getItem('ricordami');
    if (ric !== null) {
      this.ricordami = ric === 'S' ? true : false;
    }

    const anno = localStorage.getItem('AnnoAttuale');
    if (anno !== null) {
      this.VariabiliGlobali.idAnno = +anno;
    }
    this.ritornaDatiGlobali();

    if (this.ricordami) {
      const login = localStorage.getItem('login');
      if (login !== null) {
        const r = login.split(';');
        this.splittaCampiLogin(r);
      }
    }
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
        break;
      case 1: // CLASSIFICA
        this.classifica = true;
        break;
      case 2: // RISULTATI
        this.controlloConcorso = true;
        break;
      case 3: // PRONOSTICI
        this.pronosticiVisibile = true;
        break;
      case 6: // CHIUSURA CONCORSO
        this.chiusuraConcorso = true;
        break;
      case 4: // GESTIONE CONCORSO
        this.gestioneConcorso = true;
        break;
      case 5: // CONTROLLO CONCORSO
        this.controlloConcorso = true;
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

    this.apiService.effettuaLogin(params)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            const r = data.split(';');
            this.splittaCampiLogin(r);

            const parametri = data;
            localStorage.setItem('login', parametri);
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
  }

  effettuaSalvataggio() {
    const params = {
      NickName: this.nickName,
      Cognome: this.cognome,
      Nome: this.nome,
      Password: this.passwordNU,
      Mail: this.eMail,
      idTipologia: 1
    }

    this.apiService.creaNuovoUtente(params)
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
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
    this.apiService.login()
    .map((response: any) => response)
    .subscribe((data2: string | string[]) => {
        if (data2) {
          const data = this.apiService.SistemaStringaRitornata(data2);
          if (data.indexOf('ERROR') === -1) {
            // console.error(data);
            const parti = data.split('|');

            const primaParte = parti[0].split(';');
            this.VariabiliGlobali.idConcorso = +primaParte[0];
            this.VariabiliGlobali.idModalitaConcorso = +primaParte[1];
            this.VariabiliGlobali.ModalitaConcorso = primaParte[2];

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
}
