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

  @Output("itemChange")
  private itemQtyEmitter = new EventEmitter<ShoppingCartItem>();

  @Output("itemDelete")
  private itemDelEmitter = new EventEmitter<ShoppingCartItem>();

  constructor() { }

  ngOnChanges() {
    this.fillProducts()
  }

  private fillProducts():void {
    this.cartList
      .filter(item => !(item.productId in this.products))
      .forEach(item => item.product.subscribe(
        (product : ProductModel) => this.products[item.productId] = product )
      );
  }

  private updateQty(event, item : ShoppingCartItem, diff : number) {
    item.quantity += diff;
    this.itemQtyEmitter.emit(item);
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

}
