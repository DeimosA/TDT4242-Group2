import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { OrderModel } from '../app.models';


/**
 * Order related queries
 */
@Injectable()
export class OrderService {

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Dismiss an order
   * @param {number | string} orderId
   * @returns {Observable<OrderModel>}
   */
  dismissOrder(orderId: number | string): Observable<OrderModel> {
    const url = `/api/order/${orderId}/dismiss`;
    return this.http.post<OrderModel>(url, {});
  }

}
