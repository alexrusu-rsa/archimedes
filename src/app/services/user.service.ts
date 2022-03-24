import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { RequestWrapper } from '../models/request-wrapper';
import { User } from '../models/user';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private notificationService: NotificationService
  ) {}
  private usersUrl = 'http://localhost:3000/user';

  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  getUsers(): Observable<User[]> {
    return this.httpClient
      .get<User[]>(this.usersUrl)
      .pipe(catchError(this.handleError<User[]>('getUser')));
  }

  deleteUser(id: string): Observable<RequestWrapper> {
    const deleteUserUrl = this.usersUrl + '/' + id;
    return this.httpClient
      .delete<RequestWrapper>(deleteUserUrl)
      .pipe(catchError(this.handleError<RequestWrapper>('deleteUser')));
  }

  addUser(user: User): Observable<RequestWrapper> {
    return this.httpClient
      .post<RequestWrapper>(this.usersUrl, user)
      .pipe(catchError(this.handleError<RequestWrapper>('addUser')));
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
