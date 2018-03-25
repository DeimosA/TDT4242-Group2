import { Component, OnInit, Input } from '@angular/core';

import { OrderModel } from '../_shared/app.models';

@Component({
  selector: 'app-order-history-list',
  templateUrl: './order-history-list.component.html',
  styleUrls: ['./order-history-list.component.css']
})
export class OrderHistoryListComponent implements OnInit {

  @Input()
  orderHistory: OrderModel[];

  constructor() { }

  ngOnInit() {
  }

  private toReadableDate(isoDateString : string): string {
    return new Date(isoDateString).toLocaleDateString();
  }

}
