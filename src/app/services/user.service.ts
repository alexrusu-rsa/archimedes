import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}
  private usersUrl = 'http://localhost:3000/user';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  async getUsers(): Observable<User[]> {
    return this.httpClient
      .get<User>(this.usersUrl)
      .pipe(catchError(this.handleError<User>('getUser')));
  }
}
