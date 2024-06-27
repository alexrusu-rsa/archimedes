import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  LocalStorageKeys,
  LocalStorageService,
} from '../../../../shared/services/localstorage-service/localstorage.service';
import { UserLoginService } from '../user-login-service/user-login.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly service = inject(UserLoginService);
  private readonly router = inject(Router);
  private readonly localStorage = inject(LocalStorageService);

  getToken() {
    return localStorage.getItem(LocalStorageKeys.accessToken);
  }

  getUser() {
    return this.service.getUser();
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem(LocalStorageKeys.accessToken);
    const userId = localStorage.getItem(LocalStorageKeys.userId);
    if (authToken !== null && userId !== null) return true;
    return false;
  }

  doLogout() {
    this.localStorage.localStorageLogout();
    this.router.navigate(['']);
  }
}
