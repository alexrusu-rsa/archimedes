import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from '../localstorage-service/localstorage.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(
    private http: HttpClient,
    public router: Router,
    private localStorageService: LocalStorageService
  ) {}

  getToken() {
    return localStorage.getItem('access_token');
  }

  getCurrentUser(): Observable<User> {
    const userPath = 'user/';
    if (localStorage.getItem('userId')) {
      return this.http.get<User>(
        environment.serviceURL + userPath + localStorage.getItem('userId')
      );
    }

    return null;
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
