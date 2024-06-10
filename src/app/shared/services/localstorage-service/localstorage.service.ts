import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  accessTokenValue = new BehaviorSubject(this.accessToken);
  roleValue = new BehaviorSubject(this.role);
  userIdValue = new BehaviorSubject(this.userId);

  localStorageLogout() {
    this.accessToken = null;
    this.role = null;
    this.userId = null;
  }

  set accessToken(value: string | null) {
    this.accessTokenValue.next(value);
    if (value) localStorage.setItem('access_token', value);
    else {
      localStorage.removeItem('access_token');
    }
  }

  get accessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  set role(value: string | null) {
    this.roleValue.next(value);
    if (value) localStorage.setItem('role', value);
    else {
      localStorage.removeItem('role');
    }
  }

  get role(): string | null {
    return localStorage.getItem('role');
  }

  set userId(value: string | null) {
    this.userIdValue.next(value);
    if (value) localStorage.setItem('userId', value);
    else {
      localStorage.removeItem('userId');
    }
  }

  get userId(): string | null {
    return localStorage.getItem('userId');
  }
}
