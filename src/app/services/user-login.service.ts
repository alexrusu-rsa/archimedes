import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { RequestWrapper } from '../models/request-wrapper';
import { User } from '../models/user';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  private usersUrl = 'https://archimedes-backend-dev.herokuapp.com/user';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private httpClient: HttpClient,
    @Inject(NotificationService)
    private notificationService: NotificationService
  ) {}
  getUser(userId: string): Observable<User> {
    return this.httpClient
      .get<User>(this.usersUrl + '/' + userId)
      .pipe(catchError(this.handleError<User>('getUser')));
  }
  logUserIn(user: User): Observable<RequestWrapper> {
    const logInUrl = this.usersUrl + '/creds';
    return this.httpClient
      .post<RequestWrapper>(logInUrl, user)
      .pipe(catchError(this.handleError<RequestWrapper>('userLoggedIn')));
  }

  private log(message: string) {
    console.log(`LogUserInService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (err: HttpErrorResponse): Observable<T> => {
      console.error(err);
      this.notificationService.openSnackBar(
        err.error.message,
        err.error.statusCode
      );
      this.log(`${operation} failed: ${err.message}`);
      return of(result as T);
    };
  }
}
