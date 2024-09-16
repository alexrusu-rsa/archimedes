import { Injectable, effect, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum LocalStorageKeys {
  darkMode = 'darkMode',
  accessToken = 'access_token',
  role = 'role',
  userId = 'userId',
}

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  accessTokenValue = new BehaviorSubject(this.accessToken);
  roleValue = new BehaviorSubject(this.role);
  userIdValue = new BehaviorSubject(this.userId);
  darkMode = signal<boolean>(true);

  constructor() {
    const checkDarkMode = localStorage.getItem(LocalStorageKeys.darkMode);
    if (!(checkDarkMode === undefined || checkDarkMode == null)) {
      this.darkMode.set(checkDarkMode === 'true');
    }
    effect(() => {
      localStorage.setItem(
        LocalStorageKeys.darkMode,
        this.darkMode().toString()
      );
    });
  }

  localStorageLogout() {
    this.accessToken = null;
    this.role = null;
    this.userId = null;
  }

  updateDarkMode() {
    this.darkMode.update((darkMode) => !darkMode);
  }

  set accessToken(value: string | null) {
    this.accessTokenValue.next(value);
    if (value) localStorage.setItem(LocalStorageKeys.accessToken, value);
    else {
      localStorage.removeItem(LocalStorageKeys.accessToken);
    }
  }

  get accessToken(): string | null {
    return localStorage.getItem(LocalStorageKeys.accessToken);
  }

  set role(value: string | null) {
    this.roleValue.next(value);
    if (value) localStorage.setItem(LocalStorageKeys.role, value);
    else {
      localStorage.removeItem(LocalStorageKeys.role);
    }
  }

  get role(): string | null {
    return localStorage.getItem(LocalStorageKeys.role);
  }

  set userId(value: string | null) {
    this.userIdValue.next(value);
    if (value) localStorage.setItem(LocalStorageKeys.userId, value);
    else {
      localStorage.removeItem(LocalStorageKeys.userId);
    }
  }

  get userId(): string | null {
    return localStorage.getItem(LocalStorageKeys.userId);
  }
}
