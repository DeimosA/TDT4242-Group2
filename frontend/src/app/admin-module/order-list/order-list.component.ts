import { Component, OnInit } from '@angular/core';

import { OrderModel } from '../../_shared/app.models';
import { OrderService } from '../../_shared/services/order.service';


/**
 * Lists all orders that have been placed and confirmed by users
 */
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  orderList: OrderModel[] = [];
  alertMessage: string = '';

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.orderService.getAllOrders().subscribe((orders) => {
      this.orderList = orders;
    }, (error) => {
      this.alertMessage = 'An error occurred getting the order list: ' + error.status;
    });
  }

  /**
   * Convert ISO format date string to users locale string
   */
  toReadableDate(isoDateString: string): string {
    return new Date(isoDateString).toLocaleDateString();
  }

}
