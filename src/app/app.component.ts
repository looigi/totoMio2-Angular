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

  nuovoConcorsoVisibile = false;
  pronosticiVisibile = false;

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
    const i = this.VariabiliGlobali.pagine[n].idTasto;
    console.log('Pagina ', i);
    switch(i) {
      case 0: // NUOVO CONCORSO
        this.nuovoConcorsoVisibile = true;
        break;
      case 3: // PRONOSTICI
        this.pronosticiVisibile = true;
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

    if (id === -1) {
      // TASTO CON IDTIPOLOGIA -1 (TUTTI)
      switch (idTasto) {
        case 2: // RISULTATI
          if (this.VariabiliGlobali.idModalitaConcorso === 3) {
            // SI POSSONO VEDERE I RISULTATI
            return true;
          } else {
            // RISULTATI NON ATTIVI
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
            console.log(anni);
          } else {
            console.error(data);
          }
        }
      }
    )
  }
}
