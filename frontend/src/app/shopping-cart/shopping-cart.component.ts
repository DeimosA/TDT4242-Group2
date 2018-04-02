import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { ShoppingCartService } from '../_shared/services/shopping-cart.service';
import { OrderService } from '../_shared/services/order.service';

import { ShoppingCartItem, OrderModel, UserModel } from '../_shared/app.models';
import { UserAuthService } from '../_shared/services/user-auth.service';


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

  private deleteItem(item : ShoppingCartItem){
    this.shoppingCart.removeItem(item.productId);
  }

  private changeItem(item : ShoppingCartItem){
    this.shoppingCart.updateItem(item);
  }

  private changePrice(price: number){
    this._totalPrice = price;
  }

  private totalPrice(): number {
    return this._totalPrice;
  }

  private checkout() {
    this.orderService.createOrder(this.items).subscribe( (order : OrderModel) => {
      this.shoppingCart.clearCart();
      this.router.navigate(['/mypage']);
    });
  }

  private clearCart() {
    this.shoppingCart.clearCart();
  }

  public goToLogin(){
    this.router.navigate(['/login']);
  }

}
