import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { RequestWrapper } from '../custom/request-wrapper';
import { User } from '../custom/user';

@Injectable({
  providedIn: 'root',
})
export class UserManagePasswordService {
  private userUrl = ' https://archimedes-backend-dev.herokuapp.com/user';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private httpClient: HttpClient) {}

  resetPasswordFor(userToUpdate: User): Observable<RequestWrapper> {
    const resetPasswordUrl = this.userUrl + '/' + 'password';
    return this.httpClient
      .put<RequestWrapper>(resetPasswordUrl, userToUpdate)
      .pipe(
        tap((_) => this.log(`reset password`)),
        catchError(this.handleError<RequestWrapper>('resetpassword'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: Error): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`ActivityService: ${message}`);
  }
}
