import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  _userIsAuthenticated: boolean = false;

  constructor() {}

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }
  login() {
    this._userIsAuthenticated = true;
  }

  logout() {
    this._userIsAuthenticated = false;
  }
}
