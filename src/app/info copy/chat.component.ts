import { AfterViewInit, Component, Output, EventEmitter, OnChanges, OnInit, SimpleChanges, Input } from "@angular/core";

@Component({
  templateUrl: 'chat.component.html',
  selector: 'chat_component',
  styleUrls: ['./chat.style.css']
})

export class ChatComponent implements OnInit, AfterViewInit, OnChanges {
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
