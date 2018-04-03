import { Component, OnInit } from '@angular/core';

import { UserAuthService } from '../../_shared/services/user-auth.service';
import { UserModel } from '../../_shared/app.models';


/**
 * List users and toggle admin status
 */
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userList: UserModel[] = [];
  alertMessage: string = '';

  constructor(
    private userAuthService: UserAuthService,
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  /**
   * Toggle a users admin status
   */
  toggleAdmin(user: UserModel) {
    this.userAuthService.toggleAdmin(user).subscribe((user) => {
      this.loadUsers();
    }, (error) => {
      this.alertMessage = 'An error occurred updating the users admin status: ' + error.status;
    });
  }

  /**
   * Load all users
   */
  private loadUsers() {
    this.userAuthService.getAllUsers().subscribe((users) => {
      this.userList = users;
    }, (error) => {
      this.alertMessage = 'An error occurred getting the user list: ' + error.status;
      this.userList = [];
    });
  }

}
