import { Injectable } from '@angular/core';
import { HttpClientService } from './httpclient.service';
import { Location } from '@angular/common';
import { VariabiliGlobali } from '../VariabiliGlobali.component';

@Injectable()

export class ApiService {
  // private urlBase = this.variabiliGlobali.urlWS;
  // private urlRoot = environment.urlRoot;

  constructor(
    private httpclient: HttpClientService,
    private location: Location,
    private variabiliGlobali: VariabiliGlobali
    ) {
      this.controlloPresenzaUtente();
  }

  controlloPresenzaUtente(): void {
    return;
  }

  cambiaChar(ee: string, c1: string, c2: string) {
    while (ee.indexOf(c1) > -1) {
        ee = ee.replace(c1, c2);
    }
    return ee;
  }

  sistemaTesto(e: string | null | undefined): string {
    if (e === undefined || e === 'undefined' || e === '' || e === null) {
        return '';
    }

    let ee = e.toString();

    ee = this.cambiaChar(ee, '<', '%3C');
    ee = this.cambiaChar(ee, '>', '%3E');
    ee = this.cambiaChar(ee, '#', '%23');
    ee = this.cambiaChar(ee, '{', '%7B');
    ee = this.cambiaChar(ee, '}', '%7D');
    ee = this.cambiaChar(ee, '|', '%7C');
    ee = this.cambiaChar(ee, '\\', '%5C');
    ee = this.cambiaChar(ee, '^', '%5E');
    ee = this.cambiaChar(ee, '~', '%7E');
    ee = this.cambiaChar(ee, '[', '%5B');
    ee = this.cambiaChar(ee, ']', '%5D');
    ee = this.cambiaChar(ee, '`', '%60');
    // ee = this.cambiaChar(ee, ';', '%3B');
    ee = this.cambiaChar(ee, '/', '%2F');
    ee = this.cambiaChar(ee, '?', '%3F');
    ee = this.cambiaChar(ee, ':', '%3A');
    ee = this.cambiaChar(ee, '@', '%40');
    ee = this.cambiaChar(ee, '=', '%3D');
    ee = this.cambiaChar(ee, '&', '%26');
    ee = this.cambiaChar(ee, '$', '%24');

    return ee;
  }

  /* chiamataPost(modulo: string, funzione: string, jsonString: any) {
    // console.log(environment.serverPostRest + '/' + funzione, jsonString);
    return this.httpclient.post(this.variabiliGlobali.urlWS + modulo + '/' + funzione, jsonString);
  } */

  SistemaStringaRitornata(stringa) {
    let s = stringa.split('>');
    // console.log(s);
    let s3 = s[2];
    if (s.indexOf('>') - 1) {
      for (let i = s3.length - 2; i > 0; i--) {
        // console.log(s3.substring(i, i + 1));
        if (s3.substring(i, i + 1) === '<') {
          s3 = s3.substring(0, i);
          break;
        }
      }
      // console.log(s3);
    }
    return s3;
  }

