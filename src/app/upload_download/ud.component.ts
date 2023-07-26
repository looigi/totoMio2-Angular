import { OnInit, OnChanges, AfterViewInit, Component, SimpleChanges, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../services/api.service';
import { VariabiliGlobali } from '../VariabiliGlobali.component';
import {Http, Headers, Response, RequestOptions} from '@angular/http';

@Component({
    selector: 'app-uploaddownload',
    templateUrl: 'ud.component.html',
    styleUrls: ['ud.style.css']
})

export class UploadDownloadComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() id;
    @Input() tipologia;
    @Input() arrotonda;

    @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();
    @Output() refreshImmagine: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('fileInput', { static: false }) inputEl: ElementRef;

    tipologia2 = '';
    arrotonda2;
    id2 = '';
    attendiUpload = false;

    constructor(
      private http: Http,
      public sanitizer: DomSanitizer,
      private apiService: ApiService,
      public variabiliGlobali: VariabiliGlobali,
    ) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes.tipologia && changes.tipologia.currentValue) {
        this.tipologia2 = changes.tipologia.currentValue;
      }
      if (changes.id && changes.id.currentValue) {
        this.id2 = changes.id.currentValue;
      }
      if (changes.arrotonda && changes.arrotonda.currentValue) {
        this.arrotonda2 = changes.arrotonda.currentValue;
      }
    }

    chiusura() {
      this.chiusuraFinestra.emit(new Date().toString());
    }

    inviaUpload() {
      const inputEl: HTMLInputElement = this.inputEl.nativeElement;
      const fileCount: number = inputEl.files.length;
      const formData = new FormData();
      if (fileCount > 0) { // a file was selected
        let fileName = '';
        // let Cartella = '';
        // const Squadra = ''; // this.variabiliGlobali.Squadra;
        const idAnno = this.variabiliGlobali.idAnno;
        this.attendiUpload = true;

        for (let i = 0; i < fileCount; i++) {
            formData.append('uploadFile', inputEl.files.item(i), inputEl.files.item(i).name);

            // fileName = inputEl.files.item(i).name;

            // Cartella = 'Anno' + this.variabiliGlobali.Anno + '\\' + this.id;
            // Cartella = this.id;
        }

        formData.append('tipologia', this.tipologia2);
        // formData.append('cartella', Cartella);
        formData.append('arrotonda', this.arrotonda2);
        // formData.append('uplodadedfile', fileName);
        formData.append('nomefile', this.id2);
        formData.append('scrivelog', 'SI');
        formData.append('anno', idAnno.toString());
        // formData.append('nomesquadra', this.variabiliGlobali.CodAnnoSquadra);
        // formData.append('allegato', this.allegato);

        const headers = new Headers();
        headers.append('Accept', 'application/json');

        const options = new RequestOptions({ headers: headers });

        const urletto = this.variabiliGlobali.urlPerUpload;
        console.log(urletto);
        this.http.post(urletto, formData, options)
        .subscribe(
            data => {
              // this.attendiUpload = false;
              // this.caricaAllegati();
              // this.variabiliGlobali.mostraMessaggio('File inviato con successo', false);
              // this.chiamaWS(data['_body']);
              this.refreshImmagine.emit(new Date().toString());
              this.chiusuraFinestra.emit(new Date().toString());
            },
            error => {
              this.attendiUpload = false;
              console.log(error);
            }
        );
      } else {
        this.attendiUpload = false;
      }
    }
}
