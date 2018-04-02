import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { ShoppingCartService } from '../_shared/services/shopping-cart.service';
import { OrderService } from '../_shared/services/order.service';

import { ShoppingCartItem, OrderModel } from '../_shared/app.models';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  private items : Array<ShoppingCartItem> = [];
  private shoppingCartSub : Subscription;
  protected _totalPrice : number = 0;

  constructor(private shoppingCart : ShoppingCartService, private orderService : OrderService, private router : Router) { }

  ngOnInit() {
    this.shoppingCartSub = this.shoppingCart.getShoppingCart().subscribe((items : Array<ShoppingCartItem>) => {
      this.items = items;
    })
  }

  ngOnDestroy(){
    this.shoppingCartSub.unsubscribe();
  }

  private deleteItem(item : ShoppingCartItem){
    this.shoppingCart.removeItem(item.productId);
  }

  private changeItem(item : ShoppingCartItem){
    this.shoppingCart.updateItem(item);
  }

  private changePrice(price: number){
    console.log(price);
    this._totalPrice = price;
  }

  private totalPrice(): number {
    return this._totalPrice;
  }

  private checkout() {
    this.orderService.createOrder(this.items).subscribe( (order : OrderModel) => {
      console.log(order);
      this.shoppingCart.clearCart();
      this.router.navigate(['/mypage']);
    });
    return; // todo
  }

  private clearCart() {
    this.shoppingCart.clearCart();
  }

}
