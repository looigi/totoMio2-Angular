import { AfterViewInit, Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from "@angular/core";

@Component({
  templateUrl: 'info.component.html',
  selector: 'info_component',
  styleUrls: ['./info.style.css']
})

export class InfoComponent implements OnInit, AfterViewInit, OnChanges {
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
