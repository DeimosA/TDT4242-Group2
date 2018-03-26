import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-dismissible-alert',
  templateUrl: './dismissible-alert.component.html',
  styleUrls: ['./dismissible-alert.component.css']
})
export class DismissibleAlertComponent implements OnInit {

  @Input()
  alertMessage: string;

  @Output()
  alertMessageChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

}
