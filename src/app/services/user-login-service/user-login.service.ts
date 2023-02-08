import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestWrapper } from '../../models/request-wrapper';
import { User } from '../../models/user';
import { NotificationService } from '../notification-service/notification.service';
import { reflectObjectLiteral } from '@angular/compiler-cli/src/ngtsc/reflection';
import { ResponseHandlingService } from '../response-handling-service/response-handling.service';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {

  private authUrl = environment.authServiceURL + 'user';
  httpOptions = {
    header: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private httpClient: HttpClient,
    private responseHandlingService: ResponseHandlingService
  ) {}

  getUser(userId: string): Observable<User> {
    return this.httpClient
      .get<User>(this.authUrl + '/' + userId)
      .pipe(
        catchError(this.responseHandlingService.handleError<User>('getUser'))
      );
  }

  logUserIn(user: User): Observable<RequestWrapper> {
    const logInUrl = this.authUrl + '/creds';
    return this.httpClient
      .post<RequestWrapper>(
        logInUrl,
        {
          username: user.email,
          password: user.password,
        },
        { observe: 'response' }
      )
      .pipe(
        map((res) => {
          this.responseHandlingService.handleResponse('Logged in succesfully');
          return res.body as RequestWrapper;
        }),
        catchError(
          this.responseHandlingService.handleError<RequestWrapper>(
            'userLoggedIn'
          )
        )
      );
  }
}
