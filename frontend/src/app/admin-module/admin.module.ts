import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../_shared/shared.module';
import { AdminComponent } from './admin/admin.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { UserListComponent } from './user-list/user-list.component';


/**
 * Module for admin functionality
 */
@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
  ],
  declarations: [
    AdminComponent,
    OrderListComponent,
    OrderDetailsComponent,
    UserListComponent,
  ],
})
export class AdminModule { }
