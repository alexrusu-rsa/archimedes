import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  constructor(private http: HttpClient, public router: Router) {}

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    if (authToken !== null) return true;
    return false;
  }

  clearLocalStorage() {
    localStorage.clear();
  }
  doLogout() {
    const removeToken = localStorage.removeItem('access_token');
    window.dispatchEvent(new Event('storage'));
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    if (removeToken === null) {
      this.router.navigate(['']);
    }

  }
}
