import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize'

import { MypageComponent } from '../mypage/mypage.component';
import { DismissibleAlertComponent } from '../errors/dismissible-alert/dismissible-alert.component';
import { OrderHistoryListComponent } from '../order-history-list/order-history-list.component';


/**
 * Module for declaring components and modules that need to be shared between several modules
 *
 * Do not import these components and modules directly in each module,
 * but import this module in the respective modules instead
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterializeModule,
  ],
  declarations: [
    MypageComponent,
    DismissibleAlertComponent,
    OrderHistoryListComponent,
  ],
  exports: [
    MypageComponent,
    DismissibleAlertComponent,
    OrderHistoryListComponent,
    CommonModule,
    MaterializeModule,
  ]
})
export class SharedModule { }
