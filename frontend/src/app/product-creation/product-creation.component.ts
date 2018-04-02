import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/empty';

import { ProductsService } from '../_shared/services/products.service';
import { ProductModel } from "../_shared/app.models";

declare let Materialize; // To recognize Materialize global


/**
 * Creates a new or edits an existing product
 */
@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.css']
})
export class ProductCreationComponent implements OnInit {

  public loading: boolean = false;
  public product: ProductModel;
  public percent_sale: number;
  public alertMessage: string = '';

  constructor(
    private productsService: ProductsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    let productObs: Observable<ProductModel> = this.activatedRoute.paramMap.switchMap(
      (params: ParamMap) => {
        if (params.has('productId')) {
          // Editing existing product, so load it
          this.loading = true;
          return this.productsService.getProduct(params.get('productId'));
        } else {
          // Not edit so create new
          this.product = <ProductModel>{};
          return Observable.empty();
        }
      });

    productObs.subscribe(product => {
      // Product loaded
      this.product = product;
      this.loading = false;
      this.setPercentSale();
      setTimeout(() => Materialize.updateTextFields(), 5); // Fix to not have labels on top of input text
    }, error => {
      if (error.status) {
        this.alertMessage = 'An error occurred loading the product details: ' + error.status;
      } else {
        console.log(error);
      }
    });
  }

  /**
   * Saves the edited product
   */
  private saveProduct() {
    this.loading = true;
    // Call product service to create a new or update existing product
    this.productsService.postOrUpdateProduct(this.product).subscribe(result => {
      this.loading = false;
      this.router.navigate(['/product', result.id]);
    }, error => {
      this.loading = false;
      if (error.status === 400) {
        this.alertMessage = 'Validation failed. Make sure product name does not already exist';
      } else if (error.status === 401 || error.status === 403) {
        this.alertMessage = 'You must be logged in as admin to create or update products';
      } else if (error.status) {
        this.alertMessage = 'An error occurred saving the product: ' + error.status;
      } else {
        console.log(error);
      }
    });
  }

  /**
   * Calculate the price modifier from a percent value
   */
  private setPriceMod(percent_value: number) {
    this.product.price_mod = 1 - percent_value / 100;
  }

  /**
   * Calculate sale percent value from price modifier
   */
  private setPercentSale() {
    this.percent_sale = (1 - this.product.price_mod) * 100;
  }

}
