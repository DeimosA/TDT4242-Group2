import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { SearchForm } from '../_shared/app.models';


/**
 * Side box for choosing search and filter criteria when listing products
 */
@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit, OnDestroy {

  public formGroup : FormGroup = new FormGroup({
    search: new FormControl(''),
    sort: new FormControl('name ASC'),
    minPrice: new FormControl(0, Validators.min(0)),
    maxPrice: new FormControl(Infinity, Validators.min(0))
  });

  @Output()
  public search_form = new EventEmitter<SearchForm>();

  private formSubscription : Subscription;

  constructor() { }

  ngOnInit() {
    this.formSubscription = this.formGroup.valueChanges
      .pipe(debounceTime(200))
      .subscribe((v) => this.search_form.emit(v))
  }

  ngOnDestroy(){
    this.formSubscription.unsubscribe();
  }

  /**
   * Clear the search and filter to its defaults
   */
  public clearFilter() {
    this.formGroup.reset({
      search: '',
      sort: 'name ASC',
      minPrice: 0,
      maxPrice: Infinity
    });
  }

}
