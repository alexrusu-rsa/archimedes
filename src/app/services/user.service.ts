import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestWrapper } from '../models/request-wrapper';
import { User } from '../models/user';
import { ResponseHandlingService } from './response-handling.service';


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

  addUser(user: User): Observable<RequestWrapper> {
    return this.httpClient
      .post<RequestWrapper>(this.usersUrl, user, { observe: 'response' })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('User added');
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>('addUser')
        )
      );
  }

  updateUser(user: User): Observable<RequestWrapper> {
    return this.httpClient
      .put(this.usersUrl + '/' + user.id, user, { observe: 'response' })
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('User updated');
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>('updateUser')
        )
      );
  }
}
