import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { UserAuthService } from "../_shared/services/user-auth.service";
import { UserModel } from "../_shared/app.models";

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
    private router: Router,
  ) { }

  ngOnInit() {
    // Subscribe to login and logout user auth events
    this.userAuthEventsSub = this.userAuthService.getUserAuthEvents().subscribe(
      user => {
        this.currentUser = user;
        if (this.currentUser) {
          this.getOrderHistory();
        }
        // if(user == null){
        //   this.router.navigate(['/login']);
        // }
      }, error => {
        alert('An error occurred. Try again later.')
      }
    );
  }

  ngOnDestroy() {
    // Un-subscribe from login and logout user auth events to avoid mem leaks
    this.userAuthEventsSub.unsubscribe();
  }

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

}
