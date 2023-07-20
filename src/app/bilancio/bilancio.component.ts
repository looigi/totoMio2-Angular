import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";

@Component({
  templateUrl: 'bilancio.component.html',
  selector: 'bilancio_component',
  styleUrls: ['./bilancio.style.css']
})

export class BilancioComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() idAnno;
  @Input() DescrizioneAnno;
  @Input() NumeroConcorso;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  classifica;
  idAnno2;
  idConcorso2;

  constructor(
    private apiService: ApiService,
    public variabiliGlobali: VariabiliGlobali
  ) {

  }

  chiusura() {
    this.chiusuraFinestra.emit(new Date().toString());
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }

}
