import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { ApiService } from "../services/api.service";
import { VariabiliGlobali } from "../VariabiliGlobali.component";

@Component({
  templateUrl: 'coppe.component.html',
  selector: 'coppe_component',
  styleUrls: ['./coppe.style.css']
})

export class CoppeComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() idAnno;
  @Input() DescrizioneAnno;
  @Input() NumeroConcorso;
  @Input() ModalitaConcorso;

  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  coppaScelta = 1;

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
