import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

import { OrderModel } from '../_shared/app.models';


/**
 * Shows a users order history
 */
@Component({
  selector: 'app-order-history-list',
  templateUrl: './order-history-list.component.html',
  styleUrls: ['./order-history-list.component.css']
})
export class OrderHistoryListComponent implements OnInit {

  @Input()
  orderHistory: OrderModel[];

  @Output()
  dismissOrderCallback = new EventEmitter<OrderModel>();

  private modalContext: OrderModel;
  private modalActions = new EventEmitter<MaterializeAction>();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Convert ISO format date string to users locale string
   */
  private toReadableDate(isoDateString : string): string {
    return new Date(isoDateString).toLocaleDateString();
  }

  /**
   * Open the modal to confirm cancelling an order
   */
  private openDismissOrderModal(order: OrderModel) {
    this.modalContext = order;
    this.modalActions.emit({action: 'modal', params:['open']});
  }

  /**
   * Don't cancel the order anyway
   */
  private cancelDismissOrder() {
    this.modalContext = null;
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  /**
   * Dismiss an order
   */
  private dismissOrder() {
    this.modalActions.emit({action: 'modal', params: ['close']});
    this.dismissOrderCallback.emit(this.modalContext);
    this.modalContext = null;
  }

}
