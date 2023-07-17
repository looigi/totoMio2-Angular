import { Injectable } from '@angular/core';

@Injectable()
export class VariabiliGlobali {
  CaricamentoInCorso = true;
  urlWS = 'http://looigi.ddns.net:1081/';
  urlImmagini = 'http://192.168.0.205:1080/Immagini/';
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
    }
  ]

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
