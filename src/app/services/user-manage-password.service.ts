import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { RequestWrapper } from '../models/request-wrapper';
import { User } from '../models/user';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagePasswordService {
  private userUrl = 'https://archimedes-backend-dev.herokuapp.com/user';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(
    private httpClient: HttpClient,
    @Inject(NotificationService)
    private notificationService: NotificationService
  ) {}

  resetPasswordFor(userToUpdate: User): Observable<RequestWrapper> {
    const resetPasswordUrl = this.userUrl + '/' + 'password';
    return this.httpClient
      .put<RequestWrapper>(resetPasswordUrl, userToUpdate)
      .pipe(catchError(this.handleError<RequestWrapper>('resetpassword')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: Error): Observable<T> => {
      console.error(error);
      this.notificationService.openSnackBar(error.message);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`ActivityService: ${message}`);
  }
}
