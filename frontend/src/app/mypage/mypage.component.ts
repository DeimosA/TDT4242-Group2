import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { UserAuthService } from '../_shared/services/user-auth.service';
import { OrderModel, UserModel } from '../_shared/app.models';


/**
 * Show info related to a user
 */
@Component({
  selector: 'app-mypage',
  templateUrl: './mypage.component.html',
  styleUrls: ['./mypage.component.css']
})
export class MypageComponent implements OnInit, OnDestroy {

  private currentUser: UserModel;
  private userAuthEventsSub: Subscription;
  private orderHistory: object[];

  constructor(
    private userAuthService: UserAuthService,
  ) { }

  ngOnInit() {
    // Subscribe to login and logout user auth events
    this.userAuthEventsSub = this.userAuthService.getUserAuthEvents().subscribe(
      user => {
        this.currentUser = user;
        if (this.currentUser) {
          this.getOrderHistory();
        }
      }, error => {
        alert('An error occurred. Try again later.')
      }
    );
  }

  ngOnDestroy() {
    // Un-subscribe from login and logout user auth events to avoid mem leaks
    this.userAuthEventsSub.unsubscribe();
  }

  /**
   * Get a users order history
   */
  private getOrderHistory() {
    this.userAuthService.getOrderHistory(this.currentUser.id).subscribe(
      result => {
        this.orderHistory = result;
      }, error => {
        // TODO use fancy alert
        alert('Error getting user history' + error.status);
      }
    );
  }

  /**
   * Dismiss an order
   */
  private dismissOrder(order: OrderModel) {
    this.userAuthService.dismissOrder(order.id).subscribe(
      (next) => {
        this.getOrderHistory();
      }, (error) => {
        // TODO use fancy alert
        alert('An error occurred cancelling your order. Try again later: ' + error.status);
      }
    );
  }

}
