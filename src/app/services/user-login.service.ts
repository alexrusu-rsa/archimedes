import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { RequestWrapper } from '../custom/request-wrapper';
import { User } from '../custom/user';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  private usersUrl = ' https://archimedes-backend-dev.herokuapp.com/user';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private httpClient: HttpClient) {}
  getUser(userId: string): Observable<User> {
    return this.httpClient.get<User>(this.usersUrl + '/' + userId).pipe(
      tap((_) => this.log('get User')),
      catchError(this.handleError<User>('getUser'))
    );
  }
  logUserIn(user: User): Observable<RequestWrapper> {
    const logInUrl = this.usersUrl + '/creds';
    return this.httpClient.post<RequestWrapper>(logInUrl, user).pipe(
      tap((_) => this.log(`userLoggedIn `)),
      catchError(this.handleError<RequestWrapper>('userLoggedIn'))
    );
  }

  private log(message: string) {
    console.log(`ActivityService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: Error): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
