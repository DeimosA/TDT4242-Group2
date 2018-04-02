import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

import { ProductsService } from "../_shared/services/products.service";
import { ProductModel, UserModel } from "../_shared/app.models";
import { ShoppingCartService } from '../_shared/services/shopping-cart.service';
import { UserAuthService } from "../_shared/services/user-auth.service";


/**
 * Details page for products
 */
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  public product: ProductModel;
  public itemQuantity: number;

  private userAuthEventsSub: Subscription;
  private user: UserModel;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private shoppingCart : ShoppingCartService,
    private userAuthService: UserAuthService,
  ) { }

  ngOnInit() {
    let productObs: Observable<ProductModel> = this.activatedRoute.paramMap.switchMap(
      (params: ParamMap) => this.productsService.getProduct(params.get('productId')));
    productObs.subscribe(product => this.product = product);

    this.userAuthEventsSub = this.userAuthService.getUserAuthEvents().subscribe(user => {
      this.user = user;
    });
    this.itemQuantity = 1;
  }

  ngOnDestroy() {
    this.userAuthEventsSub.unsubscribe();
  }

  /**
   * Add product to shopping cart
   */
  addToCart(id, quantity){
    // adding item ID to cart
    this.shoppingCart.addItem(id, quantity);
  }

  /**
   * Change the quantity to add to the cart
   */
  quantityChange(value){
    // unable to go below 1 item
    this.itemQuantity = Math.max(this.itemQuantity + value, 1);
  }

}
