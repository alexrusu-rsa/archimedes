import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../shared/services/localstorage-service/localstorage.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = {};
  constructor(
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
    this.localStorageService.localStorageLogout();
    this.router.navigate(['']);
  }
}
