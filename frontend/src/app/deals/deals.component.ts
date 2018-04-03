import { Component, OnInit } from '@angular/core';

import { ProductModel } from "../_shared/app.models";
import { ProductsService } from "../_shared/services/products.service";


/**
 * Shows all the products that are on sale
 */
@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {

  saleProducts: ProductModel[];

  constructor(
    private productsService: ProductsService,
  ) { }

  ngOnInit() {
    this.productsService.getSaleProducts().subscribe((response) => {
      this.saleProducts = response;
    });
  }

}
