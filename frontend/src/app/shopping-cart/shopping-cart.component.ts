import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { ShoppingCartService } from '../_shared/services/shopping-cart.service';
import { OrderService } from '../_shared/services/order.service';

import { ShoppingCartItem, OrderModel, UserModel } from '../_shared/app.models';
import { UserAuthService } from '../_shared/services/user-auth.service';


/**
 * Component for showing the shopping cart list, total price and checkout button
 */
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  private items : Array<ShoppingCartItem> = [];
  private shoppingCartSub : Subscription;
  private _totalPrice : number = 0;

  public user : UserModel;

  constructor(
    private shoppingCart : ShoppingCartService,
    private orderService : OrderService,
    private router : Router,
    private userService : UserAuthService
  ) { }

  ngOnInit() {
    this.shoppingCartSub = this.shoppingCart.getShoppingCart().subscribe((items : Array<ShoppingCartItem>) => {
      this.items = items;
    });
    this.userService.getUserAuthEvents().subscribe((user : UserModel) => {
      this.user = user;
    });
  }

  ngOnDestroy(){
    this.shoppingCartSub.unsubscribe();
  }

  /**
   * Delete an item from the cart
   */
  private deleteItem(item : ShoppingCartItem){
    this.shoppingCart.removeItem(item.productId);
  }

  /**
   * Update cart item callback
   */
  private changeItem(item : ShoppingCartItem){
    this.shoppingCart.updateItem(item);
  }

  /**
   * Update total cart price callback
   */
  private changePrice(price: number){
    this._totalPrice = price;
  }

  /**
   * Get total cart price
   */
  private totalPrice(): number {
    return this._totalPrice;
  }

  /**
   * Checkout and place order
   */
  private checkout() {
    this.orderService.createOrder(this.items).subscribe( (order : OrderModel) => {
      this.shoppingCart.clearCart();
      this.router.navigate(['/mypage']);
    });
  }

  /**
   * Clear all items in the cart
   */
  private clearCart() {
    this.shoppingCart.clearCart();
    this._totalPrice = 0;
  }

  /**
   * Navigate to login page
   */
  public goToLogin(){
    this.router.navigate(['/login']);
  }

}
