import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { UserListComponent } from './user-list/user-list.component';
import { MypageComponent } from '../mypage/mypage.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: MypageComponent,
      },
      {
        path: 'orders',
        children: [
          {
            path: ':orderId',
            component: OrderDetailsComponent,
          },
          {
            path: '',
            component: OrderListComponent,
          },
        ],
      },
      {
        path: 'users',
        component: UserListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
