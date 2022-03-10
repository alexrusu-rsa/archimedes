import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    console.log(`ActivityService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: Error): Observable<T> => {
      console.error(error);
      this.notificationService.openSnackBar(error.message);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