  login() {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsTotoMio2.asmx/RitornaDatiGenerali?idAnno=' + this.variabiliGlobali.idAnno;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  effettuaLogin(params) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/RitornaUtentePerLogin?' +
      'idAnno=' + this.variabiliGlobali.idAnno + '&' +
      'NickName=' + params.NickName + '&' +
      'Password=' + params.Password
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  segnaComeLetto(progressivo) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsChat.asmx/SegnaComeLetto?' +
      'idAnno=' + this.variabiliGlobali.idAnno + '&' +
      'Progressivo=' + progressivo
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  creaNuovoUtente(params) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/AggiungeUtente?' +
      'idAnno=' + this.variabiliGlobali.idAnno + '&' +
      'NickName=' + params.NickName + '&' +
      'Cognome=' + params.Cognome + '&' +
      'Nome=' + params.Nome + '&' +
      'Password=' + params.Password + '&' +
      'Mail=' + params.Mail + '&' +
      'idTipologia=' + params.idTipologia
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

 modificaUtente(params) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/ModificaUtente?' +
      'idAnno=' + this.variabiliGlobali.idAnno + '&' +
      'idUtente=' + this.variabiliGlobali.idUser + '&' +
      'NickName=' + params.NickName + '&' +
      'Cognome=' + params.Cognome + '&' +
      'Nome=' + params.Nome + '&' +
      'Password=' + params.Password + '&' +
      'Mail=' + params.Mail + '&' +
      'idTipologia=' + params.idTipologia
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  ritornaConcorso(idAnno, idConcorso) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsConcorsi.asmx/RitornoConcorso?' +
      'idAnno=' + idAnno + '&' +
      'idConcorso=' + idConcorso
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  CreaImmagineStandard() {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/CreaImmagineStandard?' +
      'idAnno=' + this.variabiliGlobali.idAnno + '&' +
      'idUtente=' + this.variabiliGlobali.idUser
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  salvaConcorso(parametri) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsConcorsi.asmx/ModificaConcorso?' +
      'idAnno=' + parametri.idAnno + '&' +
      'idConcorso=' + parametri.idConcorso + '&' +
      'Dati=' + parametri.Dati
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  leggePartitaJolly(parametri) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsConcorsi.asmx/LeggePartitaJolly?' +
      'idAnno=' + parametri.idAnno + '&' +
      'idConcorso=' + parametri.idConcorso
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  apreConcorso(parametri) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsConcorsi.asmx/ApreConcorso?' +
      'idAnno=' + parametri.idAnno + '&' +
      'Scadenza=' + parametri.Scadenza
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  ritornaMaxGiornataCoppe(params) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsConcorsi.asmx/RitornaMaxGiornataCoppa?' +
      'idAnno=' + params.idAnno + '&' +
      'idCoppa=' + params.idCoppa
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  ritornaNomiCoppe() {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsConcorsi.asmx/RitornaNomiCoppe'
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  ritornaDatiCoppa(parametri) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsConcorsi.asmx/RitornaClassificaCoppe?' +
      'idAnno=' + parametri.idAnno + '&' +
      'idGiornata=' + parametri.idGiornata + '&' +
      'Torneo=' + parametri.Torneo
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  ritorna23(parametri) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsConcorsi.asmx/RitornaClassifica23?' +
      'idAnno=' + parametri.idAnno + '&' +
      'idConcorso=' + parametri.idConcorso
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  ritornaSquadre23(parametri) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsConcorsi.asmx/RitornaSquadre23?' +
      'idAnno=' + parametri.idAnno + '&' +
      'idConcorso=' + parametri.idGiornata
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  impostaConcorsoPerControllo(parametri) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsConcorsi.asmx/ImpostaConcorsoPerControllo?' +
      'idAnno=' + parametri.idAnno
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  inviaMailDiAvviso(parametri) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsAmministrazione.asmx/InviaPromemoria?' +
      'idAnno=' + parametri.idAnno
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  impostaConcorsoControllato(parametri) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsConcorsi.asmx/ChiudeConcorso?' +
      'idAnno=' + parametri.idAnno
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  salvaPronosticoUtente(Dati, idPartitaScelta) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/SalvaPronosticoUtente?' +
      'idAnno=' + this.variabiliGlobali.idAnno +
      '&idUtente=' + this.variabiliGlobali.idUser +
      '&idConcorso=' + this.variabiliGlobali.idConcorso +
      '&Dati=' + Dati + '&' +
      '&idPartitaScelta=' + idPartitaScelta
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  letturaMovimenti() {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsBilancio.asmx/RitornaMovimenti'
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  letturaBilancio() {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsBilancio.asmx/RitornaBilancio?' +
      'idAnno=' + this.variabiliGlobali.idAnno + '&' +
      'idUtente=' + this.variabiliGlobali.idUser
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  eliminaMovimento(progressivo) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsBilancio.asmx/EliminaMovimento?' +
      'idAnno=' + this.variabiliGlobali.idAnno + '&' +
      'Progressivo=' + progressivo
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  leggeMessaggi() {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsChat.asmx/LeggeNuoviMessaggi?' +
      'idAnno=' + this.variabiliGlobali.idAnno + '&' +
      'idUtente=' + this.variabiliGlobali.idUser
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  effettuaBackup() {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsDB.asmx/EffettuaBackup'
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  leggeSettaggi() {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/RitornaUtentiMails?' +
      'idAnno=' + this.variabiliGlobali.idAnno + '&' +
      'idUtente=' + this.variabiliGlobali.idUser
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  scriveSettaggi(params) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/ImpostaUtentiMails?' +
      'idAnno=' + this.variabiliGlobali.idAnno + '&' +
      'idUtente=' + this.variabiliGlobali.idUser + '&' +
      'Apertura=' + params.Apertura + '&' +
      'Reminder=' + params.Reminder + '&' +
      'Controllo=' + params.Controllo + '&' +
      'Chiusura=' + params.Chiusura + '&' +
      'Chat=' + params.Chat + '&' +
      'Giocata=' + params.Giocata
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  ritornaTuttiIMessaggi() {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsChat.asmx/RitornaTuttiIMessaggi?' +
      'idAnno=' + this.variabiliGlobali.idAnno + '&' +
      'idUtente=' + this.variabiliGlobali.idUser
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  scriveMessaggi(params) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsChat.asmx/InviaMessaggio?' +
      'idAnno=' + this.variabiliGlobali.idAnno + '&' +
      'Destinatari=' + params.Destinatari + '&' +
      'idMittente=' + this.variabiliGlobali.idUser + '&' +
      'Messaggio=' + params.Messaggio
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  LeggeInadempienti() {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsConcorsi.asmx/RitornaInadempienti?' +
      'idAnno=' + this.variabiliGlobali.idAnno + '&' +
      'idGiornata=' + this.variabiliGlobali.idConcorso
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  salvaMovimento(params) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsBilancio.asmx/ScriveModificaMovimento?' +
      'idAnno=' + this.variabiliGlobali.idAnno + '&' +
      'idUtente=' + params.idUtente + '&' +
      'idMovimento=' + params.idMovimento + '&' +
      'Importo=' + params.Importo + '&' +
      'Data=' + params.Data + '&' +
      'Note=' + params.Note + '&' +
      'Progressivo=' + params.Progressivo
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  letturaUtenti() {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/RitornaTuttiGliUtenti?' +
      'idAnno=' + this.variabiliGlobali.idAnno
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  ritornaVincitori() {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsConcorsi.asmx/RitornaVincitori?' +
      'idAnno=' + this.variabiliGlobali.idAnno
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    this.variabiliGlobali.CaricamentoInCorso = false;
    return ritorno;
  }

  ritornaPronosticoUtente() {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/RitornaPronosticoUtente?' +
      'idAnno=' + this.variabiliGlobali.idAnno +
      '&idUtente=' + this.variabiliGlobali.idUser +
      '&idConcorso=' + this.variabiliGlobali.idConcorso
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  controllaConcorso(parametri) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsConcorsi.asmx/ControllaConcorso?' +
      'idAnno=' + parametri.idAnno +
      '&idUtente=' + parametri.idUtente +
      '&ModalitaConcorso=' + parametri.ModalitaConcorso
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  leggeClassifica(parametri) {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/RitornaClassifica?' +
      'idAnno=' + parametri.idAnno +
      '&idConcorso=' + parametri.idConcorso +
      '&MostraFinto=' + parametri.MostraFinto
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  leggeStatistiche() {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsUtenti.asmx/Statistiche?' +
      'idAnno=' + this.variabiliGlobali.idAnno
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

  creaUtenteFinto() {
    this.controlloPresenzaUtente();
    const url = this.variabiliGlobali.urlWS + 'wsAmministrazione.asmx/CreaFintone?' +
      'idAnno=' + this.variabiliGlobali.idAnno
      ;
      // 'Password=' + this.sistemaTesto(params.Password;
    // console.log('Login:', url);
    const ritorno = this.httpclient.get(url);
    // console.log(ritorno);
    return ritorno;
  }

}
