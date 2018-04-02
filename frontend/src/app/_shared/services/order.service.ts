import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { OrderModel, ShoppingCartItem } from '../app.models';


/**
 * Order related queries
 */
@Injectable()
export class OrderService {

  constructor(
    private http: HttpClient,
  ) { }

  createOrder(items: Array<ShoppingCartItem>): Observable<OrderModel> {
    const url = `/api/order`;
    return this.http.post<OrderModel>(url, items.map((item : ShoppingCartItem) => {
      return {
        productId: item.productId,
        quantity: item.quantity
      }
    }));
  }

  /**
   * Dismiss an order
   * @param {number | string} orderId
   * @returns {Observable<OrderModel>}
   */
  dismissOrder(orderId: number | string): Observable<OrderModel> {
    const url = `/api/order/${orderId}/dismiss`;
    return this.http.post<OrderModel>(url, {});
  }

  /**
   * Get ALL the orders
   * @returns {Observable<OrderModel[]>}
   */
  getAllOrders(): Observable<OrderModel[]> {
    const url = '/api/order?user_confirmed=true&limit=100&sort=createdAt DESC';
    return this.http.get<OrderModel[]>(url);
  }

  /**
   * Get details for a specific order
   * @param {number | string} orderId
   * @returns {Observable<OrderModel>}
   */
  getOrderDetails(orderId: number | string): Observable<OrderModel> {
    const url = `/api/order/${orderId}?populate=user`;
    return this.http.get<OrderModel>(url);
  }

  /**
   * Change the status of an order
   * @param {OrderModel} order
   * @param {string} newStatus
   * @returns {Observable<OrderModel>}
   */
  setOrderStatus(order: OrderModel, newStatus: string): Observable<OrderModel> {
    const url = `/api/order/${order.id}/setstatus`;
    return this.http.post<OrderModel>(url, { status: newStatus });
  }

}
