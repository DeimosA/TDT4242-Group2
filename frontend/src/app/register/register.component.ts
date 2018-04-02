import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserAuthService } from '../_shared/services/user-auth.service';


/**
 * Page for registering a new user
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [],
})
export class RegisterComponent implements OnInit {

  public userCredentials = {
    email: "",
    password: "",
  };
  public alertMessage: string = '';

  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  /**
   * Run when user presses register button
   */
  register(){
    this.userAuthService.register(this.userCredentials.email, this.userCredentials.password).subscribe(res => {
      this.handleRegisterResult(201);
    }, err =>{
      if (err.status) {
        this.handleRegisterResult(err.status);
      } else {
        console.log(err);
      }
    });
  }

  /**
   * Handle registering based on http result status code
   */
  private handleRegisterResult(statusCode){
    if(statusCode === 201){
      this.userAuthService.login(this.userCredentials.email, this.userCredentials.password).subscribe(result => {
        this.router.navigate(['/']);
      });
    } else if(statusCode === 400) {
      this.alertMessage = 'A user with this e-mail already exist';
    } else {
      this.alertMessage = 'An unexpected error occurred: ' + statusCode;
    }
  }

}
