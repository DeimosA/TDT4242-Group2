import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ShoppingCartService } from '../_shared/services/shopping-cart.service';


/**
 * Lists the products provided in the productList input
 */
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  @Input()
  productList = [];
  @Input()
  loading: boolean;

  @Output()
  nextPageCb = new EventEmitter();

  constructor(private shoppingCart : ShoppingCartService) { }

  ngOnInit() {
  }

  /**
   * Add a product to the shopping cart
   */
  addToCart(event, id, quantity){
    // adding item ID to cart
    this.shoppingCart.addItem(id, quantity);
    event.preventDefault();
    event.stopPropagation();
  }
}
