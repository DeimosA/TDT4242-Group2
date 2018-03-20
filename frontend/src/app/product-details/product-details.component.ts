import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

import { ProductsService } from "../_shared/services/products.service";
import { ProductModel, UserModel } from "../_shared/app.models";
import { ShoppingCartService } from '../_shared/services/shopping-cart.service';
import { UserAuthService } from "../_shared/services/user-auth.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  private product: ProductModel;
  private user: UserModel;
  private userAuthEventsSub: Subscription;
  private itemQTY: number;

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
    this.itemQTY = 1;
  }

  ngOnDestroy() {
    this.userAuthEventsSub.unsubscribe();
  }

  addToCart(id, qty){
    // adding item ID to cart
    this.shoppingCart.addItem(id, qty);
  }

  quantityChange(value){
    // unable to go below 1 item
    this.itemQTY = Math.max(this.itemQTY + value, 1);
  }

}
