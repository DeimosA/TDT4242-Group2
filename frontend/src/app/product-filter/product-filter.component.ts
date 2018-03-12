import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { DOCUMENT } from "@angular/platform-browser";

import { debounceTime } from 'rxjs/operators';

import { FormControl, FormGroup } from '@angular/forms';

import { SearchForm } from '../_shared/app.models';
import { Subscription } from 'rxjs/Subscription';




@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit, OnDestroy {

  // Our form data bindings
  private formGroup : FormGroup = new FormGroup({
    search: new FormControl(""),
    sort: new FormControl("name ASC"),
    minPrice: new FormControl(0)
  });

  private formSubscription : Subscription;

   // search for both name and description
  @Output()
  private search_form = new EventEmitter<SearchForm>();
  
  constructor() { }

  ngOnInit() {
    // Subscribe to changes from the form
    this.formSubscription = this.formGroup.valueChanges
      .pipe(debounceTime(200))
      .subscribe((v) => {
        this.search_form.emit(v);
      })
  }

  ngOnDestroy(){
    this.formSubscription.unsubscribe();
  }

}
