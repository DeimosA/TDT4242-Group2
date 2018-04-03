import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ShoppingCartItem } from '../app.models';
import { ProductsService } from './products.service';


/**
 * Service for everything shopping cart related
 */
@Injectable()
export class ShoppingCartService {
  private cart : Array<ShoppingCartItem>;


  private cartSub : BehaviorSubject<ShoppingCartItem[]>;

  constructor(private prodService: ProductsService) {
    try{
      this.cart = (localStorage.getItem("shopping-cart") ? JSON.parse(localStorage.getItem("shopping-cart")) : []).map((data) => {
        if("prodId" in data && "qty" in data){
          return new ShoppingCartItem((id : number) => {
            return prodService.getProduct(id);
          }, data.prodId, data.qty);
        }
      }).filter((e) => e != null);

    } catch(err) {
      console.error(err);
      // Loading shopping cart failed
      this.cart = [];
    }
    this.cartSub = new BehaviorSubject(this.cart.slice());
    this.updateAndNotify();
  }

  /**
   * Find an item in the cart
   */
  private findItem(id: number) : ShoppingCartItem{
    return this.cart.find((e) => e.productId == id);
  }

  /**
   * Add an item to the cart
   */
  public addItem(productId : number, qty : number = 1){
    let item = this.findItem(productId);
    if(!item){
      item = new ShoppingCartItem((id : number) => {
        return this.prodService.getProduct(id);
      }, productId, qty);
      this.cart.push(item);
    } else {
      item.quantity += qty;
    }
    this.updateAndNotify();
  }

  /**
   * Remove an item from the cart
   */
  public removeItem(productId : number){
    this.cart = this.cart.filter((e) => e.productId != productId);
    this.updateAndNotify();
  }

  /**
   * Clear all items in the cart
   */
  public clearCart() {
    this.cart = [];
    this.updateAndNotify();
  }

  /**
   * Update item quantity
   */
  public updateItem(newItem : ShoppingCartItem){
    let item = this.findItem(newItem.productId);
    if(item){
      item.quantity = Math.max(newItem.quantity,1);
    }
    this.updateAndNotify();
  }

  /**
   * Get an observable that fires on cart changes
   */
  public getShoppingCart() : Observable<Array<ShoppingCartItem>>{
    return this.cartSub.asObservable();
  }

  /**
   * Trigger a cart subscription notification
   */
  private updateAndNotify(){
    this.cartSub.next(this.cart.slice());
    localStorage.setItem("shopping-cart", JSON.stringify(this.cart.map((e) => {
      return {prodId: e.productId, qty: e.quantity};
    })));
  }

}
