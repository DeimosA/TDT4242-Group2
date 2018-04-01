import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { OrderService } from '../../_shared/services/order.service';
import { OrderModel } from '../../_shared/app.models';


/**
 * Show details and actions for a specific order
 */
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  order: OrderModel;
  alertMessage: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    let orderObs = this.activatedRoute.paramMap.switchMap(
      (params: ParamMap) => this.orderService.getOrderDetails(params.get('orderId'))
    );
    orderObs.subscribe((order) => {
      this.order = order;
    }, (error) => {
      this.alertMessage = 'An error occurred getting the order details: ' + error.status;
    });
  }

  /**
   * Change the order status of this order
   * @param {string} newStatus
   */
  changeOrderStatus(newStatus: string) {
    this.orderService.setOrderStatus(this.order, newStatus).subscribe((order) => {
      order.user = this.order.user;
      this.order = order;
    }, (error) => {
      this.alertMessage = 'An error occurred updating the orders status: ' + error.status;
    })
  }

  /**
   * Convert ISO format date string to users locale string
   */
  toReadableDate(isoDateString: string): string {
    return new Date(isoDateString).toLocaleDateString();
  }

}
