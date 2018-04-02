import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { ShoppingCartItem, ProductModel } from '../_shared/app.models';

@Component({
  selector: 'app-shopping-cart-list',
  templateUrl: './shopping-cart-list.component.html',
  styleUrls: ['./shopping-cart-list.component.css']
})
export class ShoppingCartListComponent implements OnChanges {

  private products : Map<number, ProductModel> = new Map<number, ProductModel>();

  @Input("items")
  private cartList : Array<ShoppingCartItem> = [];

  @Output("totalPriceChange")
  private totalPriceEmitter = new EventEmitter<number>();

  @Output("itemChange")
  private itemQtyEmitter = new EventEmitter<ShoppingCartItem>();

  @Output("itemDelete")
  private itemDelEmitter = new EventEmitter<ShoppingCartItem>(); 
  private loadedCount = 0;

  constructor() { }

  ngOnChanges() {
    this.fillProducts()
  }

  private fillProducts() {
    this.loadedCount = 0;
    this.cartList
      .filter(item => {
        if(item.productId in this.products){
          this.loadedCount++;
          return false;
        }
        return true;
      })
      .forEach(item => {
        item.product.subscribe(
          (product : ProductModel) => {
            this.loadedCount++;
            this.products[item.productId] = product;
            if(this.loadedCount >= this.cartList.length) {
              // Once all products are loaded update the price
              console.log("Emit", this.totalPrice());
              this.totalPriceEmitter.emit(this.totalPrice());
            }
          }
        );
      });
  }

  private updateQty(event, item : ShoppingCartItem, diff : number) {
    item.quantity += diff;
    this.itemQtyEmitter.emit(item);
    this.totalPriceEmitter.emit(this.totalPrice());
    event.preventDefault();
    event.stopPropagation();
  }

  private deleteItem(event, item : ShoppingCartItem) {
    this.itemDelEmitter.emit(item);
    event.preventDefault();
    event.stopPropagation();
  }

  private productLoaded(item : ShoppingCartItem) {
    return item.productId in this.products;
  }

  private product(item : ShoppingCartItem) {
    return this.products[item.productId];
  }

  private totalCount() : number{
    let count = 0;
    this.cartList.forEach((item) => {
      count += item.quantity 
    });
    return count;
  }

  private totalPrice() : number{
    let totalPrice = 0;
    this.cartList.forEach((item) => {
      const product = this.products[item.productId];
      if(product){
        totalPrice += product.price * item.quantity * product.price_mod;   
      }
    });
    return totalPrice;
  }
  
}
