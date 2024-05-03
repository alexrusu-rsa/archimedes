import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from '../localstorage-service/localstorage.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  getToken() {
    return localStorage.getItem('accessToken');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('accessToken');
    if (authToken !== null) return true;
    return false;
  }

  doLogout() {
    this.localStorageService.localStorageLogout();
    this.router.navigate(['']);
  }
}
