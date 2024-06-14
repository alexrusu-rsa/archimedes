import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../shared/services/localstorage-service/localstorage.service';
import { UserLoginService } from '../user-login-service/user-login.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly service = inject(UserLoginService);
  private readonly router = inject(Router);
  private readonly localStorage = inject(LocalStorageService);

  getToken() {
    return localStorage.getItem('access_token');
  }

  getUser(id) {
    return this.service.getUser(id);
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    const userId = localStorage.getItem('userId');
    if (authToken !== null && userId !== null) return true;
    return false;
  }

  doLogout() {
    this.localStorage.localStorageLogout();
    this.router.navigate(['']);
  }
}
