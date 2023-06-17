import { Injectable } from '@angular/core';

@Injectable()
export class VariabiliGlobali {
  CaricamentoInCorso = false;
  urlWS = 'http://looigi.ddns.net:1081/';
  // urlWS = 'http://192.168.0.205:1081/';
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
  ]

}
