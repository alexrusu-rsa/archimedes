import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { LocalStorageService } from './localstorage.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  constructor(
    private http: HttpClient,
    public router: Router,
    private localStorageService: LocalStorageService
  ) {}

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    if (authToken !== null) return true;
    return false;
  }

  doLogout() {
    this.localStorageService.accessToken = '';
    this.localStorageService.role = '';
    this.localStorageService.userId = '';
    localStorage.clear();
    this.router.navigate(['']);
  }
}
