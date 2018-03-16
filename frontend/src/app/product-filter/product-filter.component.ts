import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from "@angular/platform-browser";
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { SearchForm } from '../_shared/app.models';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit, OnDestroy {

  private formGroup : FormGroup = new FormGroup({
    search: new FormControl(''),
    sort: new FormControl('name ASC'),
    minPrice: new FormControl(0)
  });

  private formSubscription : Subscription;

  @Output()
  private search_form = new EventEmitter<SearchForm>();
  
  constructor() { }

  ngOnInit() {
    this.formSubscription = this.formGroup.valueChanges
      .pipe(debounceTime(200))
      .subscribe((v) => this.search_form.emit(v))
  }

  ngOnDestroy(){
    this.formSubscription.unsubscribe();
  }

}
