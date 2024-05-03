import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginResponse } from 'src/app/ng-modules/shared/models/loginResponse.model';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  loginResponseValue$ = new BehaviorSubject<LoginResponse | null>(null);

  localStorageLogout() {
    this.loginResponse = null;
  }

  set loginResponse(loginResponse: LoginResponse | null) {
    if (loginResponse?.accessToken && loginResponse?.currentUser) {
      this.loginResponseValue$.next(loginResponse);
      localStorage.setItem('accessToken', loginResponse?.accessToken);
      localStorage.setItem(
        'currentUser',
        JSON.stringify(loginResponse?.currentUser)
      );
    } else this.loginResponseValue$.next(null);
  }

  get loginResponse(): LoginResponse | null {
    const accessToken = localStorage.getItem('accessToken');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const loginResponse = {
      accessToken,
      currentUser,
    };

    if (accessToken && currentUser) return loginResponse;
    else return null;
  }
}
