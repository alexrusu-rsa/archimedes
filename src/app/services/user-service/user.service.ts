import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestWrapper } from '../../models/request-wrapper';
import { User } from '../../models/user';
import { ResponseHandlingService } from '../response-handling-service/response-handling.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private responseHandlingService: ResponseHandlingService
  ) {}
  private usersUrl = environment.serviceURL + 'user';

  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getUsers(): Observable<User[]> {
    return this.httpClient
      .get<User[]>(this.usersUrl)
      .pipe(
        catchError(this.responseHandlingService.handleError<User[]>('getUser'))
      );
  }

  getUsersNumber(): Observable<number> {
    return this.httpClient
      .get<number>(this.usersUrl + '/number')
      .pipe(
        catchError(this.responseHandlingService.handleError<number>('getUser'))
      );
  }

  addAdmin(user: User): Observable<User> {
    return this.httpClient
      .post<User>(this.usersUrl + '/first', user, { observe: 'response' })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('First user added!');
          return res.body as User;
        }),
        catchError(this.responseHandlingService.handleError<User>('addAdmin'))
      );
  }

  deleteUser(id: string): Observable<RequestWrapper> {
    const deleteUserUrl = this.usersUrl + '/' + id;
    return this.httpClient
      .delete<RequestWrapper>(deleteUserUrl, { observe: 'response' })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('User deleted');
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>('deleteUser')
        )
      );
  }

  addUser(user: User): Observable<User> {
    return this.httpClient
      .post<User>(this.usersUrl, user, { observe: 'response' })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('User added');
          return res.body as User;
        }),
        catchError(this.responseHandlingService.handleError<User>('addUser'))
      );
  }

  updateUser(user: User): Observable<User> {
    return this.httpClient
      .put(this.usersUrl + '/' + user.id, user, { observe: 'response' })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('User updated');
          return res.body as User;
        }),
        catchError(this.responseHandlingService.handleError<User>('updateUser'))
      );
  }

  getUserTimePerDay(userId: string): Observable<number> {
    return this.httpClient
      .get<number>(this.usersUrl + '/time/' + userId)
      .pipe(
        catchError(
          this.responseHandlingService.handleError<number>('getUserTime')
        )
      );
  }
  resetPasswordFor(userToUpdate: User): Observable<RequestWrapper> {
    const resetPasswordUrl = this.usersUrl + '/' + 'password';
    return this.httpClient
      .put<RequestWrapper>(resetPasswordUrl, userToUpdate, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Password reset');
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>(
            'resetpassword'
          )
        )
      );
  }

  changePasswordFor(
    newPassword: string,
    userId: string
  ): Observable<RequestWrapper> {
    const changePasswordUrl = this.usersUrl + '/' + 'change';
    return this.httpClient
      .put<RequestWrapper>(
        changePasswordUrl,
        { userId, newPassword },
        {
          observe: 'response',
        }
      )
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse(
            'Password changed succesfully'
          );
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>(
            'changepassword'
          )
        )
      );
  }
}
