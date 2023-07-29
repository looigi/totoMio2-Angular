import { Injectable } from '@angular/core';

@Injectable()
export class VariabiliGlobali {
  CaricamentoInCorso = true;
  urlWS = 'http://looigi.ddns.net:1081/';
  urlImmagini = 'http://looigi.ddns.net:1080/Immagini/Stemmi/';
  urlAvatar = 'http://looigi.ddns.net:1081/Avatars/';
  urlPerUpload = 'http://looigi.ddns.net:1082/Default.aspx';
  idAnno = 1;
  idConcorso = -1;
  descrizioneAnno = '';
  Utente = '';
  idUser = -1;
  Cognome = '';
  Nome = '';
  idTipologia = -1;
  Password = '';
  Tipologia = '';
  EMail = '';
  idModalitaConcorso = -1;
  ModalitaConcorso = '';
  Anni = new Array();

  pagine = [
    {
      idTasto: 0,
      Icona: 'nuovo_concorso.png',
      Titolo: 'Nuovo Concorso',
      Pagina: 'Nuovo Concorso',
      idTipologia: 0
    },
    {
      idTasto: 3,
      Icona: 'pronostici.png',
      Titolo: 'Pronostici',
      Pagina: 'Pronostici',
      idTipologia: -1
    },
    {
      idTasto: 4,
      Icona: 'gestione_concorso.png',
      Titolo: 'Gestione Concorso',
      Pagina: 'Gestione Concorso',
      idTipologia: 0
    },
    {
      idTasto: 1,
      Icona: 'classifica.png',
      Titolo: 'Classifica',
      Pagina: 'Classifica',
      idTipologia: -1
    },
    {
      idTasto: 2,
      Icona: 'risultati.png',
      Titolo: 'Risultati',
      Pagina: 'Risultati',
      idTipologia: -1
    },
    {
      idTasto: 5,
      Icona: 'controllo.png',
      Titolo: 'Controllo',
      Pagina: 'Controllo',
      idTipologia: 0
    },
    {
      idTasto: 6,
      Icona: 'lucchetto.png',
      Titolo: 'Chiusura',
      Pagina: 'Chiusura',
      idTipologia: 0
    },
    {
      idTasto: 7,
      Icona: 'coppe.png',
      Titolo: 'Tornei',
      Pagina: 'Tornei',
      idTipologia: -1
    },
    {
      idTasto: 8,
      Icona: 'info.png',
      Titolo: 'Info',
      Pagina: 'Info',
      idTipologia: -1
    },
    {
      idTasto: 9,
      Icona: 'admin.png',
      Titolo: 'Admin',
      Pagina: 'Admin',
      idTipologia: 0
    },
    {
      idTasto: 10,
      Icona: 'vincitori.png',
      Titolo: 'Vincitori',
      Pagina: 'Vincitori',
      idTipologia: -1
    },
    {
      idTasto: 11,
      Icona: 'bilancio.png',
      Titolo: 'Bilancio',
      Pagina: 'Bilancio',
      idTipologia: -1
    }
  ]

  ritornaImmagineSquadra(imm) {
    const imm2 = this.sistemaStringaDaPassaggio(imm).toUpperCase();
    return this.urlImmagini + imm2 +'_Tonda.Jpg?d=' + new Date().toString();
  }

  ritornaImmagineGiocatore(id) {
    const imm2 = this.sistemaStringaDaPassaggio(id).toUpperCase();
    return this.urlAvatar + this.idAnno + '/' + imm2 +'.png?d=' + new Date().toString();
  }

  handleMissingImage($event) {
    (event.target as HTMLImageElement).style.visibility = 'hidden';
  }

  mettePrimaLetteraMaiuscola(s) {
    let ritorno = s.toLowerCase().trim();
    let prima = ritorno.substring(0, 1);
    ritorno = ritorno.substring(1, ritorno.length);
    ritorno = prima.toUpperCase() + ritorno;
    return ritorno;
  }

  sistemaStringaPerPassaggio(stringa) {
    let s = stringa;
    while (s.indexOf('§') > -1) {
      s = s.replace('§', '*SS*');
    }
    while (s.indexOf(';') > -1) {
      s = s.replace(';', '*PV*');
    }
    return s;
  }

  sistemaStringaDaPassaggio(stringa) {
    let s = stringa;
    while (s.indexOf('*SS*') > -1) {
      s = s.replace('*SS*', '§');
    }
    while (s.indexOf('*PV*') > -1) {
      s = s.replace('*PV*', ';');
    }
    return s;
  }
}
