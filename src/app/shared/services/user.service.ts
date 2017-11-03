import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Router } from '@angular/router';

import { User } from '../../models/user.interface'
import { environment } from '../../../environments/environment';

@Injectable()
export class UserService {
  user: Subject<User>;
  user$: Observable<User>;
  router: Router;

  constructor(private http: Http,  private _router: Router) { 
    this.router = _router;
    this.user = new Subject();
    this.user$ = this.user.asObservable();

    var token = localStorage.getItem('token');
    var email = localStorage.getItem('email');

    if (token && email) {
      // the browser posesses a token and user email, attempt a look up
      // console.log('reauthenticating based on local storage');
      this.reauth(token, email);
    }
  }

  // service command to update the user
  sendUser(user) {
    this.user.next(user);
  }

  signout() {
    localStorage.clear();
    this.user.next();
  }

  reauth(token, email) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);

    this.http.get(environment.api + '/users/' + email, { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      this.user.next(data);
      // console.log('user has been reauthenticated.');
      // console.log(data);
    })

  }

  authenticate(data) {
    var email = data.email;
    var password = data.password;

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    this.http.post(environment.api + '/users/auth', { email, password }, 
      { headers: headers })
      .map(res => res.json())
      .subscribe(
      data => this.saveUser(data),
      err => this.logError(err),
      () => this.completeAuth('/shop'));
  }

  create(data) {
    var email = data.email;
    var password = data.password;

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(environment.api + '/users', { email, password },
      { headers: headers })
      .map(res => res.json())
      .subscribe(
      data => this.saveUser(data),
      err => this.logError(err),
      () => this.completeAuth('/shop'));
  }

  saveUser(user) {
    if (user) {
      this.sendUser(user);
      localStorage.setItem('token', user.token);
      localStorage.setItem('email', user.email);
    }
  }

  logError(err) { }

  completeAuth(route) {
    this.router.navigateByUrl(route);
  }

}
