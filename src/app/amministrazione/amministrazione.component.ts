import { AfterViewInit, Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from "@angular/core";

@Component({
  templateUrl: 'amministrazione.component.html',
  selector: 'amministrazione_component',
  styleUrls: ['./amministrazione.style.css']
})

export class AmministrazioneComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() chiusuraFinestra: EventEmitter<string> = new EventEmitter<string>();

  constructor(
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
