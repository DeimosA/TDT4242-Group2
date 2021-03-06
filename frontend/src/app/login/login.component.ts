import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { UserAuthService } from '../_shared/services/user-auth.service';
import { UserModel } from '../_shared/app.models';


/**
 * Page for inputting user credentials to log in a user
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [],
})
export class LoginComponent implements OnInit, OnDestroy {


  public alertMessage: string = '';
  public userCredentials = {
    email: "",
    password: "",
  };
  

  private user: UserModel = null;
  private userAuthEventsSub: Subscription;
  
  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    // Subscribe to login and logout user auth events
    this.userAuthEventsSub = this.userAuthService.getUserAuthEvents().subscribe(
      user => {
        this.user = user;
        if(user != null){
          this.router.navigate(['/mypage']);
        }
      }
    );
  }

  ngOnDestroy() {
    // Un-subscribe from login and logout user auth events to avoid mem leaks
    this.userAuthEventsSub.unsubscribe();
  }

  /**
   * Run when user presses the log in button
   */
  login(){
    // call service object, get observable.
    this.userAuthService.login(this.userCredentials.email, this.userCredentials.password).subscribe(res => {
      // successful login
      this.handleLoginResult(200);
    }, err =>{
      // error
      if (err.status) {
        this.handleLoginResult(err.status);
      } else {
        // UserModel mismatch or unknown error
        console.error(err);
      }
    });
  }

  /**
   * Handle login based on http result status code
   * @param statusCode
   */
  private handleLoginResult(statusCode){
    if(statusCode === 200){
      this.router.navigate(['/']);
    }else if(statusCode === 401){
      // handle username or password wrong
      this.alertMessage = 'Wrong username or password';
    }else{
      // handle system error
      this.alertMessage = 'An unexpected error occurred: ' + statusCode;
    }
  }

}
