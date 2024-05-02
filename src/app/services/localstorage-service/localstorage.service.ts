import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginResponse } from 'src/app/ng-modules/shared/models/loginResponse.model';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  loginResponseValue$ = new BehaviorSubject<LoginResponse>(null);

  localStorageLogout() {
    this.loginResponse = null;
  }

  set loginResponse(loginResponse: LoginResponse | null) {
    this.loginResponseValue$.next(loginResponse);
    if (loginResponse.access_token)
      localStorage.setItem('access_token', loginResponse.access_token);
    else {
      localStorage.removeItem('access_token');
    }
    if (loginResponse.role)
      localStorage.setItem('access_token', loginResponse.role);
    else {
      localStorage.removeItem('role');
    }
    if (loginResponse.userId)
      localStorage.setItem('access_token', loginResponse.userId);
    else {
      localStorage.removeItem('userId');
    }
  }

  get loginResponse(): LoginResponse | null {
    const loginReponse = {
      access_token: localStorage.getItem('access_token'),
      role: localStorage.getItem('role'),
      userId: localStorage.getItem('userId'),
    };
    return loginReponse;
  }
}
