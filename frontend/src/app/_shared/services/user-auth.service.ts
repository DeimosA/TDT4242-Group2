import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { UserModel, OrderModel } from "../app.models";


/**
 * User authentication and other user related queries
 */
@Injectable()
export class UserAuthService {

  private userAuthEvents: BehaviorSubject<UserModel> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Log in an existing user with an e-mail and password
   * @param {string} email
   * @param {string} password
   * @returns {Observable<UserModel>}
   */
  login(email: string, password: string): Observable<UserModel> {
    const body = {
      email: email,
      password: password,
    };
    const url = '/api/user/login';
    return this.http.post(url, body)
      .map(result => new UserModel(result))
      .do(result => this.userLoggedIn(result));
  }

  /**
   * Logs out a user
   * @returns {Observable<Object>}
   */
  logout(): Observable<object>{
    const url = '/api/user/logout';
    return this.http.post(url, {}).do(
      result => this.userLoggedOut(),
    );
  }

  /**
   * Register a new user
   * @param {string} email
   * @param {string} password
   * @returns {Observable<Object>}
   */
  register(email: string, password: string): Observable<object>{
    const body = {
      email: email,
      password: password,
    };
    const url = '/api/user';
    return this.http.post(url, body)
  }

  /**
   * Get the currently logged in user, if any
   * @returns {Observable<UserModel>}
   */
  getCurrentUser(): Observable<UserModel> {
    const url = '/api/user/current';
    return this.http.get(url)
      .map(result => new UserModel(result))
      .do(result => this.userLoggedIn(result));
  }

  /**
   * Get a users order history
   * @param {number | string} userId
   * @returns {Observable<object[]>}
   */
  getOrderHistory(userId: number | string): Observable<OrderModel[]> {
    const url = `/api/user/${userId}?populate=order_history`;
    return this.http.get<OrderModel[]>(url).map(result => new UserModel(result).order_history);
  }

  /**
   * Get all the users and their details
   * @returns {Observable<UserModel[]>}
   */
  getAllUsers(): Observable<UserModel[]> {
    const url = '/api/user?limit=100';
    return this.http.get<UserModel[]>(url);
  }

  /**
   * Toggle a users admin status
   * @param {UserModel} user
   * @returns {Observable<UserModel>}
   */
  toggleAdmin(user: UserModel): Observable<UserModel> {
    const url = `/api/user/${user.id}/${user.isAdmin ? 'removeadmin' : 'makeadmin'}`;
    return this.http.post<UserModel>(url, {});
  }

  /**
   * Return an observable that can be subscribed to and listen for login or logout events
   * @returns {Observable<Object>}
   */
  getUserAuthEvents(): Observable<UserModel> {
    return this.userAuthEvents.asObservable();
  }

  /**
   * Stuff to do when a user logs in
   * @param {UserModel} user
   */
  private userLoggedIn(user: UserModel): void {
    this.userAuthEvents.next(user);
  }

  /**
   * Stuff to do when a user logs out
   */
  private userLoggedOut(): void {
    this.userAuthEvents.next(null);
  }
}
