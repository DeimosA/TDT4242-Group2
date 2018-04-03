import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ShoppingCartService } from '../_shared/services/shopping-cart.service';
import { ShoppingCartItem } from '../_shared/app.models';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  public items : Array<ShoppingCartItem> = [];
  private shoppingCartSub : Subscription;
  constructor(private shoppingCart : ShoppingCartService) { }

  ngOnInit() {
    this.shoppingCartSub = this.shoppingCart.getShoppingCart().subscribe((items : Array<ShoppingCartItem>) => {
      this.items = items;
    })
  }

  ngOnDestroy(){
    this.shoppingCartSub.unsubscribe();
  }

  public deleteItem(item : ShoppingCartItem){
    this.shoppingCart.removeItem(item.productId);
  }

  public changeItem(item : ShoppingCartItem){
    this.shoppingCart.updateItem(item);
  }

  public totalPrice(): number {
    return 0; // todo
  }

  public checkout() {
    return; // todo
  }

  public clearCart() {
    this.shoppingCart.clearCart();
  }

}
