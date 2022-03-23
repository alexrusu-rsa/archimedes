import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient, private notificationService: NotificationService) {}
  private usersUrl = 'http://localhost:3000/user';

  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  getUsers(): Observable<User[]> {
    return this.httpClient
      .get<User[]>(this.usersUrl)
      .pipe(catchError(this.handleError<User[]>('getUser')));
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
